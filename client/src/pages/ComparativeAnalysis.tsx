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
  ScatterChart,
} from 'recharts';
import { athleteData, normativeData } from '../data';

const formatData = (testName: string) => {
  const testData = normativeData.find(n => n.test === testName);
  if (!testData) return { areaData: [], scatterData: [] };

  // Sort values to get min/max range
  const sortedValues = [...testData.values].sort((a, b) => a - b);
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];
  const avg = sortedValues.reduce((a, b) => a + b, 0) / sortedValues.length;

  // Get all athlete results for this test
  const athleteResults = athleteData
    .filter(r => r.test === testName)
    .map(r => ({
      name: r.athlete,
      x: r.result,
      y: (r.result - min) / (max - min) * 100, // normalized position
      z: r.result,
      result: r.result,
      unit: r.unit
    }));

  // Create area chart data for normative range
  const areaData = Array.from({ length: 20 }, (_, i) => {
    const x = i * (max - min) / 19 + min;
    return {
      x,
      min: min,
      max: max,
      avg: avg,
    };
  });

  return { areaData, scatterData: athleteResults };
};

export default function ComparativeAnalysis() {
  const [selectedTest, setSelectedTest] = useState(normativeData[0]?.test);
  const athletes = Array.from(new Set(athleteData.map(data => data.athlete)));
  const { areaData, scatterData } = formatData(selectedTest);
  const testData = normativeData.find(n => n.test === selectedTest);

  // Generate different colors for each athlete
  const generateColor = (index: number) => {
    return `hsl(${index * 137.5 % 360}, 70%, 50%)`;
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

        <div className="h-[600px] grid grid-cols-1 gap-6">
          {/* Normative Range Area Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={areaData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="x" 
                  type="number" 
                  domain={['auto', 'auto']}
                  name="Value"
                />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-medium">Normative Range</p>
                        <p className="text-sm">Min: {data.min.toFixed(2)}</p>
                        <p className="text-sm">Max: {data.max.toFixed(2)}</p>
                        <p className="text-sm">Avg: {data.avg.toFixed(2)}</p>
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
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Athlete Results Scatter Plot */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Result" 
                  domain={['auto', 'auto']}
                />
                <YAxis type="number" dataKey="y" name="Performance" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm">
                          Result: {data.result} {data.unit}
                        </p>
                      </div>
                    );
                  }}
                />
                {athletes.map((athlete, index) => (
                  <Scatter
                    key={athlete}
                    name={athlete}
                    data={scatterData.filter(d => d.name === athlete)}
                    fill={generateColor(index)}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
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