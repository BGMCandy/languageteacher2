import { createClientServer } from '@/lib/supabase/server'

export async function GET() {
  const baseUrl = 'https://languageteacher.io'
  
  try {
    const supabase = await createClientServer()
    
    console.log('Fetching ALL Chinese Hanzi for sitemap...')
    
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
    
    // Create pages for ALL hanzi characters
    const hanziPages = (hanziData || []).map(item => ({
      url: `${baseUrl}/characters/hanzi/${encodeURIComponent(item.char)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
    
    console.log(`Generated ${hanziPages.length} hanzi pages`)
    
    // If no data found, provide sample hanzi
    if (hanziPages.length === 0) {
      console.log('No hanzi data found, using sample data')
      const sampleHanzi = [
        '人', '水', '火', '木', '土', '金', '日', '月', '山', '川',
        '田', '大', '小', '中', '上', '下', '左', '右', '前', '後',
        '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
        '百', '千', '万', '年', '月', '日', '时', '分', '秒', '今',
        '明', '昨', '来', '去', '行', '来', '归', '出', '入', '在'
      ]
      
      hanziPages.push(...sampleHanzi.map(hanzi => ({
        url: `${baseUrl}/characters/hanzi/${encodeURIComponent(hanzi)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })))
    }
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hanziPages.map(page => `  <url>
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
    console.error('Error generating hanzi sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
