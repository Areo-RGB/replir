import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Activity, Medal, TrendingUp } from 'lucide-react';
import { athleteData } from '../data';
import PerformanceChart from '@/components/PerformanceChart';
import RadarChart from '@/components/RadarChart';
import ResultsTable from '@/components/ResultsTable';
import ParticipationPieChart from '@/components/ParticipationPieChart';

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
  const playerName = params?.name;

  const player = athleteData.find(result => result.athlete === playerName);
  const participationData = athleteData.find(
    result => result.athlete === playerName && result.test === "Teilnahme"
  );
  const participationRate = participationData?.result ?? 0;

  const topPerformers = calculateZScores()
    .sort((a, b) => b.averageZScore - a.averageZScore)
    .slice(0, 3);

  useEffect(() => {
    if (!player) {
      setLocation('/');
    }
  }, [player, setLocation]);

  if (!player) return null;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Medal className="h-5 w-5 text-yellow-500" />
          Top Performers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topPerformers.map((performer, index) => (
            <div 
              key={performer.athlete}
              className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
                index === 0 ? 'border-yellow-400' :
                index === 1 ? 'border-gray-400' :
                'border-amber-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{performer.athlete}</span>
                <TrendingUp className={`h-4 w-4 ${
                  index === 0 ? 'text-yellow-500' :
                  index === 1 ? 'text-gray-500' :
                  'text-amber-600'
                }`} />
              </div>
              <div className="text-sm text-gray-600">
                Performance Score: {performer.averageZScore.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RadarChart data={athleteData} selectedAthlete={playerName} />
        <PerformanceChart data={athleteData} selectedAthlete={playerName} />
        <ParticipationPieChart participationRate={participationRate} />
      </div>

      <ResultsTable data={athleteData} selectedAthlete={playerName} />
    </div>
  );
}