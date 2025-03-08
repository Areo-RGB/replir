import { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_more from 'highcharts/highcharts-more';
import HC_3d from 'highcharts/highcharts-3d';
import { athleteData, normativeData } from '../data';

// Initialize Highcharts modules
HC_more(Highcharts);
HC_3d(Highcharts);

const formatData = (testName: string) => {
  const testData = normativeData.find(n => n.test === testName);
  if (!testData) return { normativeData: [], athleteData: [] };

  // Sort values to get min/max range
  const sortedValues = [...testData.values].sort((a, b) => a - b);
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];

  // Create normative data points
  const normativeData = testData.values.map((value) => ({
    x: value,
    y: (value - min) / (max - min) * 100,
    z: 0
  }));

  // Get athlete results for this test
  const athleteData = athleteData
    .filter(r => r.test === testName)
    .map(r => ({
      x: r.result,
      y: (r.result - min) / (max - min) * 100,
      z: 50,
      name: r.athlete,
      result: r.result,
      unit: r.unit
    }));

  return { normativeData, athleteData };
};

export default function ComparativeAnalysis() {
  const [selectedTest, setSelectedTest] = useState(normativeData[0]?.test);
  const { normativeData: normPoints, athleteData: athletePoints } = formatData(selectedTest);

  const options: Highcharts.Options = {
    chart: {
      type: 'scatter3d',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 500,
        viewDistance: 5,
        frame: {
          bottom: { size: 1, color: 'rgba(0,0,0,0.05)' },
          back: { size: 1, color: 'rgba(0,0,0,0.05)' },
          side: { size: 1, color: 'rgba(0,0,0,0.05)' }
        }
      }
    },
    title: {
      text: `${selectedTest} - Performance Analysis`
    },
    subtitle: {
      text: 'Athlete performance compared to normative data'
    },
    xAxis: {
      title: { text: 'Performance Value' },
      gridLineWidth: 1
    },
    yAxis: {
      title: { text: 'Percentile' },
      min: 0,
      max: 100,
      gridLineWidth: 1
    },
    zAxis: {
      title: { text: 'Depth' },
      min: 0,
      max: 100,
      gridLineWidth: 1
    },
    legend: {
      enabled: true
    },
    tooltip: {
      formatter: function() {
        const point = this.point as any;
        if (point.name) {
          return `<b>${point.name}</b><br/>
                  Result: ${point.result} ${point.unit}<br/>
                  Percentile: ${point.y.toFixed(1)}%`;
        }
        return `<b>Normative Value</b><br/>
                Value: ${this.x}<br/>
                Percentile: ${this.y.toFixed(1)}%`;
      }
    },
    series: [{
      name: 'Normative Data',
      data: normPoints,
      color: 'rgba(156, 163, 175, 0.5)',
      marker: {
        radius: 2
      }
    }, {
      name: 'Athletes',
      type: 'scatter3d',
      data: athletePoints,
      color: 'rgb(99, 102, 241)',
      marker: {
        radius: 5
      }
    }] as any
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leistungsvergleich</h1>
        <p className="text-gray-600 mt-2">
          3D Vergleich der Leistungen mit normativen Daten
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
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

        <div className="h-[600px]">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}