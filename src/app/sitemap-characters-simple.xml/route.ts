import { createClientServer } from '@/lib/supabase/server'

export async function GET() {
  const baseUrl = 'https://languageteacher.io'
  
  try {
    const supabase = await createClientServer()
    
    console.log('Fetching ALL characters for sitemap...')
    
    // Get ALL kanji characters (1945+ characters)
    const { data: kanjiData, error: kanjiError } = await supabase
      .from('kanjidic2')
      .select('character')
      .not('character', 'is', null)
      .order('grade', { ascending: true, nullsFirst: false })
      .order('jlpt', { ascending: true, nullsFirst: false })
    
    console.log(`Found ${kanjiData?.length || 0} kanji characters`)
    
    if (kanjiError) {
      console.error('Kanji query error:', kanjiError)
    }
    
    // Get ALL hanzi characters (90k+ characters) - limit to 50k for performance
    const { data: hanziData, error: hanziError } = await supabase
      .from('hanzi_characters')
      .select('char')
      .not('char', 'is', null)
      .limit(50000)
    
    console.log(`Found ${hanziData?.length || 0} hanzi characters`)
    
    if (hanziError) {
      console.error('Hanzi query error:', hanziError)
    }
    
    // Get ALL hiragana characters
    const { data: hiraganaData, error: hiraganaError } = await supabase
      .from('japanese_hiragana')
      .select('letter')
      .not('letter', 'is', null)
    
    console.log(`Found ${hiraganaData?.length || 0} hiragana characters`)
    
    if (hiraganaError) {
      console.error('Hiragana query error:', hiraganaError)
    }
    
    // Get ALL katakana characters
    const { data: katakanaData, error: katakanaError } = await supabase
      .from('japanese_katakana')
      .select('letter')
      .not('letter', 'is', null)
    
    console.log(`Found ${katakanaData?.length || 0} katakana characters`)
    
    if (katakanaError) {
      console.error('Katakana query error:', katakanaError)
    }
    
    // Create pages for ALL characters
    const kanjiPages = (kanjiData || []).map(item => ({
      url: `${baseUrl}/characters/kanji/${encodeURIComponent(item.character)}`,
      priority: 0.5,
    }))
    
    const hanziPages = (hanziData || []).map(item => ({
      url: `${baseUrl}/characters/hanzi/${encodeURIComponent(item.char)}`,
      priority: 0.5,
    }))
    
    const hiraganaPages = (hiraganaData || []).map(item => ({
      url: `${baseUrl}/characters/hiragana/${encodeURIComponent(item.letter)}`,
      priority: 0.4,
    }))
    
    const katakanaPages = (katakanaData || []).map(item => ({
      url: `${baseUrl}/characters/katakana/${encodeURIComponent(item.letter)}`,
      priority: 0.4,
    }))
    
    const allPages = [...kanjiPages, ...hanziPages, ...hiraganaPages, ...katakanaPages]
    
    console.log(`Total character pages: ${allPages.length}`)
    
    // If no data found, provide sample data
    if (allPages.length === 0) {
      console.log('No character data found, using sample data')
      const samplePages = [
        { url: `${baseUrl}/characters/kanji/人`, priority: 0.5 },
        { url: `${baseUrl}/characters/kanji/水`, priority: 0.5 },
        { url: `${baseUrl}/characters/kanji/火`, priority: 0.5 },
        { url: `${baseUrl}/characters/hanzi/人`, priority: 0.5 },
        { url: `${baseUrl}/characters/hanzi/水`, priority: 0.5 },
        { url: `${baseUrl}/characters/hiragana/あ`, priority: 0.4 },
        { url: `${baseUrl}/characters/katakana/ア`, priority: 0.4 },
      ]
      allPages.push(...samplePages)
    }
  
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`
    
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Error generating character sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
