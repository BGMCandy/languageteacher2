import { createClientServer } from '@/lib/supabase/server'

export async function GET() {
  const baseUrl = 'https://languageteacher.io'
  
  try {
    const supabase = await createClientServer()
    
    console.log('Starting character sitemap generation...')
    
    // Get kanji characters (limit to most important ones)
    const { data: kanjiData, error: kanjiError } = await supabase
      .from('kanjidic2')
      .select('character, grade, jlpt')
      .not('character', 'is', null)
      .order('grade', { ascending: true, nullsFirst: false })
      .order('jlpt', { ascending: true, nullsFirst: false })
      .limit(500) // Focus on most important kanji
    
    console.log('Kanji query result:', { count: kanjiData?.length, error: kanjiError })
    
    // Get hanzi characters
    const { data: hanziData, error: hanziError } = await supabase
      .from('hanzi_characters')
      .select('char')
      .not('char', 'is', null)
      .limit(200)
    
    console.log('Hanzi query result:', { count: hanziData?.length, error: hanziError })
    
    // Get Japanese characters (hiragana/katakana)
    const { data: hiraganaData, error: hiraganaError } = await supabase
      .from('japanese_hiragana')
      .select('letter')
      .not('letter', 'is', null)
      .limit(50)
    
    const { data: katakanaData, error: katakanaError } = await supabase
      .from('japanese_katakana')
      .select('letter')
      .not('letter', 'is', null)
      .limit(50)
    
    console.log('Hiragana query result:', { count: hiraganaData?.length, error: hiraganaError })
    console.log('Katakana query result:', { count: katakanaData?.length, error: katakanaError })
    
    const kanjiPages = (kanjiData || []).map(item => ({
      url: `${baseUrl}/characters/kanji/${encodeURIComponent(item.character)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
    
    const hanziPages = (hanziData || []).map(item => ({
      url: `${baseUrl}/characters/hanzi/${encodeURIComponent(item.char)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
    
    const hiraganaPages = (hiraganaData || []).map(item => ({
      url: `${baseUrl}/characters/hiragana/${encodeURIComponent(item.letter)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }))
    
    const katakanaPages = (katakanaData || []).map(item => ({
      url: `${baseUrl}/characters/katakana/${encodeURIComponent(item.letter)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }))
    
    const allPages = [...kanjiPages, ...hanziPages, ...hiraganaPages, ...katakanaPages]
    
    console.log('Total pages generated:', allPages.length)
    
    // If no data found, provide some sample pages for testing
    if (allPages.length === 0) {
      console.log('No character data found, using sample data')
      const samplePages = [
        {
          url: `${baseUrl}/characters/kanji/人`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        },
        {
          url: `${baseUrl}/characters/kanji/水`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        },
        {
          url: `${baseUrl}/characters/kanji/火`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        }
      ]
      allPages.push(...samplePages)
    }
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
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
    console.error('Error generating character sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
