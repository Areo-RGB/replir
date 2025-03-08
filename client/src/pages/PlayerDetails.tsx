import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Activity } from 'lucide-react';
import { athleteData, normativeData } from '../data';
import PerformanceChart from '@/components/PerformanceChart';
import ResultsTable from '@/components/ResultsTable';
import NormativeComparison from '@/components/NormativeComparison';

// Calculate z-scores and aggregate performance
const calculateZScores = () => {
  const athletes = Array.from(new Set(athleteData.map(result => result.athlete)));
  const tests = Array.from(new Set(athleteData.map(result => result.test)));

  // Calculate z-scores for each test
  const testStats = tests.map(test => {
    const results = athleteData.filter(r => r.test === test);
    const mean = results.reduce((acc, r) => acc + r.result, 0) / results.length;
    const stdDev = Math.sqrt(
      results.reduce((acc, r) => acc + Math.pow(r.result - mean, 2), 0) / results.length
    );
    return { test, mean, stdDev };
  });

  // Calculate aggregate z-scores for each athlete
  return athletes.map(athlete => {
    let totalZScore = 0;
    let testCount = 0;

    testStats.forEach(({ test, mean, stdDev }) => {
      const result = athleteData.find(r => r.athlete === athlete && r.test === test);
      if (result) {
        // For time-based results (lower is better), invert the z-score
        const zScore = (result.result - mean) / stdDev;
        totalZScore += result.unit === 's' ? -zScore : zScore;
        testCount++;
      }
    });

    return {
      athlete,
      averageZScore: testCount > 0 ? totalZScore / testCount : 0
    };
  });
};

export default function PlayerDetails() {
  const [, params] = useRoute('/player/:name');
  const [, setLocation] = useLocation();

  // If no player name is provided, redirect to home
  useEffect(() => {
    if (!params?.name) {
      setLocation('/');
    }
  }, [params?.name, setLocation]);

  // Early return if no player name
  if (!params?.name) return null;

  const playerName = params.name;
  const player = athleteData.find(result => result.athlete === playerName);

  // If player not found, redirect to home
  useEffect(() => {
    if (!player) {
      setLocation('/');
    }
  }, [player, setLocation]);

  // Early return if player not found
  if (!player) return null;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
      </div>

      <div className="mb-6">
        <PerformanceChart data={athleteData} selectedAthlete={playerName} />
      </div>
      <div className="mb-6">
        <NormativeComparison 
          normativeData={normativeData}
          athleteResults={athleteData}
          selectedAthlete={playerName}
        />
      </div>
      <ResultsTable data={athleteData} selectedAthlete={playerName} />
    </div>
  );
}