import React from 'react';
import { AdminPopup, AdminPopupProps } from './ui/AdminPopup';

export interface AdminDrawerProps extends Omit<AdminPopupProps, 'size'> {
  width?: 'md' | 'lg' | 'xl';
}

export function AdminDrawer({ width, ...props }: AdminDrawerProps) {
  return <AdminPopup size={width} {...props} />;
}
