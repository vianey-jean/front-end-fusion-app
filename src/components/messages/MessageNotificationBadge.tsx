
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MessageNotificationBadgeProps {
  count: number;
}

export const MessageNotificationBadge: React.FC<MessageNotificationBadgeProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white rounded-full"
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};
