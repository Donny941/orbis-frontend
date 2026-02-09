import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { resourceService } from "../../../services/resourceService";
import type { Resource } from "../../../types";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  const searchResources = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await resourceService.getResources({
        search: searchQuery.trim(),
        page: 1,
        size: 8,
      });
      setResults(response.data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(0);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchResources(value);
    }, 300);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigateToResult(results[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const navigateToResult = (resource: Resource) => {
    onClose();
    navigate(`/dashboard/resources/${resource.id}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Note":
        return "📝";
      case "Article":
        return "📄";
      case "Code":
        return "💻";
      case "Link":
        return "🔗";
      default:
        return "📄";
    }
  };

  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.trim()})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : part));
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="search-modal-header">
          <Search size={20} className="search-modal-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search resources..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className="search-clear" onClick={() => handleInputChange("")}>
              <X size={16} />
            </button>
          )}
          <kbd className="search-modal-kbd">ESC</kbd>
        </div>

        {/* Results */}
        <div className="search-modal-body">
          {isLoading ? (
            <div className="search-loading">
              <Loader2 size={20} className="spin" />
              <span>Searching...</span>
            </div>
          ) : query.trim().length < 2 ? (
            <div className="search-hint">
              <Search size={32} />
              <p>Type at least 2 characters to search</p>
            </div>
          ) : results.length === 0 ? (
            <div className="search-empty">
              <p>No resources found for "{query}"</p>
            </div>
          ) : (
            <ul className="search-results">
              {results.map((resource, index) => (
                <li
                  key={resource.id}
                  className={`search-result-item ${index === selectedIndex ? "selected" : ""}`}
                  onClick={() => navigateToResult(resource)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="search-result-type">{getTypeIcon(resource.type)}</span>
                  <div className="search-result-content">
                    <span className="search-result-title">{highlightMatch(resource.title)}</span>
                    <span className="search-result-meta">
                      {resource.orb?.name && <span>{resource.orb.name}</span>}
                      {resource.author?.displayName && <span>by {resource.author.displayName}</span>}
                    </span>
                  </div>
                  <ArrowRight size={14} className="search-result-arrow" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="search-modal-footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
          <span>
            <kbd>esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};
