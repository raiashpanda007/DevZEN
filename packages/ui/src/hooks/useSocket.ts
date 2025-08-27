import {useState, useEffect, useCallback, useRef} from 'react';
import { Messages } from "@workspace/types";
import { useParams } from 'next/navigation.js';

export interface SocketState {
    isConnecting: boolean;
    isConnected: boolean;
    error: string | null;
    retryCount: number;
}

export const useSocket = (url: string) => {
    const {MESSAGE_INIT} = Messages;
    const params = useParams();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [socketState, setSocketState] = useState<SocketState>({
        isConnecting: false,
        isConnected: false,
        error: null,
        retryCount: 0
    });
    
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const currentSocketRef = useRef<WebSocket | null>(null);
    
    // Configuration
    const RETRY_INTERVAL = 8000; // 8 seconds
    const MAX_RETRY_DURATION = 2 * 60 * 1000; // 2 minutes
    const MAX_RETRIES = Math.floor(MAX_RETRY_DURATION / RETRY_INTERVAL); // ~15 retries

    const cleanup = useCallback(() => {
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
        if (currentSocketRef.current) {
            const ws = currentSocketRef.current;
            ws.onopen = null;
            ws.onclose = null;
            ws.onerror = null;
            ws.onmessage = null;
            if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            currentSocketRef.current = null;
        }
    }, []);

    const connectWebSocket = useCallback(() => {
        if (!url) return;

        // Clean up any existing connection
        cleanup();

        setSocketState(prev => ({ 
            ...prev, 
            isConnecting: true, 
            error: null 
        }));

        try {
            const ws = new WebSocket(url);
            currentSocketRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connected successfully');
                setSocketState({
                    isConnecting: false,
                    isConnected: true,
                    error: null,
                    retryCount: 0
                });
                setSocket(ws);
                
                // Send initialization message
                ws.send(JSON.stringify({ 
                    type: MESSAGE_INIT, 
                    payload: { projectId: params.project } 
                }));
            };

            ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                setSocketState(prev => ({
                    ...prev,
                    isConnected: false,
                    isConnecting: false
                }));
                setSocket(null);
                
                // Only retry if this wasn't a manual close and we haven't exceeded limits
                if (event.code !== 1000 && currentSocketRef.current === ws) {
                    scheduleRetry();
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                const errorMessage = 'Connection failed - retrying...';
                setSocketState(prev => ({
                    ...prev,
                    isConnected: false,
                    isConnecting: false,
                    error: errorMessage
                }));
                setSocket(null);
            };

        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            setSocketState(prev => ({
                ...prev,
                isConnecting: false,
                error: 'Failed to create connection'
            }));
            scheduleRetry();
        }
    }, [url, params.project, cleanup, MESSAGE_INIT]);

    const scheduleRetry = useCallback(() => {
        const elapsed = Date.now() - startTimeRef.current;
        
        if (elapsed >= MAX_RETRY_DURATION) {
            console.log('Max retry duration exceeded, stopping retries');
            setSocketState(prev => ({
                ...prev,
                error: 'Connection failed after 2 minutes. Pod may not be ready.',
                isConnecting: false
            }));
            return;
        }

        setSocketState(prev => {
            const newRetryCount = prev.retryCount + 1;
            if (newRetryCount > MAX_RETRIES) {
                return {
                    ...prev,
                    error: 'Max retry attempts reached. Pod may not be ready.',
                    isConnecting: false
                };
            }

            console.log(`Scheduling retry ${newRetryCount} in ${RETRY_INTERVAL / 1000} seconds...`);
            
            retryTimeoutRef.current = setTimeout(() => {
                connectWebSocket();
            }, RETRY_INTERVAL);

            return {
                ...prev,
                retryCount: newRetryCount,
                error: `Retrying connection (attempt ${newRetryCount}/${MAX_RETRIES})...`
            };
        });
    }, [connectWebSocket, MAX_RETRY_DURATION, MAX_RETRIES, RETRY_INTERVAL]);

    useEffect(() => {
        if (!url) return;

        startTimeRef.current = Date.now();
        connectWebSocket();

        return cleanup;
    }, [url, connectWebSocket, cleanup]);

    return { socket, socketState };
}

