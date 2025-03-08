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
import { Trophy } from 'lucide-react';
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

  const getRatingForPercentile = (ratings: NormativeData['ratings'], percentile: number): string => {
    const rating = ratings.find(r => percentile >= r.range[0] && percentile <= r.range[1]);
    return rating?.label || 'nicht bewertet';
  };

  const getPercentileForValue = (values: number[], value: number, lowerIsBetter: boolean = false): number => {
    const sortedValues = [...values].sort((a, b) => a - b);
    const index = sortedValues.findIndex(v => v >= value);

    // For metrics where lower is better (like sprint times), reverse the percentile
    if (lowerIsBetter) {
      return Math.round(((sortedValues.length - 1 - index) / (sortedValues.length - 1)) * 100);
    }

    // For other metrics, higher is better
    return Math.round((index / (sortedValues.length - 1)) * 100);
  };

  const renderNormativeChart = (testData: NormativeData) => {
    const athleteResult = athleteResults.find(
      r => r.test === testData.test && r.athlete === selectedAthlete
    );

    const percentiles = Array.from({ length: 11 }, (_, i) => i * 10);
    const athletePercentile = athleteResult 
      ? getPercentileForValue(testData.values, athleteResult.result, testData.lowerIsBetter)
      : null;
    const athleteRating = athletePercentile !== null 
      ? getRatingForPercentile(testData.ratings, athletePercentile)
      : 'nicht bewertet';

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
            label: (context: any) => {
              return `${context.parsed.y} ${testData.unit}`;
            }
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

    return (
      <div key={testData.test} className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {testData.test} - DFB Leistungsdiagnostik
            </h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-white text-sm ${getRatingColor(athleteRating)}`}>
            {athleteRating === 'ausgezeichnet (A)' 
              ? `${testData.test}: ${athleteRating}`
              : athleteRating}
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

  const currentTestData = normativeData.find(data => data.test === selectedTest);
  return (
    <div className="space-y-4">
      {currentTestData && renderNormativeChart(currentTestData)}
    </div>
  );
}