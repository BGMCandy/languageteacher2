// Test database connection and table existence
import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('zh_cn_phrases')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: connectionError.message,
        details: connectionError
      });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      table_exists: true,
      connection_test: connectionTest
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
