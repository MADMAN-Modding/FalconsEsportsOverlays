import { FC, ReactNode } from 'react';
import { Navigation } from './Navigation';
import { NotificationDisplay } from './NotificationDisplay';

interface LayoutProps {
  children: ReactNode;
}

export const MainLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-ink-900 text-ink-100">
      <Navigation />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1120px] px-10 py-9">{children}</div>
      </main>
      <NotificationDisplay />
    </div>
  );
};
