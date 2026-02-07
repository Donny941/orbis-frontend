import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Users,
  FileText,
  Loader2,
  ArrowLeft,
  Calendar,
  Eye,
  Sparkles,
  Code,
  Palette,
  Brain,
  Database,
  Globe,
  Smartphone,
  Shield,
  Cpu,
  TrendingUp,
  BookOpen,
  Music,
  Camera,
  Gamepad2,
  FlaskConical,
  Circle,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchAllOrbs, joinOrb, leaveOrb } from "../store/slices/orbsSlice";
import { orbService } from "../../services/orbService";
import type { Resource } from "../../types";

// Mappa icone
const iconMap: Record<string, React.ElementType> = {
  Code,
  Palette,
  Brain,
  Database,
  Globe,
  Smartphone,
  Shield,
  Cpu,
  TrendingUp,
  BookOpen,
  Music,
  Camera,
  Gamepad2,
  FlaskConical,
  Sparkles,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Sparkles;
};

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Time ago
const timeAgo = (dateString?: string) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateString);
};

// Get author display name
const getAuthorName = (author?: Resource["author"]) => {
  if (!author) return "Unknown";
  return author.displayName || author.userName || "Unknown";
};

// Get author initial
const getAuthorInitial = (author?: Resource["author"]) => {
  const name = getAuthorName(author);
  return name.charAt(0).toUpperCase();
};

export const OrbDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { allOrbs, isLoading } = useAppSelector((state) => state.orbs);

  // Trova l'orb dallo store
  const orb = allOrbs.find((o) => o.id === id);

  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  // Fetch orbs se non ci sono nello store
  useEffect(() => {
    if (allOrbs.length === 0) {
      dispatch(fetchAllOrbs());
    }
  }, [dispatch, allOrbs.length]);

  // Fetch resources quando abbiamo l'orb
  useEffect(() => {
    if (id && orb) {
      fetchResources();
    }
  }, [id, orb]);

  const fetchResources = async () => {
    try {
      setIsLoadingResources(true);
      const resourcesData = await orbService.getOrbResources(id!);
      setResources(resourcesData.data || resourcesData);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    } finally {
      setIsLoadingResources(false);
    }
  };

  const handleJoinOrb = async () => {
    if (!orb) return;

    try {
      setIsJoining(true);
      if (orb.isJoined) {
        await dispatch(leaveOrb(orb.id)).unwrap();
      } else {
        await dispatch(joinOrb(orb.id)).unwrap();
      }
    } catch (err) {
      console.error("Failed to join/leave orb:", err);
    } finally {
      setIsJoining(false);
    }
  };

  // Loading
  if (isLoading || !orb) {
    return (
      <div className="orb-detail-page">
        <div className="orbs-loading">
          <Loader2 className="spinner" size={48} />
          <p>Loading orb...</p>
        </div>
      </div>
    );
  }

  const IconComponent = getIcon(orb.iconName);

  return (
    <div className="orb-detail-page" style={{ "--orb-color": orb.color } as React.CSSProperties}>
      {/* Back button */}
      <Link to="/dashboard/orbs" className="back-link">
        <ArrowLeft size={18} />
        Back to Orbs
      </Link>

      {/* Header */}
      <div className="orb-detail-header">
        <div className="orb-detail-icon" style={{ backgroundColor: orb.color }}>
          <IconComponent size={32} />
        </div>

        <div className="orb-detail-info">
          <h1>{orb.name}</h1>
          <p>{orb.description}</p>

          <div className="orb-detail-meta">
            <span>
              <Users size={16} />
              {orb.memberCount} members
            </span>
            <span>
              <FileText size={16} />
              {orb.resourceCount} resources
            </span>
            <span>
              <Calendar size={16} />
              Created {formatDate(orb.createdAt)}
            </span>
          </div>
        </div>

        <button className={`btn ${orb.isJoined ? "btn-outline" : "btn-primary"}`} onClick={handleJoinOrb} disabled={isJoining}>
          {isJoining ? <Loader2 className="spinner" size={16} /> : orb.isJoined ? "Leave Orb" : "Join Orb"}
        </button>
      </div>

      {/* Resources Section */}
      <div className="orb-detail-section">
        <div className="section-header">
          <h2>Resources</h2>
          <span className="section-count">{resources.length}</span>
        </div>

        {isLoadingResources ? (
          <div className="orbs-loading">
            <Loader2 className="spinner" size={32} />
            <p>Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="orbs-empty">
            <FileText size={48} />
            <p>No resources yet in this orb</p>
            {orb.isJoined && (
              <Link to="/dashboard/resources/new" className="btn btn-primary">
                Create First Resource
              </Link>
            )}
          </div>
        ) : (
          <div className="resource-list">
            {resources.map((resource) => (
              <Link key={resource.id} to={`/dashboard/resources/${resource.id}`} className="resource-item">
                <div className="resource-indicator"></div>

                <div className="resource-content">
                  <h3 className="resource-title">{resource.title}</h3>
                  <div className="resource-meta">
                    <div className="resource-author">
                      <div className="avatar">{getAuthorInitial(resource.author)}</div>
                      <span>{getAuthorName(resource.author)}</span>
                    </div>
                    <span>•</span>
                    <span>{timeAgo(resource.publishedAt || resource.createdAt)}</span>
                  </div>
                </div>

                <div className="resource-stats">
                  <span>
                    <Circle size={14} />
                    {resource.totalOrbsReceived || 0}
                  </span>
                  <span>
                    <Eye size={14} />
                    {resource.viewCount || 0}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
