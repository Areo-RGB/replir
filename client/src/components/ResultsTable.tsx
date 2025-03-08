import { AthleteResult, categories } from '../data';
import PerformanceIcon from './PerformanceIcon';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ResultsTableProps {
  data: AthleteResult[];
  selectedAthlete: string;
}

export default function ResultsTable({ data, selectedAthlete }: ResultsTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group tests by category
  const resultsByCategory = categories.reduce((acc, category) => {
    const categoryResults = data.filter(
      result => result.category === category.id && result.athlete === selectedAthlete
    );

    if (categoryResults.length > 0) {
      acc[category.id] = categoryResults;
    }

    return acc;
  }, {} as Record<string, AthleteResult[]>);

  const calculateAverage = (test: string, unit: string): number => {
    const testResults = data.filter(r => r.test === test);
    return testResults.reduce((acc, curr) => acc + curr.result, 0) / testResults.length;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold text-gray-900">Raw Test Results</h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4">
          {Object.entries(resultsByCategory).map(([categoryId, results]) => {
            const category = categories.find(c => c.id === categoryId);

            return (
              <div key={categoryId}>
                <h3 className="text-xs font-medium text-gray-600 mb-1">{category?.name}</h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500">Test</th>
                        <th className="px-2 py-1.5 text-right text-xs font-medium text-gray-500">Result</th>
                        <th className="px-2 py-1.5 text-right text-xs font-medium text-gray-500">vs. Average</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {results.map((result) => {
                        const average = calculateAverage(result.test, result.unit);
                        return (
                          <tr key={result.test} className="hover:bg-gray-50">
                            <td className="px-2 py-1.5 text-xs text-gray-900">{result.test}</td>
                            <td className="px-2 py-1.5 text-xs text-gray-900 text-right tabular-nums">
                              {result.result} {result.unit}
                            </td>
                            <td className="px-2 py-1.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <PerformanceIcon 
                                  value={result.result} 
                                  average={average}
                                  unit={result.unit}
                                  className="h-3 w-3"
                                />
                                <span className="text-xs tabular-nums text-gray-600">
                                  {average.toFixed(2)} {result.unit}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}