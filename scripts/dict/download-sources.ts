// Download JMdict and KANJIDIC2 source files
import fetch from 'node-fetch'
import * as fs from 'fs/promises'
import * as path from 'path'

const DATA_DIR = path.resolve(process.cwd(), 'data/dict')

// JMdict JSON (simplified English version)
const JMDICT_URL = 'https://github.com/scriptin/jmdict-simplified/releases/download/1.0.3/jmdict-simplified-1.0.3.json.gz'

// KANJIDIC2 XML (official EDRDG)
const KANJIDIC2_URL = 'https://www.edrdg.org/kanjidic/kanjidic2.xml.gz'

async function ensureDir(dir: string) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

async function downloadFile(url: string, filename: string) {
  console.log(`Downloading ${filename}...`)
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }
  
  const buffer = Buffer.from(await response.arrayBuffer())
  const filepath = path.join(DATA_DIR, filename)
  
  await fs.writeFile(filepath, buffer)
  console.log(`✓ Downloaded ${filename} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`)
}

async function main() {
  console.log('Setting up dictionary source files...')
  
  await ensureDir(DATA_DIR)
  
  try {
    // Download JMdict JSON
    await downloadFile(JMDICT_URL, 'jmdict.json.gz')
    
    // Download KANJIDIC2 XML
    await downloadFile(KANJIDIC2_URL, 'kanjidic2.xml.gz')
    
    console.log('\n✅ Download complete!')
    console.log('\nNext steps:')
    console.log('1. Extract the .gz files:')
    console.log('   gunzip data/dict/*.gz')
    console.log('2. Run imports:')
    console.log('   npm run dict:jmdict')
    console.log('   npm run dict:kanji')
    
  } catch (error) {
    console.error('❌ Download failed:', error)
    console.log('\nAlternative: Download manually from:')
    console.log('- JMdict: https://github.com/scriptin/jmdict-simplified/releases')
    console.log('- KANJIDIC2: https://www.edrdg.org/kanjidic/kanjidic2.xml.gz')
  }
}

main().catch(console.error) 