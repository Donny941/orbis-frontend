import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { orbService } from "../../../services/orbService";
import type { Orb } from "../../../types";

export const MyOrbsCard = () => {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyOrbs = async () => {
      try {
        setIsLoading(true);
        const data = await orbService.getMyOrbs();
        setOrbs(data);
      } catch (err) {
        setError("Failed to load orbs");
        console.error("Error fetching orbs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrbs();
  }, []);

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">My Orbs</h3>
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
          <h3 className="card-title">My Orbs</h3>
        </div>
        <div className="card-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">My Orbs</h3>
        <Link to="/explore" className="card-link">
          <Plus size={16} />
          Join More
        </Link>
      </div>

      {orbs.length === 0 ? (
        <div className="card-empty">
          <p>You haven't joined any orbs yet.</p>
          <Link to="/explore" className="btn btn-primary btn-sm">
            Explore Orbs
          </Link>
        </div>
      ) : (
        <div className="orbs-list">
          {orbs.map((orb) => (
            <Link key={orb.id} to={`/dashboard/orbs/${orb.id}`} className="orb-item">
              <div className="orb-color" style={{ background: orb.color }}></div>
              <div className="orb-content">
                <div className="orb-name">{orb.name}</div>
                <div className="orb-stats">
                  {orb.memberCount} members · {orb.resourceCount} resources
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
