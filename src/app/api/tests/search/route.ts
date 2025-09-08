import { NextRequest, NextResponse } from 'next/server';
import { searchTests } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    const tests = searchTests(query);
    
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Error searching tests:', error);
    return NextResponse.json(
      { error: 'Failed to search test results' },
      { status: 500 }
    );
  }
}