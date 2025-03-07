import React, { useState } from 'react';
import { Activity, Search, User, Filter } from 'lucide-react';
import { athleteData, categories } from './data';
import TestCard from './components/TestCard';
import PerformanceChart from './components/PerformanceChart';

function App() {
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Athlete Performance Dashboard</h1>
            </div>
            <div className="flex gap-4 items-center flex-wrap">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={selectedAthlete}
                  onChange={(e) => setSelectedAthlete(e.target.value)}
                >
                  <option value="">All Athletes</option>
                  {uniqueAthletes.sort().map(athlete => (
                    <option key={athlete} value={athlete}>{athlete}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="mt-8">
            <PerformanceChart data={athleteData} selectedAthlete={selectedAthlete} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;