export default function LanguagePage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Language: {params.slug}</h1>
        <p>This page is under construction.</p>
      </div>
    </div>
  )
}
