import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AccountContent from './AccountContent'

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  )
}
