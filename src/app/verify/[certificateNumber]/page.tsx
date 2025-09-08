'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
  vin: string;
  license_plate: string;
  make: string;
  model: string;
  year: number;
  owner_name: string;
  owner_phone: string;
  isExpired: boolean;
  daysUntilExpiry: number;
}

export default function VerifyCertificate() {
  const params = useParams();
  const certificateNumber = params.certificateNumber as string;
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificate = useCallback(async () => {
    try {
      const response = await fetch(`/api/verify/${certificateNumber}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch certificate');
        return;
      }

      setCertificate(data);
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching certificate:', err);
    } finally {
      setLoading(false);
    }
  }, [certificateNumber]);

  useEffect(() => {
    if (certificateNumber) {
      fetchCertificate();
    }
  }, [certificateNumber, fetchCertificate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Verifying certificate...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return null;
  }

  const getStatusColor = (status: string) => {
    return status === 'PASS' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getExpiryStatus = () => {
    if (certificate.isExpired) {
      return { text: 'EXPIRED', color: 'text-red-600 bg-red-100' };
    } else if (certificate.daysUntilExpiry <= 30) {
      return { text: `Expires in ${certificate.daysUntilExpiry} days`, color: 'text-yellow-600 bg-yellow-100' };
    } else {
      return { text: `Valid for ${certificate.daysUntilExpiry} days`, color: 'text-green-600 bg-green-100' };
    }
  };

  const expiryStatus = getExpiryStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Certificate Verification</h1>
          <p className="text-gray-600">Official Vehicle Emissions Test Certificate</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Status Header */}
          <div className={`p-6 ${certificate.pass_fail_status === 'PASS' ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(certificate.pass_fail_status)}`}>
                  {certificate.pass_fail_status === 'PASS' ? (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  {certificate.pass_fail_status}
                </div>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${expiryStatus.color}`}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {expiryStatus.text}
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="p-6">
            {/* Certificate Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Certificate Information</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Certificate Number:</dt>
                    <dd className="font-mono text-gray-900">{certificate.certificate_number}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Test Date:</dt>
                    <dd className="text-gray-900">{new Date(certificate.test_date).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Valid Until:</dt>
                    <dd className="text-gray-900">{new Date(certificate.validity_period).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Information</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">License Plate:</dt>
                    <dd className="font-mono text-gray-900">{certificate.license_plate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Make & Model:</dt>
                    <dd className="text-gray-900">{certificate.make} {certificate.model}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Year:</dt>
                    <dd className="text-gray-900">{certificate.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">VIN:</dt>
                    <dd className="font-mono text-sm text-gray-900">{certificate.vin}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Owner Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Owner Information</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Name:</dt>
                  <dd className="text-gray-900">{certificate.owner_name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Phone:</dt>
                  <dd className="text-gray-900">{certificate.owner_phone}</dd>
                </div>
              </dl>
            </div>

            {/* Emissions Results */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Emissions Test Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Parameter</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Result</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Limit</th>
                      <th className="border border-gray-200 px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'CO (% volume)', value: certificate.co_level, limit: 4.5 },
                      { name: 'HC (ppm)', value: certificate.hc_level, limit: 1200 },
                      { name: 'NOx (ppm)', value: certificate.nox_level, limit: 3000 },
                      { name: 'PM (mg/m³)', value: certificate.pm_level, limit: 2.5 }
                    ].map((emission, index) => {
                      const status = emission.value <= emission.limit ? 'PASS' : 'FAIL';
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2">{emission.name}</td>
                          <td className="border border-gray-200 px-4 py-2 font-mono">{emission.value}</td>
                          <td className="border border-gray-200 px-4 py-2">≤ {emission.limit}</td>
                          <td className="border border-gray-200 px-4 py-2 text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                This certificate is issued by an authorized emissions testing station.
              </div>
              <Link 
                href="/"
                className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                New Test
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}