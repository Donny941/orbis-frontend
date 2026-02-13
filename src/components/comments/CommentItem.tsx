import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteComment, toggleCommentOrb } from "../../store/slices/commentSlice";
import { OrbButton } from "../resources/OrbButton";
import { Trash2, Loader2 } from "lucide-react";
import type { Comment } from "../../../types";
import { orbisToast } from "../../services/orbisToast";
import { ConfirmModal } from "../ui/ConfirmModal";
import { timeAgo, getInitials, getAvatarUrl } from "../../utils/helpers";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useAppDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteComment(comment.id)).unwrap();
      orbisToast.success("Comment deleted");
    } catch {
      orbisToast.error("Failed to delete comment");
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
    if (!comment.hasUserOrbed) {
      orbisToast.orb("Orb given!");
    }
  };

  const isAuthor = user?.id === comment.author?.id;

  return (
    <div className="comment-item">
      <div className="comment-avatar">
        {comment.author?.profilePicture ? (
          <img src={getAvatarUrl(comment.author.profilePicture)!} alt={comment.author.displayName} />
        ) : (
          <div className="avatar-placeholder">{getInitials(comment.author?.displayName || comment.author?.username)}</div>
        )}
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.author?.displayName || comment.author?.username || "Unknown"}</span>
          <span className="comment-level">Lv.{comment.author?.level || 1}</span>
          <span className="comment-date">{timeAgo(comment.createdAt)}</span>
        </div>

        <p className="comment-text">{comment.content}</p>

        <div className="comment-actions">
          <OrbButton count={comment.orbsReceived || 0} hasOrbed={comment.hasUserOrbed || false} onToggle={handleOrbToggle} disabled={isAuthor} size="sm" />

          {isAuthor && (
            <button className="comment-delete-btn" onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting}>
              {isDeleting ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />}
            </button>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
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
