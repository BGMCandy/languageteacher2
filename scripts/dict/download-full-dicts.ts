import { config } from 'dotenv'
import fetch from 'node-fetch'
import * as fs from 'fs/promises'
import * as path from 'path'

// Load environment variables from .env.local
config({ path: '.env.local' })

const DATA_DIR = path.resolve(process.cwd(), 'data/dict')

// Full dataset URLs
const DATASETS = [
  {
    name: 'JMdict (Complete Japanese Dictionary)',
    url: 'https://github.com/scriptin/jmdict-simplified/releases/latest/download/jmdict-simplified.json.gz',
    filename: 'jmdict-full.json.gz',
    size: '~50-100 MB'
  },
  {
    name: 'KANJIDIC2 (Complete Kanji Dictionary)',
    url: 'https://www.edrdg.org/kanjidic/kanjidic2.xml.gz',
    filename: 'kanjidic2-full.xml.gz',
    size: '~10-15 MB'
  }
]

async function ensureDir(dir: string) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

async function downloadFile(url: string, filename: string, expectedSize: string) {
  console.log(`📥 Downloading ${filename}...`)
  console.log(`   Expected size: ${expectedSize}`)
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }
  
  const buffer = Buffer.from(await response.arrayBuffer())
  const filepath = path.join(DATA_DIR, filename)
  
  await fs.writeFile(filepath, buffer)
  const actualSize = (buffer.length / 1024 / 1024).toFixed(2)
  console.log(`✅ Downloaded ${filename} (${actualSize} MB)`)
  
  return filepath
}

async function main() {
  console.log('🚀 Downloading Complete Dictionary Datasets')
  console.log('==========================================')
  
  await ensureDir(DATA_DIR)
  
  for (const dataset of DATASETS) {
    try {
      console.log(`\n📚 ${dataset.name}`)
      console.log(`   URL: ${dataset.url}`)
      
      await downloadFile(dataset.url, dataset.filename, dataset.size)
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`❌ Failed to download ${dataset.name}:`, errorMessage)
      console.log(`   Manual download: ${dataset.url}`)
    }
  }
  
  console.log('\n🎯 Next Steps:')
  console.log('1. Extract the .gz files:')
  console.log('   gunzip data/dict/*.gz')
  console.log('2. Update package.json scripts to use full files:')
  console.log('   "dict:jmdict": "ts-node scripts/dict/import-jmdict.ts ./data/dict/jmdict-full.json"')
  console.log('   "dict:kanji": "ts-node scripts/dict/import-kanjidic2.ts ./data/dict/kanjidic2-full.xml"')
  console.log('3. Run full imports:')
  console.log('   npm run dict:jmdict    # Will take 5-15 minutes')
  console.log('   npm run dict:kanji     # Will take 1-2 minutes')
  console.log('\n⚠️  Note: Full imports will take much longer and create ~200,000+ entries!')
}

main().catch(console.error) 