'use client'
import { useState } from "react"
import {useSocket} from "../context/SocketProvider"

export default function Pages() {
  const {sendMessage,messages} = useSocket()
  const [message, setMessage] = useState('')
  return (
    <div>
      <div>
        <input onChange={e => setMessage(e.target.value)} placeholder="message"/>
        <button onClick={()=>sendMessage(message)}>Send</button>
      </div>
      <div>
        <h5>All messages will appear here</h5>
        {messages.map(e => <li>{e}</li>)}
      </div>
    </div>
  )
}