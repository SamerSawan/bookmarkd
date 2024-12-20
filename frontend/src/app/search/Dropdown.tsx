import { useState, useEffect, useRef } from "react";
import { IconPlus } from '@tabler/icons-react';

const Dropdown = () => {
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

  const shelves = ["Currently Reading", "Want to Read", "Read"];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 text-secondary-dark bg-primary px-3 py-1 rounded-md hover:opacity-80 transition"
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
                key={shelf}
                className="px-4 py-2 hover:opacity-40 cursor-pointer"
                onClick={() => {
                  console.log(`Added to ${shelf}`); // placeholder
                  setIsOpen(false);
                }}
              >
                {shelf}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
