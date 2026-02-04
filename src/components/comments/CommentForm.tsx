// src/components/comments/CommentForm.tsx
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createComment } from "../../store/slices/commentSlice";
import { Send, Loader2 } from "lucide-react";

interface CommentFormProps {
  resourceId: string;
}

export const CommentForm = ({ resourceId }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const dispatch = useAppDispatch();

  const { isSubmitting } = useAppSelector((state) => state.comments);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting) return;

    try {
      await dispatch(createComment({ resourceId, content: content.trim() })).unwrap();
      setContent("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="comment-form-login">
        <p>
          Please <a href="/login">log in</a> to leave a comment.
        </p>
      </div>
    );
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        maxLength={1000}
        disabled={isSubmitting}
        className="comment-input"
      />
      <div className="comment-form-footer">
        <span className="char-count">{content.length}/1000</span>
        <button type="submit" className="btn btn-primary" disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="spin" />
              Posting...
            </>
          ) : (
            <>
              <Send size={16} />
              Post Comment
            </>
          )}
        </button>
      </div>
    </form>
  );
};
