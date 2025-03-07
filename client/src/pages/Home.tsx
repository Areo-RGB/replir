import { useState } from 'react';
import { Activity, Search, Medal, TrendingUp } from 'lucide-react';
import { athleteData, categories, participationData } from '../data';
import CategoryFilter from '@/components/CategoryFilter';
import TestCard from '@/components/TestCard';
import ParticipationCard from '@/components/ParticipationCard';

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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const uniqueTests = Array.from(new Set(athleteData.map(result => result.test)));
  const topPerformers = calculateZScores()
    .sort((a, b) => b.averageZScore - a.averageZScore)
    .slice(0, 3);

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
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

          <ParticipationCard data={participationData} />
        </div>

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