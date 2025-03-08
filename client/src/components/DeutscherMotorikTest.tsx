import React from 'react';
import { NormativeData, AthleteResult } from '../data';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface DeutscherMotorikTestProps {
  normativeData: NormativeData[];
  athleteResults: AthleteResult[];
  selectedAthlete: string;
}

export default function DeutscherMotorikTest({
  normativeData,
  athleteResults,
  selectedAthlete
}: DeutscherMotorikTestProps) {
  const dmtTest = normativeData.find(test => test.test === "Standweitsprung DMT");
  if (!dmtTest) return null;

  const athleteResult = athleteResults.find(
    r => r.test === "Standweitsprung" && r.athlete === selectedAthlete
  );

  const getPercentileForValue = (values: number[], value: number): number => {
    const sortedValues = [...values].sort((a, b) => a - b);
    const index = sortedValues.findIndex(v => v >= value);
    return Math.round((index / (sortedValues.length - 1)) * 100);
  };

  const getRatingForPercentile = (ratings: NormativeData['ratings'], percentile: number): string => {
    const rating = ratings.find(r => percentile >= r.range[0] && percentile <= r.range[1]);
    return rating?.label || 'nicht bewertet';
  };

  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case 'ausgezeichnet (A)':
        return 'bg-emerald-500';
      case 'sehr gut (A)':
        return 'bg-green-500';
      case 'gut (A)':
        return 'bg-blue-500';
      case 'durchschnittlich (B)':
        return 'bg-yellow-500';
      case 'unterdurchschnittlich (C)':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const percentile = athleteResult 
    ? getPercentileForValue(dmtTest.values, athleteResult.result)
    : null;

  const rating = percentile !== null 
    ? getRatingForPercentile(dmtTest.ratings, percentile)
    : 'nicht bewertet';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <img 
          src="https://www.ifss.kit.edu/dmt/img/logo_dmt_sm.gif"
          alt="DMT Logo"
          className="h-8"
        />
        <h3 className="text-lg font-semibold text-gray-900">
          Deutscher Motorik Test
        </h3>
      </div>

      <div className="p-4 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Standweitsprung</span>
          {athleteResult && (
            <span className="text-sm font-medium text-gray-900 tabular-nums">
              {athleteResult.result} {dmtTest.unit}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className={`px-2 py-1 rounded-full text-white text-xs ${getRatingColor(rating)}`}>
            {rating}
          </div>
          {percentile !== null && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-gray-500 cursor-help">
                    <Info className="h-3.5 w-3.5" />
                    Percentile: {percentile}%
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    {percentile === 100 ? (
                      "Besser als alle Vergleichswerte"
                    ) : percentile === 0 ? (
                      "Unter allen Vergleichswerten"
                    ) : (
                      `Besser als ${percentile}% der Vergleichswerte`
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
