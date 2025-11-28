import React from 'react';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react';

interface TipCardProps {
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'critical';
}

export const TipCard: React.FC<TipCardProps> = ({ title, content, type = 'info' }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    critical: 'bg-red-50 border-red-200 text-red-800'
  };

  const icons = {
    info: <Lightbulb size={18} className="text-blue-600" />,
    warning: <Info size={18} className="text-amber-600" />,
    critical: <AlertTriangle size={18} className="text-red-600" />
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[type]} mb-4 flex gap-3 text-sm`}>
      <div className="mt-0.5 flex-shrink-0">{icons[type]}</div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="opacity-90 leading-relaxed">{content}</p>
      </div>
    </div>
  );
};