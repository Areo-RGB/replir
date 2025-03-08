import React from 'react';
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
  
  const renderNormativeChart = (testData: NormativeData) => {
    const athleteResult = athleteResults.find(
      r => r.test === testData.test && r.athlete === selectedAthlete
    );

    if (!athleteResult) return null;

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
        {
          label: 'Athlete',
          data: Array(11).fill(athleteResult.result),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderDash: [5, 5],
          pointStyle: false
        }
      ]
    };

    return (
      <div key={testData.test} className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            {testData.test} - Normative Comparison
          </h3>
        </div>
        <div className="h-[300px]">
          <Line options={options} data={data} />
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 bg-indigo-500 rounded"></div>
            <span>Normative Range</span>
            <div className="h-1 w-4 border-t-2 border-red-500 border-dashed"></div>
            <span>Athlete Result ({athleteResult.result} {testData.unit})</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {normativeData.map(data => renderNormativeChart(data))}
    </div>
  );
}
