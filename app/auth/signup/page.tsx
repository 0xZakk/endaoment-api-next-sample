import { signup } from '../actions'

export default function SignupPage() {
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
        <button formAction={signup}>Sign up</button>
      </form>
      <p>
        Already have an account? <a href="/auth/login">Log In</a>
      </p>
    </>
  )
}
