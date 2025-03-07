import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceIconProps {
  value: number;
  average: number;
  unit: string;
  className?: string;
}

export default function PerformanceIcon({ value, average, unit, className }: PerformanceIconProps) {
  const threshold = 0.1; // 10% difference threshold
  const difference = (value - average) / average;
  
  // For time-based metrics, lower is better
  const isGood = unit === 's' ? difference < -threshold : difference > threshold;
  const isBad = unit === 's' ? difference > threshold : difference < -threshold;
  
  if (isGood) {
    return <TrendingUp className={cn("h-4 w-4 text-green-500", className)} />;
  } else if (isBad) {
    return <TrendingDown className={cn("h-4 w-4 text-red-500", className)} />;
  }
  return <Minus className={cn("h-4 w-4 text-gray-400", className)} />;
}
