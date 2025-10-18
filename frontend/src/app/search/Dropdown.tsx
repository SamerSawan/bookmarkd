import { useState, useRef, useEffect } from "react";
import { IconPlus } from '@tabler/icons-react';
import 'react-toastify/dist/ReactToastify.css';

interface Shelf {
  id: string;
  name: string;
}

interface DropdownProps {
  shelves: Shelf[];
  onSelect: (shelfID: string, shelfName: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ shelves, onSelect }) => {
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
    <div className="relative w-full z-20" ref={dropdownRef}>
      {/* Add to Shelf Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown()}}
        className="w-full bg-primary text-secondary-dark py-2 px-4 rounded my-2 hover:bg-primary hover:opacity-80 transition flex items-center justify-center gap-2"
        title="Add to shelf"
      >
        <IconPlus stroke={2} size={20} />
        <span>Add to Shelf</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-back-overlay border border-stroke-weak/50 rounded-lg shadow-card-hover z-50 overflow-hidden">
          <ul className="py-1 text-secondary-strong max-h-64 overflow-y-auto">
            {shelves.map((shelf) => (
              <li
                key={shelf.id}
                className="px-4 py-3 hover:bg-primary/20 hover:text-primary-light cursor-pointer transition-colors duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(shelf.id, shelf.name)
                  setIsOpen(false);
                }}
              >
                {shelf.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
