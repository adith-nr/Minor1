import React, { useEffect } from 'react'
import { SignIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import './Auth.css' 
function AdminLogin() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('authRole', 'admin')
    }
  }, [])

  return (
    <div className="auth-layout">
      <section className="auth-card">
        <h1>Academic Credentials Store</h1>
        <p>Log in to continue</p>
        <p className='text-sm mt-4'>
          Not an admin?{' '}
          <Link to='/user-sign-in' className='text-blue-600 underline'>
            Switch to user login
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
          path="/sign-in"
          afterSignInUrl="/admin"
          afterSignUpUrl="/admin"
        />
      </section>
    </div>
  )
}

export default AdminLogin



// import { SignIn } from '@clerk/clerk-react'

// const LoginPage = () => {
  
// }

// export default LoginPage
