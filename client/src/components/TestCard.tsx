import { AthleteResult } from '../data';
import PerformanceIcon from './PerformanceIcon';
import { Timer, Activity, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestCardProps {
  title: string;
  results: AthleteResult[];
  selectedAthlete: string;
}

export default function TestCard({ title, results, selectedAthlete }: TestCardProps) {
  const sortedResults = [...results].sort((a, b) => {
    return a.unit === 's' ? a.result - b.result : b.result - a.result;
  });

  const bestResult = sortedResults[0];
  const average = results.reduce((acc, curr) => acc + curr.result, 0) / results.length;

  const getIcon = (unit: string) => {
    switch (unit) {
      case 's':
        return <Timer className="text-blue-500 h-5 w-5" />;
      case 'Reps':
        return <Activity className="text-green-500 h-5 w-5" />;
      default:
        return <Trophy className="text-yellow-500 h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 truncate flex-1">{title}</h3>
        {getIcon(bestResult.unit)}
      </div>

      <div className="space-y-2">
        {sortedResults.slice(0, 5).map((result, index) => (
          <div 
            key={result.athlete}
            className={cn(
              "flex items-center justify-between py-1",
              selectedAthlete === result.athlete ? "bg-blue-50 -mx-2 px-2 rounded" : "",
              selectedAthlete && selectedAthlete !== result.athlete ? "opacity-50" : ""
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm w-4",
                index === 0 ? "text-yellow-500 font-semibold" : "text-gray-400"
              )}>
                {index + 1}.
              </span>
              <span className={cn(
                "text-sm",
                index === 0 ? "font-medium text-gray-900" : "text-gray-600"
              )}>
                {result.athlete}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PerformanceIcon value={result.result} average={average} unit={result.unit} />
              <span className={cn(
                "text-sm tabular-nums",
                index === 0 ? "font-medium text-gray-900" : "text-gray-600"
              )}>
                {result.result} {result.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <span>Average</span>
        <span className="tabular-nums">{average.toFixed(2)} {bestResult.unit}</span>
      </div>
    </div>
  );
}