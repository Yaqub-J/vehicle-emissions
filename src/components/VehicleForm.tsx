'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VehicleFormData, validateFormData } from '@/lib/validation';

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function VehicleForm({ onSubmit, isSubmitting }: VehicleFormProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [passFailStatus, setPassFailStatus] = useState<'PASS' | 'FAIL' | null>(null);
  
  const { register, handleSubmit, watch, reset, formState: { errors: formErrors } } = useForm<VehicleFormData>();

  const watchedValues = watch(['co_level', 'hc_level', 'nox_level', 'pm_level']);
  
  const checkEmissions = (co: number, hc: number, nox: number, pm: number) => {
    if (co && hc && nox && pm) {
      const limits = { co: 4.5, hc: 1200, nox: 3000, pm: 2.5 };
      const status = (co <= limits.co && hc <= limits.hc && nox <= limits.nox && pm <= limits.pm) ? 'PASS' : 'FAIL';
      setPassFailStatus(status);
    } else {
      setPassFailStatus(null);
    }
  };

  const onFormSubmit = async (data: VehicleFormData) => {
    setErrors([]);
    
    const validation = validateFormData(data);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await onSubmit(data);
      reset();
      setPassFailStatus(null);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'An error occurred while submitting the form']);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Vehicle Emissions Testing
      </h1>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium mb-2">Please correct the following errors:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* Vehicle Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">
                VIN (17 characters)
              </label>
              <input
                {...register('vin', { required: 'VIN is required' })}
                type="text"
                id="vin"
                maxLength={17}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1HGBH41JXMN109186"
              />
              {formErrors.vin && (
                <p className="mt-1 text-sm text-red-600">{formErrors.vin.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700 mb-2">
                License Plate
              </label>
              <input
                {...register('license_plate', { required: 'License plate is required' })}
                type="text"
                id="license_plate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ABC123DE"
              />
              {formErrors.license_plate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.license_plate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
                Make
              </label>
              <input
                {...register('make', { required: 'Make is required' })}
                type="text"
                id="make"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Toyota"
              />
              {formErrors.make && (
                <p className="mt-1 text-sm text-red-600">{formErrors.make.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <input
                {...register('model', { required: 'Model is required' })}
                type="text"
                id="model"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Camry"
              />
              {formErrors.model && (
                <p className="mt-1 text-sm text-red-600">{formErrors.model.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                {...register('year', { 
                  required: 'Year is required',
                  valueAsNumber: true,
                  min: { value: 1980, message: 'Year must be 1980 or later' },
                  max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
                })}
                type="number"
                id="year"
                min="1980"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2020"
              />
              {formErrors.year && (
                <p className="mt-1 text-sm text-red-600">{formErrors.year.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Owner Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="owner_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                {...register('owner_name', { required: 'Owner name is required' })}
                type="text"
                id="owner_name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
              {formErrors.owner_name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.owner_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="owner_phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                {...register('owner_phone', { required: 'Phone number is required' })}
                type="tel"
                id="owner_phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+2348012345678"
              />
              {formErrors.owner_phone && (
                <p className="mt-1 text-sm text-red-600">{formErrors.owner_phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emissions Test Results */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Emissions Test Results</h2>
          
          {/* Emission Standards Reference */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-blue-800 font-medium mb-2">Nigerian Emission Standards (Pass Limits):</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700">
              <div>CO ≤ 4.5% volume</div>
              <div>HC ≤ 1200 ppm</div>
              <div>NOx ≤ 3000 ppm</div>
              <div>PM ≤ 2.5 mg/m³</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="co_level" className="block text-sm font-medium text-gray-700 mb-2">
                CO Level (% volume)
              </label>
              <input
                {...register('co_level', { 
                  required: 'CO level is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'CO level must be positive' }
                })}
                type="number"
                step="0.1"
                id="co_level"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="3.2"
                onChange={() => {
                  setTimeout(() => {
                    const values = watchedValues;
                    if (values[0] && values[1] && values[2] && values[3]) {
                      checkEmissions(values[0], values[1], values[2], values[3]);
                    }
                  }, 100);
                }}
              />
              {formErrors.co_level && (
                <p className="mt-1 text-sm text-red-600">{formErrors.co_level.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="hc_level" className="block text-sm font-medium text-gray-700 mb-2">
                HC Level (ppm)
              </label>
              <input
                {...register('hc_level', { 
                  required: 'HC level is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'HC level must be positive' }
                })}
                type="number"
                step="1"
                id="hc_level"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="800"
                onChange={() => {
                  setTimeout(() => {
                    const values = watchedValues;
                    if (values[0] && values[1] && values[2] && values[3]) {
                      checkEmissions(values[0], values[1], values[2], values[3]);
                    }
                  }, 100);
                }}
              />
              {formErrors.hc_level && (
                <p className="mt-1 text-sm text-red-600">{formErrors.hc_level.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="nox_level" className="block text-sm font-medium text-gray-700 mb-2">
                NOx Level (ppm)
              </label>
              <input
                {...register('nox_level', { 
                  required: 'NOx level is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'NOx level must be positive' }
                })}
                type="number"
                step="1"
                id="nox_level"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2500"
                onChange={() => {
                  setTimeout(() => {
                    const values = watchedValues;
                    if (values[0] && values[1] && values[2] && values[3]) {
                      checkEmissions(values[0], values[1], values[2], values[3]);
                    }
                  }, 100);
                }}
              />
              {formErrors.nox_level && (
                <p className="mt-1 text-sm text-red-600">{formErrors.nox_level.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="pm_level" className="block text-sm font-medium text-gray-700 mb-2">
                PM Level (mg/m³)
              </label>
              <input
                {...register('pm_level', { 
                  required: 'PM level is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'PM level must be positive' }
                })}
                type="number"
                step="0.1"
                id="pm_level"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1.8"
                onChange={() => {
                  setTimeout(() => {
                    const values = watchedValues;
                    if (values[0] && values[1] && values[2] && values[3]) {
                      checkEmissions(values[0], values[1], values[2], values[3]);
                    }
                  }, 100);
                }}
              />
              {formErrors.pm_level && (
                <p className="mt-1 text-sm text-red-600">{formErrors.pm_level.message}</p>
              )}
            </div>
          </div>

          {/* Pass/Fail Status */}
          {passFailStatus && (
            <div className={`mt-6 p-4 rounded-md text-center ${
              passFailStatus === 'PASS' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <h3 className="text-lg font-semibold">
                Test Result: {passFailStatus}
              </h3>
              <p className="text-sm mt-1">
                {passFailStatus === 'PASS' 
                  ? 'All emission levels are within acceptable limits.'
                  : 'One or more emission levels exceed acceptable limits.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Submit Test & Generate Certificate'}
          </button>
        </div>
      </form>
    </div>
  );
}