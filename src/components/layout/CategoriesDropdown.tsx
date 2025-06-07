
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from 'lucide-react';
import { Category } from '@/types/category';
import { getSecureCategoryUrl } from '@/services/secureCategories';

interface CategoriesDropdownProps {
  categories: Category[];
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ categories }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (categories.length < 8) {
    return (
      <div className="flex items-center justify-center space-x-6 flex-wrap">
        {categories.map(cat => (
          <Link 
            key={cat.secureId || cat.id}
            to={getSecureCategoryUrl(cat.name)}
            className="relative group text-red-900 font-semibold hover:text-red-600 capitalize transition-all duration-300 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:to-rose-900/20 hover:shadow-lg transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-red-900 text-lg font-semibold hover:text-red-600 dark:text-neutral-200 dark:hover:text-red-400 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl px-6 py-3"
        >
          <Menu className="h-5 w-5 mr-2" />
          Toutes les catégories
          <ChevronDown className="h-4 w-4 ml-2 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-72 max-h-96 text-red-900 font-semibold overflow-y-auto bg-white/95 dark:bg-neutral-800/95 backdrop-blur-lg border border-red-200 dark:border-red-800 shadow-2xl rounded-2xl p-2"
        align="start"
      >
        {categories.map(cat => (
          <DropdownMenuItem key={cat.secureId || cat.id} asChild>
            <Link 
              to={getSecureCategoryUrl(cat.name)}
              className="w-full capitalize hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/30 dark:hover:to-rose-900/30 transition-all duration-300 text-red-900 dark:text-red-100 font-semibold px-4 py-4 rounded-xl mx-1 group hover:shadow-lg transform hover:scale-[1.02]"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity group-hover:scale-110"></div>
                <span className="flex-1">{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</span>
                <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesDropdown;
