import { LoginForm } from '@/components/login-form'
import Header from '@/components/header'

export default async function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#100518] to-[#08020c]">
      <Header />
      <main className="flex flex-col items-center justify-center p-4 flex-grow">
        <LoginForm />
      </main>
    </div>
  )
}
