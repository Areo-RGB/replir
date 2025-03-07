import { User } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { athleteData } from '../data';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [isPlayerRoute] = useRoute('/player/:name');
  const uniqueAthletes = Array.from(new Set(athleteData.map(result => result.athlete))).sort();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Athletes</h2>
      </div>
      
      <div className="space-y-1">
        <Link href="/">
          <a className={cn(
            "block px-3 py-2 rounded-lg text-sm",
            !isPlayerRoute ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
          )}>
            Overview
          </a>
        </Link>
        
        {uniqueAthletes.map(athlete => (
          <Link key={athlete} href={`/player/${athlete}`}>
            <a className={cn(
              "block px-3 py-2 rounded-lg text-sm",
              isPlayerRoute && window.location.pathname === `/player/${athlete}` 
                ? "bg-primary text-white" 
                : "text-gray-600 hover:bg-gray-100"
            )}>
              {athlete}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
