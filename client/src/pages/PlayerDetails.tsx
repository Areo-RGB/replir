import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Activity } from 'lucide-react';
import { athleteData } from '../data';
import PerformanceChart from '@/components/PerformanceChart';

export default function PlayerDetails() {
  const [, params] = useRoute('/player/:name');
  const [, setLocation] = useLocation();
  const playerName = params?.name;
  
  const player = athleteData.find(result => result.athlete === playerName);
  
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
        <h1 className="text-2xl font-bold text-gray-900">{playerName}'s Performance</h1>
      </div>

      <div className="space-y-6">
        <PerformanceChart 
          data={athleteData}
          selectedAthlete={playerName} 
        />
      </div>
    </div>
  );
}
