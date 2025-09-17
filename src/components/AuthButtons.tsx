import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'

export function AuthButtons() {
  const { isSignedIn } = useUser()

  return (
    <div className="auth-buttons">
      {!isSignedIn && (
        <>
          <SignInButton mode="modal">
            <button className="btn btn-primary">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="btn btn-secondary">Sign Up</button>
          </SignUpButton>
        </>
      )}
      {isSignedIn && (
        <div className="user-button">
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  )
}
