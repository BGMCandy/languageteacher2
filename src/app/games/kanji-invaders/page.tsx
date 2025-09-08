import dynamic from 'next/dynamic'

const KanjiInvadersGame = dynamic(() => import('./KanjiInvadersGame'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
    </div>
  )
})

export default function KanjiInvadersPage() {
  return <KanjiInvadersGame />
}