import { PartyPopper } from 'lucide-react';
import { AthleteParticipation } from '../data';
import { cn } from '@/lib/utils';

interface ParticipationCardProps {
  data: AthleteParticipation[];
}

export default function ParticipationCard({ data }: ParticipationCardProps) {
  const sortedData = [...data].sort((a, b) => b.participation - a.participation);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <PartyPopper className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Participation Rate</h2>
      </div>

      <div className="space-y-3">
        {sortedData.map((item, index) => (
          <div 
            key={item.athlete}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm w-4",
                index < 3 ? "text-primary font-semibold" : "text-gray-400"
              )}>
                {index + 1}.
              </span>
              <span className="text-sm text-gray-700">
                {item.athlete}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${item.participation}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 w-8">
                {item.participation}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
