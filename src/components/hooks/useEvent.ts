import { useEffect } from 'react';
interface EventTarget {
    addEventListener: typeof window.addEventListener;
    removeEventListener: typeof window.removeEventListener;
}
export default function useEvent(
    eventType: string,
    eventHandler: (event: Event) => void,
    eventTarget: EventTarget | (() => EventTarget) = window,
    options: EventListenerOptions = {}
) {
    useEffect(() => {
        let target = eventTarget;
        if (typeof target === 'function') {
            target = target();
        }
        target.addEventListener(eventType, eventHandler, options);
        return () => {
            (target as EventTarget).removeEventListener(eventType, eventHandler, options);
        };
    }, [eventType, eventHandler, eventTarget, JSON.stringify(options)]);
}
