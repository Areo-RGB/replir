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

  const renderChart = (testData: NormativeData) => {
    const athleteResult = athleteResults.find(
      r => r.test === testData.test && r.athlete === selectedAthlete
    );

    const percentiles = Array.from({ length: 11 }, (_, i) => i * 10);

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

    return { options, data };
  };

  const testRatings = getTestRatings();
  const { options, data } = renderChart(normativeData.find(data => data.test === selectedTest)!);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <img 
          src="https://upload.wikimedia.org/wikipedia/de/c/c0/DFB-Logo.svg" 
          alt="DFB Logo" 
          className="h-6 w-6"
        />
        <h3 className="text-lg font-semibold text-gray-900">
          Übersicht
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart with Test Selector */}
        <div className="lg:col-span-2">
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

          <div className="h-[400px]">
            <Line options={options} data={data} />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="h-1 w-4 bg-indigo-500 rounded"></div>
              <span>Normative Range</span>
              <div className="h-1 w-4 border-t-2 border-red-500 border-dashed"></div>
              <span>Athlete Result</span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="space-y-4">
          {testRatings.map((rating) => (
            <div key={rating.test} className="p-4 rounded-lg bg-gray-50">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                {rating.test}
              </h4>
              {rating.result !== undefined && (
                <div className="text-2xl font-bold text-gray-900 mb-2 tabular-nums">
                  {rating.result} {rating.unit}
                </div>
              )}
              <div className="space-y-2">
                <div className={`px-3 py-1.5 rounded-full text-white text-sm font-medium text-center ${getRatingColor(rating.rating)}`}>
                  {rating.rating}
                </div>
                {rating.percentile !== null && (
                  <div className="text-sm text-center text-gray-600">
                    Percentile: {rating.percentile}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}