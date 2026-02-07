import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { ResourceList } from "../components/resources/ResourceList";
import { FilterDropdown } from "../components/ui/FilterDropdown";
import { Plus, Filter, SlidersHorizontal } from "lucide-react";

export const ResourcesPage = () => {
  const { myOrbs } = useAppSelector((state) => state.orbs);

  const [filters, setFilters] = useState({
    orbId: "",
    type: "",
    difficulty: "",
    sort: "recent",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      orbId: "",
      type: "",
      difficulty: "",
      sort: "recent",
    });
  };

  const hasActiveFilters = filters.orbId || filters.type || filters.difficulty;

  // Options
  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "views", label: "Most Viewed" },
  ];

  const orbOptions = [{ value: "", label: "All Communities" }, ...myOrbs.map((orb) => ({ value: orb.id, label: orb.name }))];

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "Note", label: "📝 Note" },
    { value: "Article", label: "📄 Article" },
    { value: "Code", label: "💻 Code" },
    { value: "Link", label: "🔗 Link" },
  ];

  const difficultyOptions = [
    { value: "", label: "All Levels" },
    { value: "Beginner", label: "🟢 Beginner" },
    { value: "Intermediate", label: "🟡 Intermediate" },
    { value: "Advanced", label: "🔴 Advanced" },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Resources</h1>
          <p className="page-subtitle">Discover and share knowledge with the community</p>
        </div>
        <Link to="/dashboard/resources/new" className="btn btn-primary">
          <Plus size={20} />
          New Resource
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filters-left">
          {/* Sort */}
          <FilterDropdown value={filters.sort} options={sortOptions} onChange={(value) => handleFilterChange("sort", value)} />

          {/* Toggle Filters */}
          <button className={`btn btn-ghost filter-toggle ${showFilters ? "active" : ""}`} onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={18} />
            Filters
            {hasActiveFilters && <span className="filter-badge" />}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="filters-expanded">
          <div className="filters-grid">
            {/* Orb Filter */}
            <FilterDropdown
              label="Community"
              value={filters.orbId}
              options={orbOptions}
              onChange={(value) => handleFilterChange("orbId", value)}
              placeholder="All Communities"
            />

            {/* Type Filter */}
            <FilterDropdown
              label="Type"
              value={filters.type}
              options={typeOptions}
              onChange={(value) => handleFilterChange("type", value)}
              placeholder="All Types"
            />

            {/* Difficulty Filter */}
            <FilterDropdown
              label="Difficulty"
              value={filters.difficulty}
              options={difficultyOptions}
              onChange={(value) => handleFilterChange("difficulty", value)}
              placeholder="All Levels"
            />
          </div>

          {hasActiveFilters && (
            <button className="btn btn-ghost clear-filters" onClick={clearFilters}>
              <Filter size={14} />
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Resource List */}
      <ResourceList
        orbId={filters.orbId || undefined}
        type={filters.type || undefined}
        difficulty={filters.difficulty || undefined}
        sort={filters.sort as "recent" | "popular" | "views"}
      />
    </>
  );
};
