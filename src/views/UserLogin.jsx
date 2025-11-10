import React, { useEffect } from 'react'
import { SignIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
function UserLogin() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('authRole', 'user')
    }
  }, [])
  return (
    <div className="auth-layout">
      <section className="auth-card">
      
        <p className='text-sm mb-4'>
          Admin access?{' '}
          <Link to='/sign-in' className='text-blue-600 underline'>
            Switch to admin login
          </Link>
        </p>

        <SignIn
          appearance={{
            layout: {
              socialButtonsPlacement: 'bottom',
              logoPlacement: 'outside'
            }
          }}
          routing="path"
          path="/user-sign-in"
          afterSignInUrl="/user"
          afterSignUpUrl="/user"
        />
      </section>
    </div>
  )
}

export default UserLogin
