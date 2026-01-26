import { Link } from "react-router-dom";
import { Clock, MessageCircle, Eye, Circle } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  author: string;
  authorLevel: string;
  orbName: string;
  orbColor: string;
  timeAgo: string;
  views: number;
  comments: number;
  orbPoints: number;
  isHot?: boolean;
  isNew?: boolean;
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "Complete Guide to React Hooks",
    author: "alandonati",
    authorLevel: "Scholar",
    orbName: "Programming",
    orbColor: "#6366f1",
    timeAgo: "2h ago",
    views: 234,
    comments: 12,
    orbPoints: 42,
    isHot: true,
  },
  {
    id: "2",
    title: "CSS Grid vs Flexbox: When to Use Which",
    author: "mariarossi",
    authorLevel: "Master",
    orbName: "Web Development",
    orbColor: "#8b5cf6",
    timeAgo: "5h ago",
    views: 567,
    comments: 24,
    orbPoints: 89,
    isNew: true,
  },
  {
    id: "3",
    title: "Introduction to Pandas for Data Analysis",
    author: "luigiverdi",
    authorLevel: "Expert",
    orbName: "Data Science",
    orbColor: "#ec4899",
    timeAgo: "1d ago",
    views: 145,
    comments: 8,
    orbPoints: 31,
  },
];

export const RecentResourcesCard = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recent Resources</h3>
        <Link to="/feed" className="card-link">
          View All
        </Link>
      </div>

      <div className="card-content">
        <div className="resource-list">
          {mockResources.map((resource) => (
            <div key={resource.id} className="resource-item">
              {/* Indicator */}
              <div className={`resource-indicator ${resource.isHot ? "hot" : resource.isNew ? "new" : ""}`}></div>

              {/* Content */}
              <div className="resource-main">
                <Link to={`/resources/${resource.id}`} className="resource-title">
                  {resource.title}
                </Link>
                <div className="resource-meta">
                  <div className="resource-author-badge">
                    <span className="author-initial">{resource.author.charAt(0).toUpperCase()}</span>
                    <span className="author-name">{resource.author}</span>
                  </div>
                  <span className={`level-badge-small ${resource.authorLevel.toLowerCase()}`}>{resource.authorLevel}</span>
                  <span className="orb-badge" style={{ backgroundColor: resource.orbColor }}>
                    {resource.orbName}
                  </span>
                  <span className="resource-time">
                    <Clock size={12} />
                    {resource.timeAgo}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="resource-stats">
                <div className="resource-stat">
                  <Circle size={16} />
                  <span>{resource.orbPoints}</span>
                </div>
                <div className="resource-stat">
                  <MessageCircle size={16} />
                  <span>{resource.comments}</span>
                </div>
                <div className="resource-stat">
                  <Eye size={16} />
                  <span>{resource.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
