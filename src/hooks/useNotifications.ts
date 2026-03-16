import { useState, useCallback } from 'react';
import { NotificationItem } from '../types';

const DISPLAY_TIME = 3000;

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationId, setNotificationId] = useState(0);

  const pushNotification = useCallback((text: string) => {
    const id = notificationId + 1;
    setNotificationId(id);

    const notification: NotificationItem = {
      id,
      text,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== id)
      );
    }, DISPLAY_TIME);
  }, [notificationId]);

  return { notifications, pushNotification };
};
