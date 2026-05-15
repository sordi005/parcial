import { useEffect } from 'react';

interface Props {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: Props) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = type === 'error'
    ? 'bg-red-600 text-white'
    : 'bg-green-600 text-white';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg ${styles}`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">
        ×
      </button>
    </div>
  );
};
