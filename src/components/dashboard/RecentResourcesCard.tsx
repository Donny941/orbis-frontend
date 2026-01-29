import { Link } from "react-router-dom";
import { Clock, MessageCircle, Eye, Circle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { resourceService } from "../../../services/resourceService";
import type { Resource } from "../../../types";

export const RecentResourcesCard = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const data = await resourceService.getRecentFromMyOrbs(10);
        setResources(data);
      } catch (err) {
        setError("Failed to load resources");
        console.error("Error fetching resources:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const getTimeAgo = (date?: string) => {
    if (!date) return "Unknown";
    const now = new Date();
    const past = new Date(date);
    if (isNaN(past.getTime())) return "Unknown";

    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return "just now";
  };

  const getAuthorName = (author?: Resource["author"]) => {
    if (!author) return "Unknown";
    return author.displayName || author.userName || "Unknown";
  };

  const getAuthorInitial = (author?: Resource["author"]) => {
    return getAuthorName(author).charAt(0).toUpperCase();
  };

  const isHot = (resource: Resource) => {
    return (resource.totalOrbsReceived || 0) > 50 && (resource.viewCount || 0) > 200;
  };

  const isNew = (resource: Resource) => {
    const dateStr = resource.publishedAt || resource.createdAt;
    if (!dateStr) return false;
    const hoursSincePublished = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
    return hoursSincePublished < 24;
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Resources</h3>
        </div>
        <div className="card-loading">
          <Loader2 size={24} className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Resources</h3>
        </div>
        <div className="card-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recent Resources</h3>
        <Link to="/dashboard/resources" className="card-link">
          View All
        </Link>
      </div>

      {resources.length === 0 ? (
        <div className="card-empty">
          <p>No resources yet. Start exploring orbs!</p>
          <Link to="/dashboard/orbs" className="btn btn-primary btn-sm">
            Explore Orbs
          </Link>
        </div>
      ) : (
        <div className="card-content">
          <div className="resource-list">
            {resources.map((resource) => (
              <div key={resource.id} className="resource-item">
                {/* Indicator */}
                <div className={`resource-indicator ${isHot(resource) ? "hot" : isNew(resource) ? "new" : ""}`}></div>

                {/* Content */}
                <div className="resource-main">
                  <Link to={`/dashboard/resources/${resource.id}`} className="resource-title">
                    {resource.title}
                  </Link>
                  <div className="resource-meta">
                    <div className="resource-author-badge">
                      <span className="author-initial">{getAuthorInitial(resource.author)}</span>
                      <span className="author-name">{getAuthorName(resource.author)}</span>
                    </div>
                    <span className={`level-badge-small level-${resource.author?.level || 1}`}>Level {resource.author?.level || 1}</span>
                    {resource.orb && (
                      <span className="orb-badge" style={{ backgroundColor: resource.orb.color }}>
                        {resource.orb.name}
                      </span>
                    )}
                    <span className="resource-time">
                      <Clock size={12} />
                      {getTimeAgo(resource.publishedAt || resource.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="resource-stats">
                  <div className="resource-stat">
                    <Circle size={16} />
                    <span>{resource.totalOrbsReceived || 0}</span>
                  </div>
                  <div className="resource-stat">
                    <MessageCircle size={16} />
                    <span>0</span>
                  </div>
                  <div className="resource-stat">
                    <Eye size={16} />
                    <span>{resource.viewCount || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
