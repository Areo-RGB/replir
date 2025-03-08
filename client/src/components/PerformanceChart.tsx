import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AthleteResult, categories } from '../data';
import { LucideIcon, Zap, Timer, Dumbbell, MoveDiagonal, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  data: AthleteResult[];
  selectedAthlete: string;
}

const categoryIcons: Record<string, LucideIcon> = {
  'speed': Zap,
  'endurance': Timer,
  'strength': Dumbbell,
  'coordination': MoveDiagonal,
  'deutscher_motorik_test': Activity,
};

export default function PerformanceChart({ data, selectedAthlete }: PerformanceChartProps) {
  // Calculate performance percentage for each category
  const calculateCategoryPerformance = (category: string): number => {
    // Filter tests for this category, excluding tests that should be in DMT
    const categoryTests = data.filter(result => {
      if (category === 'deutscher_motorik_test') {
        return result.category === category;
      }
      // For other categories, exclude Standweitsprung test
      return result.category === category && result.test !== 'Standweitsprung';
    });

    const uniqueTests = Array.from(new Set(categoryTests.map(result => result.test)));

    let totalPerformance = 0;
    let testCount = 0;

    uniqueTests.forEach(test => {
      const testResults = categoryTests.filter(r => r.test === test);
      const avgResult = testResults.reduce((acc, r) => acc + r.result, 0) / testResults.length;
      const athleteResult = testResults.find(r => r.athlete === selectedAthlete);

      if (athleteResult) {
        // For time-based results (lower is better)
        if (athleteResult.unit === 's') {
          totalPerformance += ((avgResult - athleteResult.result) / avgResult) * 100;
        } else {
          // For other metrics (higher is better)
          totalPerformance += ((athleteResult.result - avgResult) / avgResult) * 100;
        }
        testCount++;
      }
    });

    return testCount > 0 ? totalPerformance / testCount : 0;
  };

  // Calculate performance data for each category
  const categoryPerformances = categories
    .filter(category => category.id !== 'participation')
    .map(category => ({
      category: category.name,
      performance: calculateCategoryPerformance(category.id)
    }))
    .filter(cat => cat.performance !== 0);

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.raw.toFixed(1)}% ${context.raw >= 0 ? 'better' : 'worse'} than average`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: (value: any) => `${value}%`
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  const chartData = {
    labels: categoryPerformances.map(d => d.category),
    datasets: [
      {
        data: categoryPerformances.map(d => d.performance),
        backgroundColor: categoryPerformances.map(d => 
          d.performance >= 0 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'
        ),
        borderColor: categoryPerformances.map(d => 
          d.performance >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {selectedAthlete}'s Performance
        </h2>
      </div>

      <div className="h-[200px]">
        <Bar options={options} data={chartData} />
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.filter(category => category.id !== 'participation').map(category => {
          const Icon = categoryIcons[category.id];
          const performance = categoryPerformances.find(p => p.category === category.name)?.performance ?? 0;

          return (
            <div 
              key={category.id}
              className="flex items-center gap-2 p-3 rounded-lg bg-gray-50"
            >
              {Icon && <Icon className="h-5 w-5 text-gray-600" />}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                </div>
                <div className={`text-sm ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {performance.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}