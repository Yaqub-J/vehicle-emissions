export const validateVIN = (vin: string): boolean => {
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin.toUpperCase());
};

export const validateLicensePlate = (plate: string): boolean => {
  const plateRegex = /^[A-Z]{2,3}[0-9]{2,4}[A-Z]{2}$/;
  return plateRegex.test(plate.toUpperCase());
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+234|0)[7-9][0-1][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateEmissionLevel = (value: number, type: 'co' | 'hc' | 'nox' | 'pm'): boolean => {
  if (value < 0) return false;
  
  const limits = {
    co: 10.0,    // Maximum possible CO level
    hc: 5000,    // Maximum possible HC level  
    nox: 10000,  // Maximum possible NOx level
    pm: 10.0     // Maximum possible PM level
  };
  
  return value <= limits[type];
};

export const validateYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1980 && year <= currentYear;
};

export interface VehicleFormData {
  vin: string;
  license_plate: string;
  make: string;
  model: string;
  year: number;
  owner_name: string;
  owner_phone: string;
  co_level: number;
  hc_level: number;
  nox_level: number;
  pm_level: number;
}

export const validateFormData = (data: VehicleFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!validateVIN(data.vin)) {
    errors.push('Invalid VIN format. Must be 17 characters long.');
  }

  if (!validateLicensePlate(data.license_plate)) {
    errors.push('Invalid license plate format. Use format: ABC123DE');
  }

  if (!data.make.trim()) {
    errors.push('Vehicle make is required.');
  }

  if (!data.model.trim()) {
    errors.push('Vehicle model is required.');
  }

  if (!validateYear(data.year)) {
    errors.push('Invalid year. Must be between 1980 and current year.');
  }

  if (!data.owner_name.trim()) {
    errors.push('Owner name is required.');
  }

  if (!validatePhoneNumber(data.owner_phone)) {
    errors.push('Invalid phone number format. Use Nigerian format: +234XXXXXXXXX or 0XXXXXXXXX');
  }

  if (!validateEmissionLevel(data.co_level, 'co')) {
    errors.push('Invalid CO level.');
  }

  if (!validateEmissionLevel(data.hc_level, 'hc')) {
    errors.push('Invalid HC level.');
  }

  if (!validateEmissionLevel(data.nox_level, 'nox')) {
    errors.push('Invalid NOx level.');
  }

  if (!validateEmissionLevel(data.pm_level, 'pm')) {
    errors.push('Invalid PM level.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};