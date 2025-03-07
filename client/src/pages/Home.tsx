import { useState } from 'react';
import { Activity, Search, Filter } from 'lucide-react';
import { athleteData, categories } from '../data';
import CategoryFilter from '@/components/CategoryFilter';
import TestCard from '@/components/TestCard';
import PerformanceChart from '@/components/PerformanceChart';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const uniqueTests = Array.from(new Set(athleteData.map(result => result.test)));
  const uniqueAthletes = Array.from(new Set(athleteData.map(result => result.athlete)));

  const filteredTests = uniqueTests.filter(test => {
    const matchesSearch = test.toLowerCase().includes(searchTerm.toLowerCase());
    const testCategory = athleteData.find(result => result.test === test)?.category || '';
    return matchesSearch && (!selectedCategory || testCategory === selectedCategory);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="ml-2 text-xl font-bold text-gray-900">Athlete Stats</h1>
              </div>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                  value={selectedAthlete}
                  onChange={(e) => setSelectedAthlete(e.target.value)}
                >
                  <option value="">All Athletes</option>
                  {uniqueAthletes.sort().map(athlete => (
                    <option key={athlete} value={athlete}>{athlete}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map(test => (
            <TestCard
              key={test}
              title={test}
              results={athleteData.filter(result => result.test === test)}
              selectedAthlete={selectedAthlete}
            />
          ))}
        </div>

        {selectedAthlete && (
          <div className="mt-6">
            <PerformanceChart 
              data={athleteData}
              selectedAthlete={selectedAthlete} 
            />
          </div>
        )}
      </main>
    </div>
  );
}