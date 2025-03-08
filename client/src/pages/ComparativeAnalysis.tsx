import { useEffect } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { athleteData, normativeData } from '../data';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Generate different colors for each athlete
const generateColor = (index: number, alpha: number = 1) => {
  const hue = (index * 137.5) % 360; // Golden angle approximation
  return `hsla(${hue}, 70%, 50%, ${alpha})`;
};

export default function ComparativeAnalysis() {
  const tests = normativeData.map(data => data.test);
  const athletes = Array.from(new Set(athleteData.map(data => data.athlete)));

  // Calculate percentiles and include normative data
  const datasets = [
    // Normative data - average performance
    {
      label: 'Normative Average',
      data: tests.map(test => {
        const testData = normativeData.find(n => n.test === test);
        if (!testData) return 0;
        const values = testData.values;
        return values.reduce((a, b) => a + b, 0) / values.length;
      }),
      backgroundColor: 'rgba(200, 200, 200, 0.2)',
      borderColor: 'rgba(200, 200, 200, 0.8)',
      borderWidth: 2,
      borderDash: [5, 5],
    },
    // Athletes' data
    ...athletes.map((athlete, index) => {
      const color = generateColor(index);
      const data = tests.map(test => {
        const testData = normativeData.find(n => n.test === test);
        const athleteResult = athleteData.find(
          r => r.test === test && r.athlete === athlete
        );

        if (!testData || !athleteResult) return 0;

        const values = [...testData.values].sort((a, b) => a - b);
        const resultIndex = values.findIndex(v => v >= athleteResult.result);

        // Calculate percentile (0-100)
        let percentile = Math.round((resultIndex / (values.length - 1)) * 100);

        // Invert percentile if lower is better
        if (testData.lowerIsBetter) {
          percentile = 100 - percentile;
        }

        return percentile;
      });

      return {
        label: athlete,
        data,
        backgroundColor: generateColor(index, 0.2),
        borderColor: color,
        borderWidth: 2,
      };
    })
  ];

  const data = {
    labels: tests,
    datasets,
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const athlete = context.dataset.label;
            const value = context.parsed.r;
            const testName = context.label;
            const athleteResult = athleteData.find(
              r => r.test === testName && r.athlete === athlete
            );

            if (athleteResult) {
              return `${athlete}: ${value}% (${athleteResult.result} ${athleteResult.unit})`;
            }
            return `${athlete}: ${value}%`;
          }
        }
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leistungsvergleich</h1>
        <p className="text-gray-600 mt-2">
          Vergleich der Leistungen aller Athleten in allen Testbereichen mit normativen Daten
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-[600px] w-full">
          <Radar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}