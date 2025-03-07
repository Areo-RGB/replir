import { AthleteResult } from '../data';
import PerformanceIcon from './PerformanceIcon';
import { Timer, Activity, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TestCardProps {
  title: string;
  results: AthleteResult[];
  selectedAthlete: string;
}

export default function TestCard({ title, results, selectedAthlete }: TestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedResults = [...results].sort((a, b) => {
    return a.unit === 's' ? a.result - b.result : b.result - a.result;
  });

  const bestResult = sortedResults[0];
  const average = results.reduce((acc, curr) => acc + curr.result, 0) / results.length;
  const displayResults = isExpanded ? sortedResults : sortedResults.slice(0, 5);

  const getIcon = (unit: string) => {
    switch (unit) {
      case 's':
        return <Timer className="text-blue-500 h-4 w-4" />;
      case 'Reps':
        return <Activity className="text-green-500 h-4 w-4" />;
      default:
        return <Trophy className="text-yellow-500 h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getIcon(bestResult.unit)}
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-gray-500">Avg:</span>
          <PerformanceIcon 
            value={average} 
            average={average} 
            unit={bestResult.unit} 
            className="h-3.5 w-3.5"
          />
          <span className="font-medium tabular-nums text-gray-700">
            {average.toFixed(2)} {bestResult.unit}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {displayResults.map((result, index) => (
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

      {results.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors pt-3 border-t border-gray-100"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show All ({results.length}) <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}