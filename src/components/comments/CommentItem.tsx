import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteComment, toggleCommentOrb } from "../../store/slices/commentSlice";
import { OrbButton } from "../resources/OrbButton";
import { Trash2, Loader2 } from "lucide-react";
import type { Comment } from "../../../types";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteComment(comment.id)).unwrap();
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setIsDeleting(false);
    }
  };

  const handleOrbToggle = () => {
    dispatch(
      toggleCommentOrb({
        commentId: comment.id,
        hasOrbed: comment.hasUserOrbed || false,
      }),
    );
  };

  const formatDate = (dateString: string) => {
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

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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

  const isAuthor = user?.id === comment.author?.id;

  return (
    <div className="comment-item">
      <div className="comment-avatar">
        {comment.author?.profilePicture ? (
          <img src={comment.author.profilePicture} alt={comment.author.displayName} />
        ) : (
          <div className="avatar-placeholder">{getInitials(comment.author?.displayName || comment.author?.username)}</div>
        )}
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.author?.displayName || comment.author?.username || "Unknown"}</span>
          <span className="comment-level">Lv.{comment.author?.level || 1}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>

        <p className="comment-text">{comment.content}</p>

        <div className="comment-actions">
          <OrbButton count={comment.orbsReceived || 0} hasOrbed={comment.hasUserOrbed || false} onToggle={handleOrbToggle} disabled={isAuthor} size="sm" />

          {isAuthor && (
            <button className="btn btn-ghost btn-sm btn-danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
