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
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}%`
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <PartyPopper className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Participation Rate</h2>
      </div>
      <div className="h-[300px] flex items-center justify-center">
        <Pie data={data} options={options} />
      </div>
      <div className="mt-4 text-center">
        <span className="text-2xl font-bold text-primary">{participationRate}%</span>
        <p className="text-sm text-gray-600 mt-1">Overall Participation</p>
      </div>
    </div>
  );
}