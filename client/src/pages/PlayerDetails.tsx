import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Activity } from 'lucide-react';
import { athleteData, normativeData } from '../data';
import PerformanceChart from '@/components/PerformanceChart';
import ResultsTable from '@/components/ResultsTable';
import NormativeDataView from '@/components/NormativeDataView';

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
        <NormativeDataView
          normativeData={normativeData}
          athleteResults={athleteData}
          selectedAthlete={playerName}
        />
      </div>
      <ResultsTable data={athleteData} selectedAthlete={playerName} />
    </div>
  );
}