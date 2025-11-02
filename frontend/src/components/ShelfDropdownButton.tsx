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

const ShelfDropdownButton: React.FC<DropdownProps> = ({ shelves, onSelect, shelfIDsContainingBook = [] }) => {
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
    <div className="relative w-full" ref={dropdownRef}>
      {/* Full Width Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
        className="w-full bg-primary text-secondary-dark py-2 px-4 rounded my-2 hover:opacity-80 transition flex items-center justify-center gap-2"
        title="Add to shelf"
      >
        <IconPlus stroke={2} size={20} />
        <span>Add to Shelf</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-back-overlay border border-stroke-weak/50 rounded-lg shadow-card-hover z-50 overflow-hidden">
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

export default ShelfDropdownButton;
