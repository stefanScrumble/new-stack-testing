import { useEffect, useRef } from 'react';

export const useEventListener = <K extends keyof WindowEventMap>(
    event: K,
    handler: (event: WindowEventMap[K]) => void,
) => {
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        const listener = (event: WindowEventMap[K]) => handlerRef.current(event);
        window.addEventListener(event, listener);
        return () => window.removeEventListener(event, listener);
    }, [event]);
};
