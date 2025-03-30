import {useState, useEffect} from 'react';

export const useSocket = (url: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket connected');
            
        };

        

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [url]);

    return { socket };
}

