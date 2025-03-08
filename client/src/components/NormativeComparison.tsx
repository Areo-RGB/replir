import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { NormativeData, AthleteResult } from '../data';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface NormativeComparisonProps {
  normativeData: NormativeData[];
  athleteResults: AthleteResult[];
  selectedAthlete: string;
}

export default function NormativeComparison({ 
  normativeData, 
  athleteResults, 
  selectedAthlete 
}: NormativeComparisonProps) {
  const [selectedTest, setSelectedTest] = useState(normativeData[0]?.test);
  const [isRatingsExpanded, setIsRatingsExpanded] = useState(false);

  const getRatingForPercentile = (ratings: NormativeData['ratings'], percentile: number): string => {
    const rating = ratings.find(r => percentile >= r.range[0] && percentile <= r.range[1]);
    return rating?.label || 'nicht bewertet';
  };

  const getPercentileForValue = (values: number[], value: number, lowerIsBetter: boolean = false): number => {
    const sortedValues = [...values].sort((a, b) => a - b);
    const index = sortedValues.findIndex(v => v >= value);

    if (lowerIsBetter) {
      return Math.round(((sortedValues.length - 1 - index) / (sortedValues.length - 1)) * 100);
    }

    return Math.round((index / (sortedValues.length - 1)) * 100);
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

  const getTestRatings = () => {
    return normativeData.map(testData => {
      const athleteResult = athleteResults.find(
        r => r.test === testData.test && r.athlete === selectedAthlete
      );

      const percentile = athleteResult 
        ? getPercentileForValue(testData.values, athleteResult.result, testData.lowerIsBetter)
        : null;

      const rating = percentile !== null 
        ? getRatingForPercentile(testData.ratings, percentile)
        : 'nicht bewertet';

      return {
        test: testData.test,
        rating,
        percentile,
        result: athleteResult?.result,
        unit: testData.unit
      };
    });
  };

  const renderNormativeChart = (testData: NormativeData) => {
    const athleteResult = athleteResults.find(
      r => r.test === testData.test && r.athlete === selectedAthlete
    );

    const percentiles = Array.from({ length: 11 }, (_, i) => i * 10);
    const athletePercentile = athleteResult 
      ? getPercentileForValue(testData.values, athleteResult.result, testData.lowerIsBetter)
      : null;

    const options = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Percentile',
            color: 'rgb(107, 114, 128)'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: testData.unit,
            color: 'rgb(107, 114, 128)'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.parsed.y} ${testData.unit}`
          }
        }
      }
    };

    const data = {
      labels: percentiles,
      datasets: [
        {
          label: 'Normative Data',
          data: testData.values,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          tension: 0.4
        },
        ...(athleteResult ? [{
          label: 'Athlete',
          data: Array(11).fill(athleteResult.result),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderDash: [5, 5],
          pointStyle: false as const
        }] : [])
      ]
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img 
              src="/DFB-Logo.svg.png" 
              alt="DFB Logo" 
              className="h-6 w-6"
            />
            <h3 className="text-lg font-semibold text-gray-900">
              DFB Leistungsdiagnostik
            </h3>
          </div>
        </div>

        {/* Test Selector */}
        <div className="mb-4">
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {normativeData.map(test => (
              <option key={test.test} value={test.test}>
                {test.test}
              </option>
            ))}
          </select>
        </div>

        <div className="h-[300px]">
          <Line options={options} data={data} />
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 bg-indigo-500 rounded"></div>
            <span>Normative Range</span>
            {athleteResult && (
              <>
                <div className="h-1 w-4 border-t-2 border-red-500 border-dashed"></div>
                <span>Athlete Result ({athleteResult.result} {testData.unit})</span>
                <span className="ml-auto">
                  Percentile: {athletePercentile}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render KPI section with all test ratings
  const testRatings = getTestRatings();

  return (
    <div className="space-y-4">
      {/* KPI Section */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsRatingsExpanded(!isRatingsExpanded)}
        >
          <div className="flex items-center gap-2">
            <img 
              src="/DFB-Logo.svg.png" 
              alt="DFB Logo" 
              className="h-6 w-6"
            />
            <h3 className="text-lg font-semibold text-gray-900">
              Performance Ratings
            </h3>
          </div>
          {isRatingsExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>

        {isRatingsExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testRatings.map(({ test, rating, result, unit, percentile }) => (
              <div key={test} className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{test}</span>
                  {result !== undefined && (
                    <span className="text-sm text-gray-500">
                      {result} {unit}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className={`px-2 py-1 rounded-full text-white text-xs ${getRatingColor(rating)}`}>
                    {rating}
                  </div>
                  {percentile !== null && (
                    <span className="text-xs text-gray-500">
                      Percentile: {percentile}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart Section */}
      {normativeData.find(data => data.test === selectedTest) && 
        renderNormativeChart(normativeData.find(data => data.test === selectedTest)!)}
    </div>
  );
}