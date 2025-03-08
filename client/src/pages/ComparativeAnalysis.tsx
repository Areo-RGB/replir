import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
} from 'recharts';
import { athleteData, normativeData } from '../data';

const formatData = (testName: string) => {
  const testData = normativeData.find(n => n.test === testName);
  if (!testData) return [];

  // Sort values to get min/max range
  const sortedValues = [...testData.values].sort((a, b) => a - b);
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];
  const avg = sortedValues.reduce((a, b) => a + b, 0) / sortedValues.length;

  // Get all athlete results for this test
  const athleteResults = athleteData
    .filter(r => r.test === testName)
    .map(r => ({
      athlete: r.athlete,
      result: r.result,
      unit: r.unit
    }));

  // Create data points for the area chart (normative range)
  return Array.from({ length: 10 }, (_, i) => {
    const x = i * (max - min) / 9 + min;
    return {
      x,
      min: min,
      max: max,
      avg: avg,
      ...athleteResults.reduce((acc, r) => ({
        ...acc,
        [r.athlete]: r.result
      }), {})
    };
  });
};

export default function ComparativeAnalysis() {
  const [selectedTest, setSelectedTest] = useState(normativeData[0]?.test);
  const data = formatData(selectedTest);
  const athletes = Array.from(new Set(athleteData.map(data => data.athlete)));

  // Generate different colors for each athlete
  const generateColor = (index: number, alpha: number = 1) => {
    const hue = (index * 137.5) % 360; // Golden angle approximation
    return `hsla(${hue}, 70%, 50%, ${alpha})`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leistungsvergleich</h1>
        <p className="text-gray-600 mt-2">
          Vergleich der Leistungen mit normativen Daten
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="x" 
                type="number"
                domain={['dataMin', 'dataMax']}
                name="Value"
              />
              <YAxis />
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-medium text-gray-900">
                        Value: {payload[0].payload.x.toFixed(2)}
                      </p>
                      {athletes.map(athlete => {
                        const value = payload[0].payload[athlete];
                        if (value !== undefined) {
                          return (
                            <p key={athlete} className="text-sm">
                              {athlete}: {value}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="max"
                stroke="rgb(99, 102, 241)"
                fill="rgb(99, 102, 241)"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="min"
                stroke="rgb(99, 102, 241)"
                fill="rgb(99, 102, 241)"
                fillOpacity={0.1}
              />
              {athletes.map((athlete, index) => (
                <Scatter
                  key={athlete}
                  name={athlete}
                  dataKey={athlete}
                  fill={generateColor(index)}
                  shape="circle"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {athletes.map((athlete, index) => (
            <div 
              key={athlete}
              className="flex items-center gap-2 text-sm"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: generateColor(index) }}
              />
              <span>{athlete}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}