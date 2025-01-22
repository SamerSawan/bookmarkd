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
    <div className="relative w-48 z-10" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown()}}
        className="flex items-center gap-1 text-secondary-dark bg-primary px-3 py-1 w-full text-center justify-center rounded-md hover:opacity-80 transition"
      >
        <IconPlus stroke={2} />
        <span>Add to Shelf</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-back-overlay rounded-md shadow-lg z-10">
          <ul className="py-1 text-secondary-strong">
            {shelves.map((shelf) => (
              <li
                key={shelf.id}
                className="px-4 py-2 hover:opacity-40 cursor-pointer"
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
