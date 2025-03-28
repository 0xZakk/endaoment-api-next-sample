// TODO: use a Nextjs route group for auth pages
import { LoginForm } from "@/components/forms/login"
import { login } from '../actions'

export default function LoginPage() {
  return (
    <>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button formAction={login}>Log in</button>
      </form>
      <p>
        Don't have an account? <a href="/auth/signup">Sign up</a>
      </p>
    </>
  )
}

// export default function Page() {
//   return (
//     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm">
//         <LoginForm logInAction={login} signUpAction={signup} />
//       </div>
//     </div>
//   )
// }

