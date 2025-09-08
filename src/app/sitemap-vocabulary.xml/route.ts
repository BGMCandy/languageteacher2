export async function GET() {
  const baseUrl = 'https://languageteacher.io'
  
  // Essential Japanese vocabulary for sitemap - this will work immediately
  const vocabularyPages = [
    // Basic vocabulary
    { url: `${baseUrl}/vocabulary/japanese/1`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/2`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/3`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/4`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/5`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/6`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/7`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/8`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/9`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/10`, priority: 0.4 },
    
    // Common words
    { url: `${baseUrl}/vocabulary/japanese/100`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/101`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/102`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/103`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/104`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/105`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/106`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/107`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/108`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/109`, priority: 0.4 },
    { url: `${baseUrl}/vocabulary/japanese/110`, priority: 0.4 },
  ]
  
  // Dictionary pages
  const dictionaryPages = [
    { url: `${baseUrl}/dictionary/1`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/2`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/3`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/4`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/5`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/6`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/7`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/8`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/9`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/10`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/100`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/101`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/102`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/103`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/104`, priority: 0.4 },
    { url: `${baseUrl}/dictionary/105`, priority: 0.4 },
  ]
  
  // Excerpt pages
  const excerptPages = [
    { url: `${baseUrl}/excerpts/sample-excerpt-1`, priority: 0.4 },
    { url: `${baseUrl}/excerpts/sample-excerpt-2`, priority: 0.4 },
    { url: `${baseUrl}/excerpts/sample-excerpt-3`, priority: 0.4 },
    { url: `${baseUrl}/excerpts/sample-excerpt-4`, priority: 0.4 },
    { url: `${baseUrl}/excerpts/sample-excerpt-5`, priority: 0.4 },
    { url: `${baseUrl}/excerpts/sample-excerpt-6`, priority: 0.4 },
    { url: `${baseUrl}/excerpts/sample-excerpt-7`, priority: 0.4 },
    { url: `${baseUrl}/excerpts/sample-excerpt-8`, priority: 0.4 },
    { url: `${baseUrl}/excerpts/sample-excerpt-9`, priority: 0.4 },
    { url: `${baseUrl}/excerpts/sample-excerpt-10`, priority: 0.4 },
  ]
  
  const allPages = [...vocabularyPages, ...dictionaryPages, ...excerptPages]
  
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
}
