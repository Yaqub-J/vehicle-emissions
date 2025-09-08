import { NextRequest, NextResponse } from 'next/server';
import { 
  insertVehicle, 
  insertTestResult, 
  generateCertificateNumber, 
  checkPassFail 
} from '@/lib/database';
import { validateFormData, VehicleFormData } from '@/lib/validation';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const formData: VehicleFormData = await request.json();
    
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const vehicleData = {
      vin: formData.vin.toUpperCase(),
      license_plate: formData.license_plate.toUpperCase(),
      make: formData.make,
      model: formData.model,
      year: formData.year,
      owner_name: formData.owner_name,
      owner_phone: formData.owner_phone
    };

    const vehicleResult = insertVehicle(vehicleData);
    const vehicleId = vehicleResult.lastInsertRowid as number;

    const certificateNumber = generateCertificateNumber();
    const passFailStatus = checkPassFail(
      formData.co_level,
      formData.hc_level,
      formData.nox_level,
      formData.pm_level
    );

    const testDate = new Date().toISOString().split('T')[0];
    const validityPeriod = new Date();
    validityPeriod.setFullYear(validityPeriod.getFullYear() + 1);

    const qrData = {
      certificate_number: certificateNumber,
      license_plate: formData.license_plate.toUpperCase(),
      test_date: testDate,
      expiry_date: validityPeriod.toISOString().split('T')[0],
      verification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify/${certificateNumber}`
    };

    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData));

    const testData = {
      vehicle_id: vehicleId,
      test_date: testDate,
      co_level: formData.co_level,
      hc_level: formData.hc_level,
      nox_level: formData.nox_level,
      pm_level: formData.pm_level,
      pass_fail_status: passFailStatus,
      certificate_number: certificateNumber,
      qr_code_data: qrCodeDataUrl,
      validity_period: validityPeriod.toISOString().split('T')[0]
    };

    const testResult = insertTestResult(testData);

    return NextResponse.json({
      success: true,
      testId: testResult.lastInsertRowid,
      certificateNumber,
      passFailStatus,
      vehicleId
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to save vehicle data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}