import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchComments, clearComments } from "../../store/slices/commentSlice";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { Loader2, MessageSquare, AlertCircle } from "lucide-react";

interface CommentListProps {
  resourceId: string;
}

export const CommentList = ({ resourceId }: CommentListProps) => {
  const dispatch = useAppDispatch();
  const { comments, isLoading, error } = useAppSelector((state) => state.comments);

  useEffect(() => {
    dispatch(fetchComments(resourceId));

    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, resourceId]);

  return (
    <section className="comments-section">
      <h2 className="comments-title">
        <MessageSquare size={24} />
        Comments ({comments.length})
      </h2>

      <CommentForm resourceId={resourceId} />

      {isLoading ? (
        <div className="comments-loading">
          <Loader2 size={24} className="spin" />
          <span>Loading comments...</span>
        </div>
      ) : error ? (
        <div className="comments-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="comments-empty">
          <MessageSquare size={32} />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
};
