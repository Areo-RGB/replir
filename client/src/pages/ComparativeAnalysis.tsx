import { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { athleteData, normativeData } from '../data';

const formatData = (testName: string) => {
  const testData = normativeData.find(n => n.test === testName);
  if (!testData) return { normativeData: [], athleteData: [] };

  // Sort values to get min/max range
  const sortedValues = [...testData.values].sort((a, b) => a - b);
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];

  // Create normative data surface points for 3D visualization
  const normativePoints = [];
  const gridSize = 10; // Create a 10x10 grid for the surface

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = min + (max - min) * (i / (gridSize - 1));
      const normalizedX = (x - min) / (max - min) * 100;
      const z = j * 5; // Depth dimension

      // Calculate y value based on normal distribution
      const mean = (min + max) / 2;
      const stdDev = (max - min) / 4;
      const y = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2))) * 100;

      normativePoints.push({
        x,
        y,
        z,
        value: x,
        type: 'normative'
      });
    }
  }

  // Get athlete results for this test
  const athletePoints = athleteData
    .filter(r => r.test === testName)
    .map((r, index) => ({
      x: r.result,
      y: (r.result - min) / (max - min) * 100,
      z: 25 + index * 5, // Position athletes in the middle of the visualization
      athlete: r.athlete,
      result: r.result,
      unit: r.unit,
      type: 'athlete'
    }));

  return {
    normativeData: normativePoints,
    athleteData: athletePoints
  };
};

export default function ComparativeAnalysis() {
  const [selectedTest, setSelectedTest] = useState(normativeData[0]?.test);
  const { normativeData: normPoints, athleteData: athletePoints } = formatData(selectedTest);

  // Generate different colors for each athlete
  const generateColor = (index: number) => {
    return `hsl(${index * 137.5 % 360}, 70%, 50%)`;
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
                label={{ value: 'Performance', position: 'bottom' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Percentile" 
                label={{ value: 'Percentile', angle: -90, position: 'left' }}
              />
              <ZAxis 
                type="number" 
                dataKey="z" 
                range={[50, 400]} 
                name="Depth"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;

                  if (data.type === 'athlete') {
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-medium">{data.athlete}</p>
                        <p className="text-sm">
                          Result: {data.result} {data.unit}
                        </p>
                        <p className="text-sm">
                          Percentile: {data.y.toFixed(1)}%
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-medium">Normative Data</p>
                        <p className="text-sm">Value: {data.value.toFixed(2)}</p>
                      </div>
                    );
                  }
                }}
              />
              {/* Normative data surface */}
              <Scatter
                name="Normative Range"
                data={normPoints}
                fill="rgba(156, 163, 175, 0.3)"
                line={{ stroke: 'rgba(156, 163, 175, 0.5)', strokeWidth: 1 }}
              />
              {/* Athlete results */}
              {athletePoints.map((point, index) => (
                <Scatter
                  key={point.athlete}
                  name={point.athlete}
                  data={[point]}
                  fill={generateColor(index)}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {athletePoints.map((point, index) => (
            <div 
              key={point.athlete}
              className="flex items-center gap-2 text-sm"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: generateColor(index) }}
              />
              <span>{point.athlete}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}