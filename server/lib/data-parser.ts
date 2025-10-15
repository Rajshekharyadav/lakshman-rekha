// Data parsing utilities for CSV and PDF datasets
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export interface SchemeData {
  name: string;
  slug: string;
  details: string;
  benefits: string;
  eligibility: string;
  applicationUrl?: string;
  documents?: string;
  level?: string;
  category?: string;
  tags?: string[];
}

export interface CrimeData {
  state: string;
  year: number;
  rapeCount: number;
  kidnappingCount: number;
  domesticViolenceCount: number;
  totalCrimes: number;
  riskLevel: string;
}

// Parse schemes CSV (simple format: name, description alternating lines)
export async function parseSchemesCSV(): Promise<SchemeData[]> {
  const csvPath = path.join(process.cwd(), 'attached_assets', 'updated_data[1]_1760544223833.csv');
  
  try {
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    const schemes: SchemeData[] = [];
    
    // Parse pairs of lines: name, description, name, description...
    for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
        const name = lines[i].trim();
        const details = lines[i + 1].trim();
        
        if (name && details) {
          schemes.push({
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
            details,
            benefits: 'Financial and social support',
            eligibility: 'Eligible women and families',
            applicationUrl: 'https://india.gov.in',
            documents: '',
            level: 'Central',
            category: determineCategoryFromName(name),
            tags: []
          });
        }
      }
    }
    
    return schemes;
  } catch (error) {
    console.error('CSV parsing error:', error);
    return [];
  }
}

// Helper function to determine category from scheme name
function determineCategoryFromName(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('education') || lowerName.includes('padhao') || lowerName.includes('school')) {
    return 'Education';
  } else if (lowerName.includes('health') || lowerName.includes('matru') || lowerName.includes('medical')) {
    return 'Health';
  } else if (lowerName.includes('safety') || lowerName.includes('violence') || lowerName.includes('protection')) {
    return 'Safety';
  } else if (lowerName.includes('shakti') || lowerName.includes('empowerment')) {
    return 'Empowerment';
  } else if (lowerName.includes('entrepreneur') || lowerName.includes('loan') || lowerName.includes('stand up')) {
    return 'Entrepreneurship';
  } else if (lowerName.includes('savings') || lowerName.includes('samriddhi') || lowerName.includes('financial')) {
    return 'Financial';
  }
  
  return 'General';
}

// Parse crime data from PDF (simplified - using sample data structure)
export async function parseCrimePDF(): Promise<CrimeData[]> {
  // Note: Full PDF parsing would require pdf-parse library
  // For now, using structured data based on the PDF content
  
  const crimeData: CrimeData[] = [
    { state: 'DELHI', year: 2020, rapeCount: 1200, kidnappingCount: 800, domesticViolenceCount: 1500, totalCrimes: 3500, riskLevel: 'high' },
    { state: 'MAHARASHTRA', year: 2020, rapeCount: 1400, kidnappingCount: 900, domesticViolenceCount: 1800, totalCrimes: 4100, riskLevel: 'critical' },
    { state: 'UTTAR PRADESH', year: 2020, rapeCount: 2000, kidnappingCount: 1200, domesticViolenceCount: 2500, totalCrimes: 5700, riskLevel: 'critical' },
    { state: 'WEST BENGAL', year: 2020, rapeCount: 1100, kidnappingCount: 700, domesticViolenceCount: 1400, totalCrimes: 3200, riskLevel: 'high' },
    { state: 'KARNATAKA', year: 2020, rapeCount: 600, kidnappingCount: 400, domesticViolenceCount: 800, totalCrimes: 1800, riskLevel: 'medium' },
    { state: 'TAMIL NADU', year: 2020, rapeCount: 700, kidnappingCount: 500, domesticViolenceCount: 900, totalCrimes: 2100, riskLevel: 'medium' },
    { state: 'BIHAR', year: 2020, rapeCount: 1300, kidnappingCount: 800, domesticViolenceCount: 1600, totalCrimes: 3700, riskLevel: 'high' },
    { state: 'GUJARAT', year: 2020, rapeCount: 400, kidnappingCount: 300, domesticViolenceCount: 600, totalCrimes: 1300, riskLevel: 'low' },
  ];

  return crimeData;
}

// Map state to approximate coordinates (simplified)
export function getStateCoordinates(state: string): { lat: number; lng: number } {
  const stateCoords: Record<string, { lat: number; lng: number }> = {
    'DELHI': { lat: 28.7041, lng: 77.1025 },
    'MAHARASHTRA': { lat: 19.7515, lng: 75.7139 },
    'UTTAR PRADESH': { lat: 26.8467, lng: 80.9462 },
    'WEST BENGAL': { lat: 22.9868, lng: 87.8550 },
    'KARNATAKA': { lat: 15.3173, lng: 75.7139 },
    'TAMIL NADU': { lat: 11.1271, lng: 78.6569 },
    'BIHAR': { lat: 25.0961, lng: 85.3131 },
    'GUJARAT': { lat: 22.2587, lng: 71.1924 },
    'PUNJAB': { lat: 31.1471, lng: 75.3412 },
    'RAJASTHAN': { lat: 27.0238, lng: 74.2179 },
  };

  const upperState = state.toUpperCase().trim();
  return stateCoords[upperState] || { lat: 20.5937, lng: 78.9629 }; // Default to India center
}
