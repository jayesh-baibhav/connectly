'use client'
import { useEffect, useState } from "react"
import {RegisterLink, LoginLink, LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import {useSocket} from "../context/SocketProvider"

export default function Pages() {
  const {sendMessage,messages} = useSocket()
  const [message, setMessage] = useState('')

  return (
    <div>
      <LoginLink>Sign in</LoginLink>
      <RegisterLink>Sign up</RegisterLink>
      <LogoutLink>Log out</LogoutLink>
    </div>
  )
}