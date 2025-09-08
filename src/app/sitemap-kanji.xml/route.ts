import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const baseUrl = 'https://languageteacher.io'
  
  try {
    // Use direct Supabase client instead of server client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    console.log('Fetching ALL Japanese Kanji for sitemap...')
    
    // Get ALL kanji characters (1945+ characters)
    const { data: kanjiData, error: kanjiError } = await supabase
      .from('kanjidic2')
      .select('character, grade, jlpt')
      .not('character', 'is', null)
      .order('grade', { ascending: true, nullsFirst: false })
      .order('jlpt', { ascending: true, nullsFirst: false })
    
    console.log(`Found ${kanjiData?.length || 0} kanji characters`)
    console.log('Kanji data sample:', kanjiData?.slice(0, 3))
    
    if (kanjiError) {
      console.error('Kanji query error:', kanjiError)
      console.error('Error details:', JSON.stringify(kanjiError, null, 2))
    }
    
    // Create pages for ALL kanji characters
    const kanjiPages = (kanjiData || []).map(item => ({
      url: `${baseUrl}/characters/kanji/${encodeURIComponent(item.character)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
    
    console.log(`Generated ${kanjiPages.length} kanji pages`)
    
    // If no data found, try a simpler query
    if (kanjiPages.length === 0) {
      console.log('No kanji data found, trying simpler query...')
      
      try {
        const { data: simpleKanjiData, error: simpleError } = await supabase
          .from('kanjidic2')
          .select('character')
          .not('character', 'is', null)
          .limit(100)
        
        console.log(`Simple query found ${simpleKanjiData?.length || 0} kanji characters`)
        
        if (simpleError) {
          console.error('Simple query error:', simpleError)
        }
        
        if (simpleKanjiData && simpleKanjiData.length > 0) {
          kanjiPages.push(...simpleKanjiData.map(item => ({
            url: `${baseUrl}/characters/kanji/${encodeURIComponent(item.character)}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
          })))
        }
      } catch (simpleError) {
        console.error('Simple query also failed:', simpleError)
        // simpleError is now used in the console.error
      }
    }
    
    // If still no data found, provide sample kanji
    if (kanjiPages.length === 0) {
      console.log('No kanji data found, using sample data')
      const sampleKanji = [
        '人', '水', '火', '木', '土', '金', '日', '月', '山', '川',
        '田', '大', '小', '中', '上', '下', '左', '右', '前', '後',
        '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
        '百', '千', '万', '年', '月', '日', '時', '分', '秒', '今',
        '今', '明', '昨', '来', '去', '行', '来', '帰', '出', '入'
      ]
      
      kanjiPages.push(...sampleKanji.map(kanji => ({
        url: `${baseUrl}/characters/kanji/${encodeURIComponent(kanji)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })))
    }
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${kanjiPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`
    
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Error generating kanji sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
