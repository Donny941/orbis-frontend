import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchFavourites } from "../store/slices/resourcesSlice";
import { ResourceCard } from "../components/resources/ResourceCard";
import { Heart, Loader2, AlertCircle } from "lucide-react";

export const FavouritesPage = () => {
  const dispatch = useAppDispatch();
  const { favourites, isLoadingFavourites, error } = useAppSelector((state) => state.resources);

  useEffect(() => {
    dispatch(fetchFavourites({}));
  }, [dispatch]);

  return (
    <div className="my-resources-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Favourites</h1>
          <p className="page-subtitle">Resources you've given an Orb to</p>
        </div>
      </div>

      {isLoadingFavourites ? (
        <div className="card-loading">
          <Loader2 size={32} className="spin" />
          <p>Loading your favourites...</p>
        </div>
      ) : error ? (
        <div className="card-error">
          <AlertCircle size={48} />
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => dispatch(fetchFavourites({}))}>
            Try Again
          </button>
        </div>
      ) : favourites.length === 0 ? (
        <div className="card-empty">
          <Heart size={64} />
          <h2>No favourites yet</h2>
          <p>Start exploring resources and give Orbs to the ones you like!</p>
          <Link to="/dashboard/resources" className="btn btn-primary">
            Browse Resources
          </Link>
        </div>
      ) : (
        <div className="resources-grid">
          {favourites.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};
