"use client"
import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>();
    useEffect(() => {
        console.log("WS SERVER URL :: ", process.env.NEXT_PUBLIC_LLM_WS_URL)
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_LLM_WS_URL}`);
        setSocket(ws);
        console.log(ws);
    }, [])

    // if (!socket) throw Error("UNABLE TO CONNECT TO LLM SERVER");
    if (socket) {
        socket.onmessage = (message) => {
            console.log(message);
        };
    }



    return socket
}