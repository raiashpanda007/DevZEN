import {useState, useEffect, useRef} from 'react';
import { Messages } from "@workspace/types";
import { useParams } from 'next/navigation.js';

export const useSocket = (url: string) => {
    const {MESSAGE_INIT} = Messages;
    const params = useParams();
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const retryTimerRef = useRef<number | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const connectedRef = useRef(false);

    useEffect(() => {
        const RETRY_INTERVAL = 8000; 
        const MAX_DURATION = 2 * 60 * 1000; 
        const startTime = Date.now();
        let cancelled = false;

        const tryConnect = () => {
            if (cancelled) return;

            
            if (wsRef.current) {
                try { wsRef.current.close(); } catch (_) {}
                wsRef.current = null;
            }

            const ws = new WebSocket(url);
            wsRef.current = ws;
            let opened = false;

            ws.onopen = () => {
                if (cancelled) {
                    ws.close();
                    return;
                }
                opened = true;
                connectedRef.current = true;
                console.info('WebSocket connected');
                try {
                    ws.send(JSON.stringify({ type: MESSAGE_INIT, payload: { projectId: params.project } }));
                } catch (e) {
                    console.warn('Failed to send init payload', e);
                }
                setSocket(ws);
            };

            ws.onerror = (err) => {
                console.warn('WebSocket error', err);
            };

            ws.onclose = () => {
                if (opened) {
                    console.log('WebSocket closed');
                    setSocket(null);
                    return;
                }
                const elapsed = Date.now() - startTime;
                if (elapsed < MAX_DURATION && !cancelled) {
                    console.info(`WebSocket not ready yet. Retrying in ${RETRY_INTERVAL/1000}s...`);
                    retryTimerRef.current = window.setTimeout(() => {
                        tryConnect();
                    }, RETRY_INTERVAL);
                } else {
                    console.warn('WebSocket connection timed out after 2 minutes');
                }
            };
        };

        tryConnect();

        return () => {
            cancelled = true;
            if (retryTimerRef.current) {
                clearTimeout(retryTimerRef.current);
                retryTimerRef.current = null;
            }
            if (wsRef.current) {
                try { wsRef.current.close(); } catch (_) {}
                wsRef.current = null;
            }
            if (connectedRef.current) setSocket(null);
        };
    }, [url, MESSAGE_INIT, params.project]);

    return { socket };
}

