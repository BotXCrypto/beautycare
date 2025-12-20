import { Badge } from '@/components/ui/badge';
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  showIcon?: boolean;
  className?: string;
}

export const StockBadge = ({ 
  stock, 
  lowStockThreshold = 5, 
  showIcon = true,
  className = ''
}: StockBadgeProps) => {
  if (stock === 0) {
    return (
      <Badge variant="destructive" className={className}>
        {showIcon && <XCircle className="w-3 h-3 mr-1" />}
        Out of Stock
      </Badge>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <Badge variant="secondary" className={`bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 ${className}`}>
        {showIcon && <AlertTriangle className="w-3 h-3 mr-1" />}
        Only {stock} left
      </Badge>
    );
  }

  return (
    <Badge variant="default" className={`bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ${className}`}>
      {showIcon && <CheckCircle className="w-3 h-3 mr-1" />}
      In Stock
    </Badge>
  );
};
