import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchResources, fetchMoreResources, toggleResourceOrb } from "../../store/slices/resourcesSlice";
import { ResourceCard } from "./ResourceCard";
import { Loader2, AlertCircle, FileX } from "lucide-react";

interface ResourceListProps {
  orbId?: string;
  type?: string;
  difficulty?: string;
  sort?: "recent" | "popular" | "views";
}

export const ResourceList = ({ orbId, type, difficulty, sort = "recent" }: ResourceListProps) => {
  const dispatch = useAppDispatch();
  const { resources, pagination, isLoading, isLoadingMore, error } = useAppSelector((state) => state.resources);

  useEffect(() => {
    dispatch(fetchResources({ orbId, type, difficulty, sort, page: 1 }));
  }, [dispatch, orbId, type, difficulty, sort]);

  const handleLoadMore = () => {
    if (!isLoadingMore && pagination.page < pagination.totalPages) {
      dispatch(fetchMoreResources());
    }
  };

  const handleOrbToggle = (resourceId: string, hasOrbed: boolean) => {
    dispatch(toggleResourceOrb({ resourceId, hasOrbed }));
  };

  if (isLoading && resources.length === 0) {
    return (
      <div className="resource-list-loading">
        <Loader2 className="spin" size={32} />
        <p>Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resource-list-error">
        <AlertCircle size={32} />
        <p>{error}</p>
        <button onClick={() => dispatch(fetchResources({ orbId, type, difficulty, sort }))}>Try Again</button>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="resource-list-empty">
        <FileX size={48} />
        <h3>No resources found</h3>
        <p>Be the first to share knowledge in this community!</p>
      </div>
    );
  }

  return (
    <div className="resource-list-grid">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} onOrbToggle={handleOrbToggle} />
      ))}

      {/* Load More */}
      {pagination.page < pagination.totalPages && (
        <div className="resource-list-footer">
          <button className="btn btn-secondary load-more-btn" onClick={handleLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? (
              <>
                <Loader2 className="spin" size={16} />
                Loading...
              </>
            ) : (
              `Load More (${pagination.totalCount - resources.length} remaining)`
            )}
          </button>
        </div>
      )}
    </div>
  );
};
