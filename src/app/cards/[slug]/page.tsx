import { use } from 'react'

export default function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Card: {slug}</h1>
        <p>This page is under construction.</p>
      </div>
    </div>
  )
}
