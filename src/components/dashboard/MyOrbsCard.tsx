import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface Orb {
  id: string;
  name: string;
  color: string;
  memberCount: number;
  resourceCount: number;
}

// Mock data - sostituirai con API call
const mockOrbs: Orb[] = [
  { id: "1", name: "Programming", color: "#6366f1", memberCount: 1200, resourceCount: 450 },
  { id: "2", name: "Web Development", color: "#8b5cf6", memberCount: 890, resourceCount: 320 },
  { id: "3", name: "Data Science", color: "#ec4899", memberCount: 654, resourceCount: 280 },
  { id: "4", name: "Design", color: "#f59e0b", memberCount: 432, resourceCount: 190 },
];

export const MyOrbsCard = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">My Orbs</h3>
        <Link to="/explore" className="card-action">
          <Plus size={16} />
          Join More
        </Link>
      </div>

      <div className="orbs-list">
        {mockOrbs.map((orb) => (
          <Link key={orb.id} to={`/orbs/${orb.id}`} className="orb-item">
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
    </div>
  );
};
