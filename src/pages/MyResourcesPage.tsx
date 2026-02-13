import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMyResources, publishResource, deleteResource } from "../store/slices/resourcesSlice";
import { Plus, FileText, BookOpen, Code, Link as LinkIcon, Eye, Clock, Edit, Globe, Lock, Loader2, Trash2 } from "lucide-react";
import { orbisToast } from "../../services/orbisToast";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { formatDateFriendly, parseTags } from "../utils/helpers";

type FilterStatus = "all" | "Published" | "Draft";

export const MyResourcesPage = () => {
  const dispatch = useAppDispatch();
  const { myResources, isLoadingMine, error } = useAppSelector((state) => state.resources);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyResources());
  }, [dispatch]);

  const handleToggleStatus = async (resourceId: string, currentStatus: string) => {
    if (currentStatus === "Draft") {
      setActionLoading(resourceId);
      try {
        await dispatch(publishResource(resourceId)).unwrap();
        orbisToast.success("Resource published!");
      } catch (err) {
        orbisToast.error("Failed to publish");
        console.error("Failed to publish:", err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleDelete = async (resourceId: string) => {
    setActionLoading(resourceId);
    try {
      await dispatch(deleteResource(resourceId)).unwrap();
      orbisToast.success("Resource deleted");
    } catch {
      orbisToast.error("Failed to delete");
    } finally {
      setActionLoading(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Note":
        return <FileText size={16} />;
      case "Article":
        return <BookOpen size={16} />;
      case "Code":
        return <Code size={16} />;
      case "Link":
        return <LinkIcon size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  // Filter resources
  const filteredResources = myResources.filter((resource) => {
    if (filterStatus === "all") return true;
    return resource.status === filterStatus;
  });

  // Stats
  const publishedCount = myResources.filter((r) => r.status === "Published").length;
  const draftCount = myResources.filter((r) => r.status === "Draft").length;

  if (isLoadingMine && myResources.length === 0) {
    return (
      <div className="my-resources-page">
        <div className="page-loading">
          <Loader2 className="spin" size={32} />
          <p>Loading your resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-resources-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Resources</h1>
          <p className="page-subtitle">Manage your published resources and drafts</p>
        </div>
        <Link to="/dashboard/resources/new" className="btn btn-primary">
          <Plus size={18} />
          Create Resource
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon published">
            <Globe size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{publishedCount}</span>
            <span className="stat-label">Published</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon draft">
            <Lock size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{draftCount}</span>
            <span className="stat-label">Drafts</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon views">
            <Eye size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{myResources.reduce((sum, r) => sum + (r.viewCount || 0), 0)}</span>
            <span className="stat-label">Total Views</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button className={`filter-tab ${filterStatus === "all" ? "active" : ""}`} onClick={() => setFilterStatus("all")}>
          All ({myResources.length})
        </button>
        <button className={`filter-tab ${filterStatus === "Published" ? "active" : ""}`} onClick={() => setFilterStatus("Published")}>
          <Globe size={14} />
          Published ({publishedCount})
        </button>
        <button className={`filter-tab ${filterStatus === "Draft" ? "active" : ""}`} onClick={() => setFilterStatus("Draft")}>
          <Lock size={14} />
          Drafts ({draftCount})
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Resources List */}
      {filteredResources.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h3>{filterStatus === "all" ? "No resources yet" : filterStatus === "Published" ? "No published resources" : "No drafts"}</h3>
          <p>
            {filterStatus === "all"
              ? "Create your first resource to share knowledge with the community"
              : filterStatus === "Published"
                ? "Publish a draft to make it visible to others"
                : "All your resources are published!"}
          </p>
          {filterStatus === "all" && (
            <Link to="/dashboard/resources/new" className="btn btn-primary">
              <Plus size={18} />
              Create Resource
            </Link>
          )}
        </div>
      ) : (
        <div className="resources-table">
          <div className="table-header">
            <div className="col-title">Resource</div>
            <div className="col-status">Status</div>
            <div className="col-stats">Stats</div>

            <div className="col-actions">Actions</div>
          </div>

          {filteredResources.map((resource) => {
            const tagsArray = parseTags(resource.tags);
            const isActionLoading = actionLoading === resource.id;

            return (
              <div key={resource.id} className="table-row">
                {/* Title & Meta */}
                <div className="col-title">
                  <div className="resource-info">
                    <div className="resource-type-icon">{getTypeIcon(resource.type)}</div>
                    <div className="resource-details">
                      <Link to={`/dashboard/resources/${resource.id}`} className="resource-title">
                        {resource.title}
                      </Link>
                      <div className="resource-meta">
                        {resource.orb && (
                          <span className="orb-tag" style={{ color: resource.orb.color }}>
                            {resource.orb.name}
                          </span>
                        )}
                        {tagsArray.slice(0, 2).map((tag) => (
                          <span key={tag} className="meta-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="col-status">
                  {resource.status === "Draft" ? (
                    <button
                      className="status-toggle draft"
                      onClick={() => handleToggleStatus(resource.id, resource.status)}
                      disabled={isActionLoading}
                      title="Click to publish"
                    >
                      {isActionLoading ? <Loader2 className="spin" size={14} /> : <Lock size={14} />}
                      Draft
                    </button>
                  ) : (
                    <span className="status-badge published">
                      <Globe size={14} />
                      Published
                    </span>
                  )}
                </div>

                {/* Date */}
                <div className="col-date">
                  <Clock size={14} />
                  {formatDateFriendly(resource.updatedAt)}
                </div>

                {/* Actions */}
                <div className="col-actions">
                  <Link to={`/dashboard/resources/${resource.id}/edit`} className="action-btn" title="Edit">
                    <Edit size={16} />
                  </Link>
                  <button onClick={() => setDeleteTarget({ id: resource.id, title: resource.title })} className="action-btn danger" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Delete"
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
