'use client';

import { useEffect, useRef } from 'react';
import { NetworkProviderEvents } from '@/domain/events/NetworkProviderEvents';
import { IS_DEVELOPMENT } from '@/config/environment';

type EventCallback = () => void;
type EventNames = keyof typeof NetworkProviderEvents;

export function useCallbackEventListener(
  events: EventNames[] | EventNames, // accept any array of strings as event names
  callback: EventCallback,
): void {
  const callbackRef = useRef<EventCallback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleEvent = (event: Event) => {
      if (IS_DEVELOPMENT) {
        // eslint-disable-next-line no-console
        console.info('Received event::', event.type);
      }
      callback();
    };

    const eventList = Array.isArray(events) ? events : [events];

    eventList.forEach((eventName) => {
      document.addEventListener(eventName, handleEvent);
    });

    return () => {
      eventList.forEach((eventName) => {
        document.removeEventListener(eventName, handleEvent);
      });
    };
  }, [events, callback]);
}
