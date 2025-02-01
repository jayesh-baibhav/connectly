'use client'

import React, { useEffect, useState } from 'react'
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useKindeAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>You are not authorized. Please <LoginLink>log in</LoginLink> to continue.</p>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
