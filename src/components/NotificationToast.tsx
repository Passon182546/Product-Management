import React from 'react';
import type { NotificationMessage } from '../types/product';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

interface NotificationToastProps {
  notifications: NotificationMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.map((n) => {
        let Icon = Info;
        let toastClass = 'toast-info';

        if (n.type === 'success') {
          Icon = CheckCircle2;
          toastClass = 'toast-success';
        } else if (n.type === 'error') {
          Icon = XCircle;
          toastClass = 'toast-error';
        } else if (n.type === 'warning') {
          Icon = AlertTriangle;
          toastClass = 'toast-warning';
        }

        return (
          <div key={n.id} className={`toast-item ${toastClass}`}>
            <Icon size={18} className="toast-icon" />
            <span className="toast-message">{n.message}</span>
            <button onClick={() => onDismiss(n.id)} className="toast-close" aria-label="Close notification">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
