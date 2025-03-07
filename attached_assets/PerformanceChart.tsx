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

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, selectedAthlete }) => {
  if (!selectedAthlete) return null;

  const calculateCategoryPerformance = (category: string): number => {
    const categoryTests = data.filter(result => result.category === category);
    const uniqueTests = Array.from(new Set(categoryTests.map(result => result.test)));
    
    let totalPerformance = 0;
    let testCount = 0;

    uniqueTests.forEach(test => {
      const testResults = categoryTests.filter(r => r.test === test);
      const avgResult = testResults.reduce((acc, curr) => acc + curr.result, 0) / testResults.length;
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

  const categoryPerformances = categories.map(category => ({
    category: category.name,
    performance: calculateCategoryPerformance(category.id)
  })).filter(cat => cat.performance !== 0);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${selectedAthlete}'s Performance by Category`,
        color: '#1f2937',
        font: {
          size: 16,
          weight: 'bold'
        }
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
      y: {
        title: {
          display: true,
          text: '% Difference from Average'
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
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 col-span-full">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default PerformanceChart;