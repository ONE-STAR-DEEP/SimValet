'use client'
import { clearSessionCookie } from "@/lib/logout"

const LogoutButton = () => {
  return (
    <div>
        <button className="dropdown-item" onClick={clearSessionCookie}><i className="icon-lock"></i> Logout</button>
    </div>
  )
}

export default LogoutButton