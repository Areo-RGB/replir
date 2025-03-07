import { useState } from 'react';
import { Activity, Search } from 'lucide-react';
import { athleteData, categories } from '../data';
import CategoryFilter from '@/components/CategoryFilter';
import TestCard from '@/components/TestCard';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const uniqueTests = Array.from(new Set(athleteData.map(result => result.test)));

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
                <h1 className="ml-2 text-xl font-bold text-gray-900">Performance Overview</h1>
              </div>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
              selectedAthlete=""
            />
          ))}
        </div>
      </main>
    </div>
  );
}