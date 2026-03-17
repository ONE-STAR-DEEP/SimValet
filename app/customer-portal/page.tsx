import { LoginForm } from '@/components/customer portal/LoginForm'
import React from 'react'

const CustomerPortal = () => {
    return (

        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}

export default CustomerPortal