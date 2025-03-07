import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PartyPopper } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ParticipationPieChartProps {
  participationRate: number;
}

export default function ParticipationPieChart({ participationRate }: ParticipationPieChartProps) {
  const absentRate = 100 - participationRate;

  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [participationRate, absentRate],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)', // green
          'rgba(239, 68, 68, 0.6)', // red
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}%`
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <PartyPopper className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Participation Rate</h2>
      </div>
      <div className="h-[200px] flex items-center justify-center">
        <Pie data={data} options={options} />
      </div>
      <div className="mt-2 text-center">
        <span className="text-xl font-bold text-primary">{participationRate}%</span>
        <p className="text-xs text-gray-600 mt-0.5">Overall Participation</p>
      </div>
    </div>
  );
}