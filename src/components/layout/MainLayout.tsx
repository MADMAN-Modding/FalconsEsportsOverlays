import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const MainLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};
