import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export const FilterDropdown = ({ value, options, onChange, placeholder = "Select...", label, disabled = false }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="filter-dropdown-wrapper">
      {label && <label className="filter-dropdown-label">{label}</label>}
      <div className={`filter-dropdown ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`} ref={ref}>
        <button type="button" className="filter-dropdown-trigger" onClick={() => !disabled && setIsOpen(!isOpen)} onKeyDown={handleKeyDown} disabled={disabled}>
          <span className={!selectedOption ? "placeholder" : ""}>{selectedOption?.label || placeholder}</span>
          <ChevronDown size={16} className={`chevron ${isOpen ? "rotated" : ""}`} />
        </button>

        {isOpen && (
          <div className="filter-dropdown-menu">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`filter-dropdown-item ${option.value === value ? "selected" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                {option.value === value && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
