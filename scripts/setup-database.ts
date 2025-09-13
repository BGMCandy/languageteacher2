#!/usr/bin/env tsx

/**
 * Database setup script for Chinese phrases system
 * Run this script to create all required tables in Supabase
 */

import { createServiceRoleClient } from '../src/lib/supabase/server'
import { readFileSync } from 'fs'
import { join } from 'path'

async function setupDatabase() {
  console.log('🚀 Setting up database tables for Chinese phrases system...')
  
  const supabase = createServiceRoleClient()
  
  try {
    // Read SQL files
    const phrasesTableSQL = readFileSync(join(__dirname, '../database/zh_cn_phrases_table.sql'), 'utf8')
    const phraseCharsTableSQL = readFileSync(join(__dirname, '../database/zh_phrase_chars_table.sql'), 'utf8')
    const logsTableSQL = readFileSync(join(__dirname, '../database/phrase_generation_logs_table.sql'), 'utf8')
    
    console.log('📋 Creating zh_cn_phrases table...')
    const { error: phrasesError } = await supabase.rpc('exec_sql', { sql: phrasesTableSQL })
    if (phrasesError) {
      console.error('❌ Error creating zh_cn_phrases table:', phrasesError.message)
      // Continue anyway - table might already exist
    } else {
      console.log('✅ zh_cn_phrases table created successfully')
    }
    
    console.log('📋 Creating zh_phrase_chars table...')
    const { error: charsError } = await supabase.rpc('exec_sql', { sql: phraseCharsTableSQL })
    if (charsError) {
      console.error('❌ Error creating zh_phrase_chars table:', charsError.message)
    } else {
      console.log('✅ zh_phrase_chars table created successfully')
    }
    
    console.log('📋 Creating phrase_generation_logs table...')
    const { error: logsError } = await supabase.rpc('exec_sql', { sql: logsTableSQL })
    if (logsError) {
      console.error('❌ Error creating phrase_generation_logs table:', logsError.message)
    } else {
      console.log('✅ phrase_generation_logs table created successfully')
    }
    
    // Test the tables
    console.log('🧪 Testing table access...')
    const { data: testData, error: testError } = await supabase
      .from('zh_cn_phrases')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Table test failed:', testError.message)
      console.log('💡 You may need to create the tables manually in your Supabase dashboard')
      console.log('📁 SQL files are located in:')
      console.log('   - database/zh_cn_phrases_table.sql')
      console.log('   - database/zh_phrase_chars_table.sql')
      console.log('   - database/phrase_generation_logs_table.sql')
    } else {
      console.log('✅ Database setup completed successfully!')
      console.log('🎉 You can now test the phrase generation API')
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    console.log('💡 You may need to create the tables manually in your Supabase dashboard')
  }
}

// Run the setup
setupDatabase().catch(console.error)
