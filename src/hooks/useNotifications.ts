import { useSyncExternalStore } from 'react';
import { NotificationItem, NotificationKind } from '../types';

const DISPLAY_TIME = 4000;

// One list for the whole app, so a toast from any page shows up in the same place
let notifications: NotificationItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

const publish = (next: NotificationItem[]) => {
  notifications = next;
  listeners.forEach((listener) => listener());
};

export const dismissNotification = (id: number) => {
  publish(notifications.filter((item) => item.id !== id));
};

export const pushNotification = (text: string, kind: NotificationKind = 'info') => {
  const id = nextId++;

  publish([...notifications, { id, text, kind, timestamp: Date.now() }]);
  setTimeout(() => dismissNotification(id), DISPLAY_TIME);
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useNotifications = () => {
  const current = useSyncExternalStore(subscribe, () => notifications);

  return { notifications: current, pushNotification, dismissNotification };
};
