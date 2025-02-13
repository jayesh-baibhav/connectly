'use client'
import React, { useCallback, useContext, useEffect, useState } from "react"
import { io,Socket } from "socket.io-client"
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"

interface SocketProviderProps {
    children?: React.ReactNode
}

interface Message {
    createdAt: number;
    senderId: string | null;
    receiverId: string;
    message: string;
}

interface ISocketContext {
    sendMessage: (msg: Message) => void;
    messages: Message[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext)

    if(!state) throw new Error(`State Undefined`)
    
    return state
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
    const { isAuthenticated, getUser } = useKindeAuth() 
    const [socket, setSocket] = useState<Socket | null>()
    const [messages, setMessages] = useState<Message[]>([])
    console.log(messages)

    const sendMessage: ISocketContext["sendMessage"] = useCallback((msg) => {
        console.log("Send Message", msg);
        if (socket) {
        socket.emit("event:message", { message: msg });
        }
    },[socket]);  
    
    const onMessageRec = useCallback((msg: string)=>{
        console.log('From Server Message Recieved: ',{message: msg})
        const message: Message = JSON.parse(msg)
            setMessages((prevMessages) => [...prevMessages, message]) 
    },[])

    useEffect(() => {
        if(isAuthenticated){
            const user = getUser()
            sessionStorage.setItem("userId",`${user?.id}`)
            const _socket = io('http://localhost:8000')
            _socket.emit("join", { userId: user?.id })
            _socket.on('message', onMessageRec)
            setSocket(_socket)
            return () => {
                _socket.disconnect()
                _socket.off('message', onMessageRec)
                setSocket(undefined)
            }
        }else{
            setSocket(null)
        }
    },[isAuthenticated,getUser])
    return (
        <SocketContext.Provider value={{ sendMessage, messages}}>
            {children}
        </SocketContext.Provider>
    )
}
