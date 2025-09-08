import { NextRequest, NextResponse } from 'next/server';
import { getCertificateData } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { certificateNumber: string } }
) {
  try {
    const { certificateNumber } = params;
    
    if (!certificateNumber) {
      return NextResponse.json(
        { error: 'Certificate number is required' },
        { status: 400 }
      );
    }
    
    const certificate = getCertificateData(certificateNumber);
    
    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }
    
    const today = new Date();
    const expiryDate = new Date(certificate.validity_period);
    const isExpired = today > expiryDate;
    
    return NextResponse.json({
      ...certificate,
      isExpired,
      daysUntilExpiry: isExpired ? 0 : Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    });
    
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificate data' },
      { status: 500 }
    );
  }
}