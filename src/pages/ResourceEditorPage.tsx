import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createResource, updateResource, fetchResource, clearCurrentResource } from "../store/slices/resourcesSlice";
import { fetchAllOrbs } from "../store/slices/orbsSlice";
import { TipTapEditor } from "../components/resources/TipTapEditor";
import { FilterDropdown } from "../components/ui/FilterDropdown";
import { ArrowLeft, Save, Send, Loader2, X } from "lucide-react";
import { VoiceDictation } from "../components/resources/VoiceDictation";

type ResourceType = "Note" | "Article" | "Code" | "Link";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export const ResourceEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEditing = !!id;

  const { currentResource, isLoading, error } = useAppSelector((state) => state.resources);
  const { allOrbs, myOrbs } = useAppSelector((state) => state.orbs);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<ResourceType>("Note");
  const [orbId, setOrbId] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Ref per accedere all'editor TipTap e inserire testo senza resettare il cursore
  const editorRef = useRef<{ appendText: (text: string) => void } | null>(null);

  // Fetch orbs on mount
  useEffect(() => {
    if (allOrbs.length === 0) {
      dispatch(fetchAllOrbs());
    }
  }, [dispatch, allOrbs.length]);

  // Fetch resource if editing
  useEffect(() => {
    if (id) {
      dispatch(fetchResource(id));
    }
    return () => {
      dispatch(clearCurrentResource());
    };
  }, [dispatch, id]);

  // Populate form when editing
  useEffect(() => {
    if (currentResource && isEditing) {
      setTitle(currentResource.title);
      setContent(currentResource.content || "");
      setType(currentResource.type as ResourceType);
      setOrbId(currentResource.orb?.id || "");
      setDifficulty((currentResource.difficulty as Difficulty) || "");

      const parsedTags =
        typeof currentResource.tags === "string"
          ? currentResource.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : currentResource.tags || [];
      setTags(parsedTags);
    }
  }, [currentResource, isEditing]);

  // Set default orb
  useEffect(() => {
    if (!orbId && myOrbs.length > 0) {
      setOrbId(myOrbs[0].id);
    }
  }, [myOrbs, orbId]);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async (status: "Draft" | "Published") => {
    if (!title.trim() || !content.trim() || !orbId) {
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        title: title.trim(),
        content,
        type,
        orbId,
        difficulty: difficulty || undefined,
        tags,
        status,
      };

      if (isEditing && id) {
        await dispatch(updateResource({ id, data })).unwrap();
      } else {
        await dispatch(createResource(data)).unwrap();
      }

      navigate("/dashboard/resources");
    } catch {
      // Error handled by Redux
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = title.trim() && content.trim() && orbId;

  // Get available orbs (only joined orbs)
  const availableOrbs = myOrbs.length > 0 ? myOrbs : allOrbs;

  // Dropdown options
  const orbOptions = [{ value: "", label: "Select an Orb..." }, ...availableOrbs.map((orb) => ({ value: orb.id, label: orb.name }))];

  const typeOptions = [
    { value: "Note", label: "📝 Note" },
    { value: "Article", label: "📄 Article" },
    { value: "Code", label: "💻 Code" },
    { value: "Link", label: "🔗 Link" },
  ];

  const difficultyOptions = [
    { value: "", label: "None" },
    { value: "Beginner", label: "🟢 Beginner" },
    { value: "Intermediate", label: "🟡 Intermediate" },
    { value: "Advanced", label: "🔴 Advanced" },
  ];

  // Dettatura vocale: inserisce il testo finale nell'editor
  const handleContentDictation = useCallback((text: string) => {
    if (editorRef.current) {
      // Se abbiamo accesso diretto all'editor, usiamo appendText
      editorRef.current.appendText(text);
    } else {
      // Fallback: aggiorna lo state content (funziona se TipTap sincronizza dall'esterno)
      setContent((prev) => {
        if (!prev || prev === "<p></p>") return `<p>${text}</p>`;
        // Inserisci il testo prima del tag di chiusura dell'ultimo paragrafo
        const lastPClose = prev.lastIndexOf("</p>");
        if (lastPClose !== -1) {
          return prev.slice(0, lastPClose) + text + prev.slice(lastPClose);
        }
        return prev + `<p>${text}</p>`;
      });
    }
  }, []);

  return (
    <div className="resource-editor-page">
      {/* Header */}
      <div className="editor-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>{isEditing ? "Edit Resource" : "Create Resource"}</h1>
        <div className="editor-actions">
          <button className="btn btn-secondary" onClick={() => handleSave("Draft")} disabled={!isValid || isSaving}>
            {isSaving ? <Loader2 className="spin" size={16} /> : <Save size={16} />}
            Save Draft
          </button>
          <button className="btn btn-primary" onClick={() => handleSave("Published")} disabled={!isValid || isSaving}>
            {isSaving ? <Loader2 className="spin" size={16} /> : <Send size={16} />}
            Publish
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Form */}
      <div className="card">
        <div className="editor-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title..."
              maxLength={200}
              className="form-control"
            />
            <span className="char-count">{title.length}/200</span>
          </div>

          {/* Meta Row */}
          <div className="editor-meta-row">
            {/* Orb Select */}
            <FilterDropdown label="Community *" value={orbId} options={orbOptions} onChange={(value) => setOrbId(value)} placeholder="Select an Orb..." />

            {/* Type Select */}
            <FilterDropdown label="Type *" value={type} options={typeOptions} onChange={(value) => setType(value as ResourceType)} />

            {/* Difficulty Select */}
            <FilterDropdown
              label="Difficulty"
              value={difficulty}
              options={difficultyOptions}
              onChange={(value) => setDifficulty(value as Difficulty | "")}
              placeholder="None"
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>Tags (max 5)</label>
            <div className="tags-input-wrapper">
              <div className="tags-list">
                {tags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {tags.length < 5 && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={handleAddTag}
                  placeholder="Add a tag..."
                  className="tag-input"
                />
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="form-group form-group-editor">
            <div className="editor-label-row">
              <label>Content *</label>
              <VoiceDictation onTranscript={handleContentDictation} />
            </div>
            <TipTapEditor
              content={content}
              onChange={setContent}
              placeholder="Share your knowledge... You can use markdown formatting."
              editorRef={editorRef}
            />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="editor-loading-overlay">
          <Loader2 className="spin" size={32} />
        </div>
      )}
    </div>
  );
};
