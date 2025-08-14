import { auth } from '@/lib/auth'
import { ProfileClientMobile } from './profile-client-mobile'

export async function ProfileMobile() {
  const { user } = await auth()

  return (
    <ProfileClientMobile
      user={{
        name: user.name ?? 'Usuário',
        email: user.email,
        avatarUrl: user.avatarUrl ?? undefined,
      }}
    />
  )
}
