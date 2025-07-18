import {useState, useEffect} from 'react';
import { Messages } from "@workspace/types";
import { useParams } from 'next/navigation.js';



export const useSocket = (url: string) => {
    const {MESSAGE_INIT} = Messages;
    const params = useParams();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    


    useEffect(() => {        
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket connected');
            ws.send(JSON.stringify({ type: MESSAGE_INIT, payload: { projectId: params.project } }));
            
        };
        // ws.onmessage = (event) =>{
        //     const data = JSON.parse(event.data);

        //     console.log('WebSocket message received:', data.type);
        // }

        

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    return { socket };
}

