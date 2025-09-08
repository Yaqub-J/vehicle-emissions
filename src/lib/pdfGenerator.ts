import jsPDF from 'jspdf';

interface CertificateData {
  id: number;
  certificate_number: string;
  test_date: string;
  validity_period: string;
  pass_fail_status: 'PASS' | 'FAIL';
  co_level: number;
  hc_level: number;
  nox_level: number;
  pm_level: number;
  qr_code_data: string;
  vin: string;
  license_plate: string;
  make: string;
  model: string;
  year: number;
  owner_name: string;
  owner_phone: string;
}

export const generateCertificatePDF = (data: CertificateData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FEDERAL REPUBLIC OF NIGERIA', pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('MINISTRY OF ENVIRONMENT', pageWidth / 2, 35, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('VEHICLE EMISSIONS TEST CERTIFICATE', pageWidth / 2, 45, { align: 'center' });
  
  // Certificate number and status
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Certificate Number: ${data.certificate_number}`, margin, 60);
  
  // Status badge
  const statusColor = data.pass_fail_status === 'PASS' ? [34, 197, 94] : [239, 68, 68];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.rect(pageWidth - 60, 52, 40, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(data.pass_fail_status, pageWidth - 40, 59, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  // Test information
  doc.setFontSize(12);
  doc.text(`Test Date: ${new Date(data.test_date).toLocaleDateString()}`, margin, 75);
  doc.text(`Valid Until: ${new Date(data.validity_period).toLocaleDateString()}`, margin, 85);
  
  // Vehicle information section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('VEHICLE INFORMATION', margin, 105);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  let yPos = 120;
  
  doc.text(`VIN: ${data.vin}`, margin, yPos);
  doc.text(`License Plate: ${data.license_plate}`, margin, yPos + 10);
  doc.text(`Make: ${data.make}`, margin, yPos + 20);
  doc.text(`Model: ${data.model}`, margin, yPos + 30);
  doc.text(`Year: ${data.year}`, margin, yPos + 40);
  
  // Owner information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('OWNER INFORMATION', margin, yPos + 60);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  yPos += 75;
  
  doc.text(`Name: ${data.owner_name}`, margin, yPos);
  doc.text(`Phone: ${data.owner_phone}`, margin, yPos + 10);
  
  // Emissions test results
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EMISSIONS TEST RESULTS', margin, yPos + 30);
  
  yPos += 45;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Table headers
  doc.setFont('helvetica', 'bold');
  doc.text('Parameter', margin, yPos);
  doc.text('Result', margin + 60, yPos);
  doc.text('Limit', margin + 100, yPos);
  doc.text('Status', margin + 140, yPos);
  
  // Draw line under headers
  doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
  
  yPos += 15;
  doc.setFont('helvetica', 'normal');
  
  // Emission results
  const emissions = [
    { name: 'CO (% volume)', value: data.co_level, limit: 4.5, unit: '%' },
    { name: 'HC (ppm)', value: data.hc_level, limit: 1200, unit: 'ppm' },
    { name: 'NOx (ppm)', value: data.nox_level, limit: 3000, unit: 'ppm' },
    { name: 'PM (mg/m³)', value: data.pm_level, limit: 2.5, unit: 'mg/m³' }
  ];
  
  emissions.forEach((emission) => {
    const status = emission.value <= emission.limit ? 'PASS' : 'FAIL';
    const statusColor = status === 'PASS' ? [34, 197, 94] : [239, 68, 68];
    
    doc.text(emission.name, margin, yPos);
    doc.text(`${emission.value} ${emission.unit}`, margin + 60, yPos);
    doc.text(`≤ ${emission.limit} ${emission.unit}`, margin + 100, yPos);
    
    // Status indicator
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(status, margin + 140, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    yPos += 12;
  });
  
  // Overall result
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const overallStatusColor = data.pass_fail_status === 'PASS' ? [34, 197, 94] : [239, 68, 68];
  doc.setTextColor(overallStatusColor[0], overallStatusColor[1], overallStatusColor[2]);
  doc.text(`OVERALL RESULT: ${data.pass_fail_status}`, margin, yPos);
  
  // Reset color
  doc.setTextColor(0, 0, 0);
  
  // Add QR code
  if (data.qr_code_data) {
    try {
      doc.addImage(data.qr_code_data, 'PNG', pageWidth - 70, yPos + 10, 40, 40);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Scan QR code to verify', pageWidth - 70, yPos + 55, { maxWidth: 40 });
    } catch (error) {
      console.error('Error adding QR code to PDF:', error);
    }
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('This certificate is valid for 12 months from the test date.', margin, 280);
  doc.text('For verification, visit our website or scan the QR code.', margin, 285);
  
  // Official stamp placeholder
  doc.setFontSize(10);
  doc.text('Official Stamp:', margin, 260);
  doc.rect(margin + 50, 250, 60, 20);
  doc.setFontSize(8);
  doc.text('(Testing Station Seal)', margin + 55, 265);
  
  return doc;
};

export const generatePDFBuffer = (data: CertificateData): Uint8Array => {
  const doc = generateCertificatePDF(data);
  return doc.output('arraybuffer');
};