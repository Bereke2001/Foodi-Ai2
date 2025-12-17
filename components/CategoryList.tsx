import React from 'react';
import { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
  onSelect: (name: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelect }) => {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar snap-x">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.name)}
          className="flex-shrink-0 snap-start px-5 py-2.5 rounded-2xl bg-white border border-gray-100 text-gray-700 shadow-sm hover:shadow-md hover:border-pink-200 hover:text-pink-600 transition-all duration-300 whitespace-nowrap flex items-center gap-2 group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
          <span className="font-semibold text-sm">{cat.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryList;