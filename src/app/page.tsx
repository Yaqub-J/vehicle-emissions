'use client';

import { useState } from 'react';
import VehicleForm from '@/components/VehicleForm';
import RecentTests from '@/components/RecentTests';
import { VehicleFormData } from '@/lib/validation';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFormSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      setSuccessMessage(
        `Test completed! Certificate ${result.certificateNumber} has been generated. 
         Result: ${result.passFailStatus}. You can download the certificate from the recent tests list below.`
      );
      
      // Trigger refresh of recent tests
      setRefreshTrigger(prev => prev + 1);

      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 10000);

    } catch (error) {
      console.error('Submit error:', error);
      throw error; // Re-throw to let form handle the error display
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        {successMessage && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Success!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{successMessage}</p>
                  </div>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="inline-flex text-green-400 hover:text-green-600"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <VehicleForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />

        {/* Recent Tests */}
        <RecentTests refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}