
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
            to={`/categorie/${cat.secureId || cat.name}`}
            className="relative group text-red-900 font-semibold hover:text-red-600 capitalize transition-all duration-300 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <span className="relative z-10">{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
          className="text-red-900 text-lg font-semibold hover:text-red-600 dark:text-neutral-200 dark:hover:text-red-400 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 hover:shadow-md transition-all duration-300"
        >
          <Menu className="h-5 w-5 mr-2" />
          Toutes les catégories
          <ChevronDown className="h-4 w-4 ml-2 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 max-h-80 text-red-900 font-semibold overflow-y-auto bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border border-red-200 dark:border-red-800 shadow-xl rounded-xl"
        align="start"
      >
        {categories.map(cat => (
          <DropdownMenuItem key={cat.secureId || cat.id} asChild>
            <Link 
              to={`/categorie/${cat.secureId || cat.name}`}
              className="w-full capitalize hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 transition-all duration-200 text-red-900 font-semibold px-4 py-3 rounded-lg mx-1"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</span>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesDropdown;
