// src/pages/ResourcesPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { ResourceList } from "../components/resources/ResourceList";
import { Plus, Filter, SlidersHorizontal } from "lucide-react";

export const ResourcesPage = () => {
  const { myOrbs } = useAppSelector((state) => state.orbs);

  const [filters, setFilters] = useState({
    orbId: "",
    type: "",
    difficulty: "",
    sort: "recent" as "recent" | "popular" | "views",
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
          <select value={filters.sort} onChange={(e) => handleFilterChange("sort", e.target.value)} className="form-control filter-select">
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="views">Most Viewed</option>
          </select>

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
            <div className="filter-group">
              <label>Community</label>
              <select value={filters.orbId} onChange={(e) => handleFilterChange("orbId", e.target.value)} className="form-control">
                <option value="">All Communities</option>
                {myOrbs.map((orb) => (
                  <option key={orb.id} value={orb.id}>
                    {orb.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="filter-group">
              <label>Type</label>
              <select value={filters.type} onChange={(e) => handleFilterChange("type", e.target.value)} className="form-control">
                <option value="">All Types</option>
                <option value="Note">Note</option>
                <option value="Article">Article</option>
                <option value="Code">Code</option>
                <option value="Link">Link</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="filter-group">
              <label>Difficulty</label>
              <select value={filters.difficulty} onChange={(e) => handleFilterChange("difficulty", e.target.value)} className="form-control">
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
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
      <ResourceList orbId={filters.orbId || undefined} type={filters.type || undefined} difficulty={filters.difficulty || undefined} sort={filters.sort} />
    </>
  );
};
