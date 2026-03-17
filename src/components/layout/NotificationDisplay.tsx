import { FC } from 'react';
import { NotificationItem } from '../../types';

interface NotificationProps {
  notifications: NotificationItem[];
}

export const NotificationDisplay: FC<NotificationProps> = ({ notifications }) => {
  return (
    <>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="fixed top-5 right-5 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg dark:shadow-gray-900 animate-slideIn z-50"
        >
          {notification.text}
        </div>
      ))}
    </>
  );
};
