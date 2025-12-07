import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface AdminCardProps {
  title: string;
  icon?: ReactNode;
  headerColor: string;
  borderColor: string;
  titleColor?: string;
  children: ReactNode;
  className?: string;
}

export function AdminCard({
  title,
  icon,
  headerColor,
  borderColor,
  titleColor = 'var(--the-dark-blue)',
  children,
  className = '',
}: AdminCardProps) {
  return (
    <Card 
      className={`overflow-hidden border p-0 ${className}`} 
      style={{ borderColor }}
    >
      <CardHeader className="pb-4 px-6 pt-4" style={{ backgroundColor: headerColor }}>
        <CardTitle 
          className="flex items-center gap-2 text-base font-semibold" 
          style={{ color: titleColor }}
        >
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white px-6 pt-6 pb-6">
        {children}
      </CardContent>
    </Card>
  );
}
