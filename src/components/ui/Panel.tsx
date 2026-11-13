import { FC, ReactNode } from 'react';

interface PanelProps {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Panel: FC<PanelProps> = ({ title, actions, children, className = '', bodyClassName = 'p-5' }) => (
  <section className={`panel ${className}`}>
    {(title || actions) && (
      <header className="panel-header">
        <h2 className="panel-title">{title}</h2>
        {actions}
      </header>
    )}
    <div className={bodyClassName}>{children}</div>
  </section>
);

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ eyebrow, title, description, actions }) => (
  <header className="mb-8 flex items-end justify-between gap-6 border-b border-ink-600 pb-6">
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-falcons-bright">{eyebrow}</p>
      <h1 className="font-display text-[44px] font-bold uppercase leading-none tracking-tight text-white">{title}</h1>
      {description && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-300">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
  </header>
);
