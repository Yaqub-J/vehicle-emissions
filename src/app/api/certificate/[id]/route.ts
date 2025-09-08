import { NextRequest, NextResponse } from 'next/server';
import { getCertificateDataById } from '@/lib/database';
import { generatePDFBuffer } from '@/lib/pdfGenerator';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id;
    
    if (!testId) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      );
    }
    
    // Get certificate data by test ID
    const certificateData = getCertificateDataById(testId);
    
    if (!certificateData) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }
    
    // Generate PDF
    const pdfBuffer = generatePDFBuffer(certificateData);
    
    // Create response with PDF
    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate_${certificateData.certificate_number}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    return response;
    
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate PDF' },
      { status: 500 }
    );
  }
}