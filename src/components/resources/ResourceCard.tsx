// src/components/resources/ResourceCard.tsx
import { Link } from "react-router-dom";
import { Eye, MessageCircle, Clock, FileText, BookOpen, Code, Link as LinkIcon } from "lucide-react";
import { OrbButton } from "./OrbButton";
import type { Resource } from "../../../types";

interface ResourceCardProps {
  resource: Resource;
  onOrbToggle?: (resourceId: string, hasOrbed: boolean) => void;
}

// Helper per parsare tags (stringa o array)
const parseTags = (tags: string | string[] | undefined | null): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string" && tags.trim()) {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

export const ResourceCard = ({ resource, onOrbToggle }: ResourceCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Note":
        return <FileText size={14} />;
      case "Article":
        return <BookOpen size={14} />;
      case "Code":
        return <Code size={14} />;
      case "Link":
        return <LinkIcon size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const getDifficultyClass = (difficulty?: string) => {
    switch (difficulty) {
      case "Beginner":
        return "difficulty-beginner";
      case "Intermediate":
        return "difficulty-intermediate";
      case "Advanced":
        return "difficulty-advanced";
      default:
        return "";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Parse tags
  const tagsArray = parseTags(resource.tags);

  return (
    <article className="resource-card">
      {/* Header */}
      <div className="resource-card-header">
        <div className="resource-meta-left">
          {resource.orb && (
            <Link
              to={`/dashboard/orbs/${resource.orb.id}`}
              className="orb-badge"
              style={{
                backgroundColor: `${resource.orb.color}20`,
                color: resource.orb.color,
              }}
            >
              {resource.orb.name}
            </Link>
          )}
          <span className="resource-type">
            {getTypeIcon(resource.type)}
            {resource.type}
          </span>
          {resource.difficulty && <span className={`resource-difficulty ${getDifficultyClass(resource.difficulty)}`}>{resource.difficulty}</span>}
        </div>
        {resource.status === "Draft" && <span className="draft-badge">Draft</span>}
      </div>

      {/* Title */}
      <Link to={`/dashboard/resources/${resource.id}`} className="resource-title-link">
        <h3 className="resource-title">{resource.title}</h3>
      </Link>

      {/* Tags */}
      {tagsArray.length > 0 && (
        <div className="resource-tags">
          {tagsArray.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
          {tagsArray.length > 4 && <span className="tag tag-more">+{tagsArray.length - 4}</span>}
        </div>
      )}

      {/* Footer */}
      <div className="resource-card-footer">
        <div className="resource-author">
          <div className="author-avatar" style={{ backgroundColor: resource.orb?.color || "#8b5cf6" }}>
            {resource.author?.profilePicture ? (
              <img src={resource.author.profilePicture} alt={resource.author.displayName} />
            ) : (
              getInitials(resource.author?.displayName || resource.author?.userName)
            )}
          </div>
          <div className="author-info">
            <span className="author-name">{resource.author?.displayName || resource.author?.userName || "Unknown"}</span>
            <span className="resource-date">
              <Clock size={12} />
              {formatDate(resource.publishedAt || resource.createdAt)}
            </span>
          </div>
        </div>

        <div className="resource-stats">
          <span className="stat">
            <Eye size={14} />
            {resource.viewCount || 0}
          </span>
          <span className="stat">
            <MessageCircle size={14} />
            {0} {/* TODO: commentCount */}
          </span>
          <OrbButton
            count={resource.totalOrbsReceived || 0}
            hasOrbed={resource.hasUserOrbed || false}
            onToggle={() => onOrbToggle?.(resource.id, resource.hasUserOrbed || false)}
            disabled={resource.isAuthor}
            size="sm"
          />
        </div>
      </div>
    </article>
  );
};
