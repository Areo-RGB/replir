import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { AthleteResult } from '../data';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: AthleteResult[];
  selectedAthlete: string;
}

export default function RadarChart({ data, selectedAthlete }: RadarChartProps) {
  // Calculate performance metrics for each category
  const calculateCategoryScore = (category: string): number => {
    const categoryTests = data.filter(result => result.category === category && result.category !== 'participation');
    const uniqueTests = Array.from(new Set(categoryTests.map(result => result.test)));
    
    let totalScore = 0;
    let testCount = 0;

    uniqueTests.forEach(test => {
      const testResults = categoryTests.filter(r => r.test === test);
      const avgResult = testResults.reduce((acc, curr) => acc + curr.result, 0) / testResults.length;
      const athleteResult = testResults.find(r => r.athlete === selectedAthlete);
      
      if (athleteResult) {
        // For time-based results (lower is better)
        if (athleteResult.unit === 's') {
          totalScore += ((avgResult - athleteResult.result) / avgResult) * 100 + 100;
        } else {
          // For other metrics (higher is better)
          totalScore += (athleteResult.result / avgResult) * 100;
        }
        testCount++;
      }
    });

    return testCount > 0 ? totalScore / testCount : 0;
  };

  const categories = ['speed', 'endurance', 'strength', 'coordination'];
  const scores = categories.map(category => calculateCategoryScore(category));

  const chartData = {
    labels: ['Speed', 'Endurance', 'Strength', 'Coordination'],
    datasets: [
      {
        label: 'Performance',
        data: scores,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)'
      }
    ]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        suggestedMin: 0,
        suggestedMax: 150,
        ticks: {
          stepSize: 30,
          callback: (value: number) => `${value}%`
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw.toFixed(1)}%`
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Profile</h2>
      <div className="h-[400px] w-full">
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
}
