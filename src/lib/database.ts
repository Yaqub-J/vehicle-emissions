import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'emissions.db'));

db.pragma('journal_mode = WAL');

const initializeDatabase = () => {
  const vehiclesTable = `
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vin TEXT NOT NULL,
      license_plate TEXT NOT NULL UNIQUE,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      owner_name TEXT NOT NULL,
      owner_phone TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const testResultsTable = `
    CREATE TABLE IF NOT EXISTS test_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      test_date DATE NOT NULL,
      co_level REAL NOT NULL,
      hc_level REAL NOT NULL,
      nox_level REAL NOT NULL,
      pm_level REAL NOT NULL,
      pass_fail_status TEXT CHECK(pass_fail_status IN ('PASS', 'FAIL')) NOT NULL,
      certificate_number TEXT UNIQUE NOT NULL,
      qr_code_data TEXT NOT NULL,
      validity_period DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )
  `;

  db.exec(vehiclesTable);
  db.exec(testResultsTable);
};

const generateCertificateNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `NIG-${year}-${random}`;
};

const checkPassFail = (co: number, hc: number, nox: number, pm: number): 'PASS' | 'FAIL' => {
  const limits = {
    co: 4.5,    // % volume
    hc: 1200,   // ppm
    nox: 3000,  // ppm
    pm: 2.5     // mg/m³
  };

  if (co <= limits.co && hc <= limits.hc && nox <= limits.nox && pm <= limits.pm) {
    return 'PASS';
  }
  return 'FAIL';
};

const insertVehicle = (vehicleData: {
  vin: string;
  license_plate: string;
  make: string;
  model: string;
  year: number;
  owner_name: string;
  owner_phone: string;
}) => {
  const stmt = db.prepare(`
    INSERT INTO vehicles (vin, license_plate, make, model, year, owner_name, owner_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    vehicleData.vin,
    vehicleData.license_plate,
    vehicleData.make,
    vehicleData.model,
    vehicleData.year,
    vehicleData.owner_name,
    vehicleData.owner_phone
  );
};

const insertTestResult = (testData: {
  vehicle_id: number;
  test_date: string;
  co_level: number;
  hc_level: number;
  nox_level: number;
  pm_level: number;
  certificate_number: string;
  qr_code_data: string;
  validity_period: string;
  pass_fail_status: 'PASS' | 'FAIL';
}) => {
  const stmt = db.prepare(`
    INSERT INTO test_results 
    (vehicle_id, test_date, co_level, hc_level, nox_level, pm_level, pass_fail_status, certificate_number, qr_code_data, validity_period)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    testData.vehicle_id,
    testData.test_date,
    testData.co_level,
    testData.hc_level,
    testData.nox_level,
    testData.pm_level,
    testData.pass_fail_status,
    testData.certificate_number,
    testData.qr_code_data,
    testData.validity_period
  );
};

const getRecentTests = (limit: number = 20) => {
  const stmt = db.prepare(`
    SELECT 
      t.*,
      v.license_plate,
      v.make,
      v.model,
      v.year,
      v.owner_name
    FROM test_results t
    JOIN vehicles v ON t.vehicle_id = v.id
    ORDER BY t.created_at DESC
    LIMIT ?
  `);
  
  return stmt.all(limit);
};

const searchTests = (query: string) => {
  const stmt = db.prepare(`
    SELECT 
      t.*,
      v.license_plate,
      v.make,
      v.model,
      v.year,
      v.owner_name
    FROM test_results t
    JOIN vehicles v ON t.vehicle_id = v.id
    WHERE v.license_plate LIKE ? OR t.certificate_number LIKE ?
    ORDER BY t.created_at DESC
  `);
  
  const searchPattern = `%${query}%`;
  return stmt.all(searchPattern, searchPattern);
};

const getCertificateData = (certificateNumber: string) => {
  const stmt = db.prepare(`
    SELECT 
      t.*,
      v.vin,
      v.license_plate,
      v.make,
      v.model,
      v.year,
      v.owner_name,
      v.owner_phone
    FROM test_results t
    JOIN vehicles v ON t.vehicle_id = v.id
    WHERE t.certificate_number = ?
  `);
  
  return stmt.get(certificateNumber);
};

const getCertificateDataById = (testId: string) => {
  const stmt = db.prepare(`
    SELECT 
      t.*,
      v.vin,
      v.license_plate,
      v.make,
      v.model,
      v.year,
      v.owner_name,
      v.owner_phone
    FROM test_results t
    JOIN vehicles v ON t.vehicle_id = v.id
    WHERE t.id = ?
  `);
  
  return stmt.get(testId);
};

// Initialize database on import
initializeDatabase();

export {
  db,
  generateCertificateNumber,
  checkPassFail,
  insertVehicle,
  insertTestResult,
  getRecentTests,
  searchTests,
  getCertificateData,
  getCertificateDataById
};