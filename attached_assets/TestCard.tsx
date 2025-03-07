import React from 'react';
import { Trophy, Timer, Activity } from 'lucide-react';
import { AthleteResult } from '../data';

interface TestCardProps {
  title: string;
  results: AthleteResult[];
  selectedAthlete: string;
}

const TestCard: React.FC<TestCardProps> = ({ title, results, selectedAthlete }) => {
  const sortedResults = [...results].sort((a, b) => {
    // For time-based results (lower is better)
    if (a.unit === 's') {
      return a.result - b.result;
    }
    // For other metrics (higher is better)
    return b.result - a.result;
  });

  const bestResult = sortedResults[0];
  const isTimeBased = bestResult.unit === 's';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        {bestResult.unit === 's' ? <Timer className="text-blue-500" /> : 
         bestResult.unit === 'Reps' ? <Activity className="text-green-500" /> :
         <Trophy className="text-yellow-500" />}
      </div>
      
      <div className="space-y-3">
        {sortedResults.map((result, index) => (
          <div 
            key={result.athlete} 
            className={`flex items-center justify-between ${
              selectedAthlete === result.athlete 
                ? 'bg-blue-50 -mx-2 px-2 py-1 rounded-lg' 
                : ''
            } ${
              selectedAthlete && selectedAthlete !== result.athlete 
                ? 'opacity-50' 
                : ''
            }`}
          >
            <div className="flex items-center">
              <span className={`w-6 text-sm ${index === 0 ? 'text-yellow-500 font-bold' : 'text-gray-500'}`}>
                {index + 1}.
              </span>
              <span className={`${index === 0 ? 'font-semibold' : ''} text-gray-700`}>
                {result.athlete}
              </span>
            </div>
            <span className={`${index === 0 ? 'font-semibold' : ''} text-gray-600`}>
              {result.result} {result.unit}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Average:</span>
          <span>
            {(results.reduce((acc, curr) => acc + curr.result, 0) / results.length).toFixed(2)} {bestResult.unit}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TestCard;