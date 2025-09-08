# Vehicle Emissions Testing Software - MVP

A comprehensive web application for vehicle emissions testing stations in Nigeria. This system allows operators to input vehicle and emissions data, then generate and download PDF certificates with QR codes for compliance verification.

## Features

### 🚗 Core Functionality
- **Vehicle Data Input**: Comprehensive form for vehicle and owner information
- **Emissions Testing**: Input and validation of CO, HC, NOx, and PM levels
- **Automatic Pass/Fail**: Real-time determination based on Nigerian emission standards
- **PDF Certificates**: Professional certificates with QR codes
- **Certificate Verification**: Public verification page accessible via QR code
- **Search & History**: Recent tests with search functionality

### 📋 Nigerian Emission Standards
- **CO**: ≤ 4.5% volume
- **HC**: ≤ 1200 ppm  
- **NOx**: ≤ 3000 ppm
- **PM**: ≤ 2.5 mg/m³

### 🛠 Technical Features
- **Next.js 14+** with App Router and TypeScript
- **SQLite Database** with better-sqlite3
- **Tailwind CSS** for responsive design
- **Form Validation** with react-hook-form
- **PDF Generation** with jsPDF
- **QR Code Generation** with qrcode library
- **Mobile-Friendly** responsive design

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vehicle-emissions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup
The SQLite database is automatically initialized on first run. The database file `emissions.db` will be created in the project root.

## Usage

### 1. Vehicle Registration & Testing
1. Fill out the vehicle information form:
   - VIN (17 characters)
   - License plate (format: ABC123DE)
   - Make, model, and year
   - Owner name and phone number

2. Input emissions test results:
   - CO level (% volume)
   - HC level (ppm)
   - NOx level (ppm)
   - PM level (mg/m³)

3. The system automatically determines pass/fail status
4. Submit to generate certificate

### 2. Certificate Generation
- Certificates are automatically generated with unique numbers (format: NIG-YYYY-XXXXXX)
- PDF includes all vehicle and test information
- QR code embedded for verification
- Valid for 12 months from test date

### 3. Certificate Verification
- Scan QR code or visit verification URL
- View certificate details and validity status
- Mobile-friendly for law enforcement use

### 4. Search & History
- View recent test results
- Search by license plate or certificate number
- Download certificates for completed tests

## API Endpoints

### Vehicle & Test Management
- `POST /api/vehicles` - Submit new vehicle test
- `GET /api/tests` - Get recent test results
- `GET /api/tests/search?q=query` - Search test results

### Certificate Management
- `GET /api/certificate/[id]` - Download PDF certificate
- `GET /api/verify/[certificateNumber]` - Verify certificate

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── vehicles/route.ts
│   │   ├── tests/route.ts
│   │   ├── certificate/[id]/route.ts
│   │   └── verify/[certificateNumber]/route.ts
│   ├── verify/[certificateNumber]/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── VehicleForm.tsx
│   └── RecentTests.tsx
└── lib/
    ├── database.ts
    ├── pdfGenerator.ts
    └── validation.ts
```

## Deployment

### Vercel Deployment (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy with default settings
4. Add environment variables if needed:
   - `NEXT_PUBLIC_BASE_URL` - Your domain URL

### Manual Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Configuration

### Environment Variables
Create a `.env.local` file for local development:

```bash
# Optional: Base URL for QR code verification links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Database Location
The SQLite database is created in the project root as `emissions.db`. For production, ensure this location is writable and backed up regularly.

## Data Validation

### Vehicle Information
- **VIN**: 17 alphanumeric characters (excluding I, O, Q)
- **License Plate**: Nigerian format (ABC123DE)
- **Phone**: Nigerian format (+234XXXXXXXXX or 0XXXXXXXXX)
- **Year**: Between 1980 and current year

### Emissions Levels
- All values must be positive numbers
- Reasonable upper limits enforced to prevent data entry errors

## Security Features

- Input validation on both client and server
- SQL injection prevention with prepared statements
- XSS protection with proper data sanitization
- Form validation with comprehensive error handling

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

1. **Database errors**
   - Ensure write permissions in project directory
   - Check SQLite database file creation

2. **PDF generation issues**
   - Verify jsPDF dependencies are installed
   - Check QR code data generation

3. **Form validation errors**
   - Review Nigerian-specific format requirements
   - Check emission level ranges

### Getting Help

For technical issues:
1. Check browser console for JavaScript errors
2. Review server logs for API errors
3. Verify database file permissions
4. Ensure all dependencies are installed

## Development

### Adding Features
1. **Database Changes**: Update `src/lib/database.ts`
2. **API Routes**: Add routes in `src/app/api/`
3. **UI Components**: Create components in `src/components/`
4. **Validation**: Update `src/lib/validation.ts`

### Testing
- Manual testing through the web interface
- Test certificate generation and verification
- Verify mobile responsiveness
- Test with various emission level scenarios

## Sample Data

The application is ready to use immediately. To test the system:

1. **Test Vehicle (PASS)**:
   - VIN: 1HGBH41JXMN109186
   - License Plate: ABC123DE
   - Make: Toyota, Model: Camry, Year: 2020
   - Owner: John Doe, Phone: +2348012345678
   - CO: 3.2%, HC: 800 ppm, NOx: 2500 ppm, PM: 1.8 mg/m³

2. **Test Vehicle (FAIL)**:
   - VIN: 2HGBH41JXMN109187
   - License Plate: DEF456GH
   - Make: Honda, Model: Accord, Year: 2015
   - Owner: Jane Smith, Phone: +2348098765432
   - CO: 5.2%, HC: 1500 ppm, NOx: 3500 ppm, PM: 3.0 mg/m³

## License

This project is created for vehicle emissions testing stations in Nigeria. Please ensure compliance with local regulations and testing requirements.

## Support

For support with this emissions testing system, please refer to the documentation or contact the development team.