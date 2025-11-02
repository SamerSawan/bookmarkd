import { useState, useRef, useEffect } from "react";
import { IconPlus, IconCheck } from '@tabler/icons-react';

interface Shelf {
  id: string;
  name: string;
}

interface DropdownProps {
  shelves: Shelf[];
  onSelect: (shelfID: string, shelfName: string) => void;
  shelfIDsContainingBook?: string[];
}

const ShelfDropdownCircular: React.FC<DropdownProps> = ({ shelves, onSelect, shelfIDsContainingBook = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Circular Add to Shelf Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
        className="bg-primary/20 p-3 rounded-full hover:scale-110 transition-transform flex items-center justify-center"
        title="Add to shelf"
      >
        <IconPlus className="text-primary" size={24} stroke={2} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-back-overlay border border-stroke-weak/50 rounded-lg shadow-card-hover z-50 overflow-hidden">
          <ul className="py-1 text-secondary-strong max-h-64 overflow-y-auto">
            {shelves.map((shelf) => {
              const isInShelf = shelfIDsContainingBook.includes(shelf.id);
              return (
                <li
                  key={shelf.id}
                  className="px-4 py-3 hover:bg-primary/20 hover:text-primary-light cursor-pointer transition-colors duration-150 flex items-center justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(shelf.id, shelf.name);
                    setIsOpen(false);
                  }}
                >
                  <span>{shelf.name}</span>
                  {isInShelf && (
                    <IconCheck className="text-primary" size={20} stroke={2} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShelfDropdownCircular;
