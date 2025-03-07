import { Category } from '../data';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Timer, 
  Dumbbell, 
  MoveDiagonal
} from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons = {
  'speed': Zap,
  'endurance': Timer,
  'strength': Dumbbell,
  'coordination': MoveDiagonal,
};

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {categories.map(category => {
        const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(selectedCategory === category.id ? '' : category.id)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
              selectedCategory === category.id
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}