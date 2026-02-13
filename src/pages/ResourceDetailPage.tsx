import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchResource, clearCurrentResource, toggleResourceOrb, deleteResource, publishResource } from "../store/slices/resourcesSlice";
import { TipTapEditor } from "../components/resources/TipTapEditor";
import { OrbButton } from "../components/resources/OrbButton";
import { CommentList } from "../components/comments/CommentList";
import { ArrowLeft, Edit, Trash2, Send, Eye, Clock, Loader2, AlertCircle } from "lucide-react";
import { orbisToast } from "../services/orbisToast";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { formatDateFull, getInitials, parseTags } from "../utils/helpers";

export const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { currentResource: resource, isLoading, error } = useAppSelector((state) => state.resources);

  useEffect(() => {
    if (id) {
      dispatch(fetchResource(id));
    }
    return () => {
      dispatch(clearCurrentResource());
    };
  }, [dispatch, id]);

  const handleOrbToggle = () => {
    if (resource) {
      dispatch(toggleResourceOrb({ resourceId: resource.id, hasOrbed: resource.hasUserOrbed || false }));
      if (!resource.hasUserOrbed) {
        orbisToast.orb("Orb given!");
      }
    }
  };

  const handleDelete = async () => {
    if (resource) {
      await dispatch(deleteResource(resource.id));
      orbisToast.success("Resource deleted");
      navigate("/dashboard/resources");
    }
  };
  const handlePublish = async () => {
    if (resource && resource.status === "Draft") {
      await dispatch(publishResource(resource.id));
      orbisToast.success("Resource published!");
    }
  };

  if (isLoading) {
    return (
      <div className="resource-detail-loading">
        <Loader2 className="spin" size={32} />
        <p>Loading resource...</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="resource-detail-error">
        <AlertCircle size={48} />
        <h2>Resource not found</h2>
        <p>{error || "The resource you're looking for doesn't exist or has been deleted."}</p>
        <Link to="/dashboard/resources" className="btn btn-primary">
          Back to Resources
        </Link>
      </div>
    );
  }

  const tagsArray = parseTags(resource.tags);

  return (
    <div className="resource-detail-page">
      {/* Header */}
      <div className="resource-detail-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>

        {resource.isAuthor && (
          <div className="author-actions">
            {resource.status === "Draft" && (
              <button className="btn btn-primary" onClick={handlePublish}>
                <Send size={16} />
                Publish
              </button>
            )}
            <Link to={`/dashboard/resources/${resource.id}/edit`} className="btn btn-secondary">
              <Edit size={16} />
              Edit
            </Link>
            <button className="btn btn-ghost btn-danger" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="resource-detail-layout">
        {/* Left: Content */}
        <article className="resource-detail-content">
          {/* Meta */}
          <div className="resource-detail-meta">
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
            <span className="resource-type">{resource.type}</span>
            {resource.difficulty && <span className={`resource-difficulty difficulty-${resource.difficulty.toLowerCase()}`}>{resource.difficulty}</span>}
            {resource.status === "Draft" && <span className="draft-badge">Draft</span>}
          </div>

          {/* Title */}
          <h1 className="resource-detail-title">{resource.title}</h1>

          {/* Author Info */}
          {resource.author && (
            <Link
              to={resource.isAuthor ? "/dashboard/profile" : `/dashboard/users/${resource.author.id}`}
              className="resource-detail-author"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="author-avatar" style={{ backgroundColor: resource.orb?.color || "#8b5cf6" }}>
                {resource.author.profilePicture ? (
                  <img src={resource.author.profilePicture} alt={resource.author.displayName} />
                ) : (
                  getInitials(resource.author.displayName || resource.author.userName)
                )}
              </div>
              <div className="author-info">
                <span className="author-name">{resource.author.displayName || resource.author.userName}</span>
                <div className="resource-date">
                  <Clock size={14} />
                  {formatDateFull(resource.publishedAt || resource.createdAt)}
                  <span className="separator">·</span>
                  <Eye size={14} />
                  {resource.viewCount || 0} views
                </div>
              </div>
            </Link>
          )}

          {/* Tags */}
          {tagsArray.length > 0 && (
            <div className="resource-detail-tags">
              {tagsArray.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="resource-detail-body">
            <TipTapEditor content={resource.content || ""} onChange={() => {}} editable={false} />
          </div>

          {/* Actions */}
          <div className="resource-detail-actions">
            <OrbButton
              count={resource.totalOrbsReceived || 0}
              hasOrbed={resource.hasUserOrbed || false}
              onToggle={handleOrbToggle}
              disabled={resource.isAuthor}
              size="lg"
            />
          </div>
        </article>

        {/* Right: Comments Sidebar */}
        {resource.status === "Published" && (
          <aside className="resource-detail-sidebar">
            <CommentList resourceId={resource.id} />
          </aside>
        )}
      </div>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Resource"
        message={`Are you sure you want to delete "${resource?.title}"?`}
        confirmText="Delete"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          handleDelete();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
