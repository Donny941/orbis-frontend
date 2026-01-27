// src/components/resources/TipTapEditor.tsx
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Minus, Undo, Redo, FileCode } from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export const TipTapEditor = ({ content, onChange, placeholder = "Start writing your resource...", editable = true }: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // useEditorState per rendere la toolbar reattiva
  const editorState = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isBold: e?.isActive("bold") ?? false,
      isItalic: e?.isActive("italic") ?? false,
      isStrike: e?.isActive("strike") ?? false,
      isCode: e?.isActive("code") ?? false,
      isH1: e?.isActive("heading", { level: 1 }) ?? false,
      isH2: e?.isActive("heading", { level: 2 }) ?? false,
      isH3: e?.isActive("heading", { level: 3 }) ?? false,
      isBulletList: e?.isActive("bulletList") ?? false,
      isOrderedList: e?.isActive("orderedList") ?? false,
      isBlockquote: e?.isActive("blockquote") ?? false,
      isCodeBlock: e?.isActive("codeBlock") ?? false,
      canUndo: e?.can().undo() ?? false,
      canRedo: e?.can().redo() ?? false,
    }),
  });

  if (!editor) {
    return (
      <div className="tiptap-editor tiptap-loading">
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className={`tiptap-editor ${!editable ? "readonly" : ""}`}>
      {/* Fixed Toolbar */}
      {editable && (
        <div className="editor-toolbar">
          {/* Text Formatting */}
          <div className="toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`toolbar-btn ${editorState?.isBold ? "active" : ""}`}
              title="Bold (Ctrl+B)"
            >
              <Bold size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`toolbar-btn ${editorState?.isItalic ? "active" : ""}`}
              title="Italic (Ctrl+I)"
            >
              <Italic size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`toolbar-btn ${editorState?.isStrike ? "active" : ""}`}
              title="Strikethrough"
            >
              <Strikethrough size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`toolbar-btn ${editorState?.isCode ? "active" : ""}`}
              title="Inline Code"
            >
              <Code size={18} />
            </button>
          </div>

          <div className="toolbar-divider" />

          {/* Headings */}
          <div className="toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`toolbar-btn ${editorState?.isH1 ? "active" : ""}`}
              title="Heading 1"
            >
              <Heading1 size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`toolbar-btn ${editorState?.isH2 ? "active" : ""}`}
              title="Heading 2"
            >
              <Heading2 size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`toolbar-btn ${editorState?.isH3 ? "active" : ""}`}
              title="Heading 3"
            >
              <Heading3 size={18} />
            </button>
          </div>

          <div className="toolbar-divider" />

          {/* Lists & Blocks */}
          <div className="toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`toolbar-btn ${editorState?.isBulletList ? "active" : ""}`}
              title="Bullet List"
            >
              <List size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`toolbar-btn ${editorState?.isOrderedList ? "active" : ""}`}
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`toolbar-btn ${editorState?.isBlockquote ? "active" : ""}`}
              title="Quote"
            >
              <Quote size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`toolbar-btn ${editorState?.isCodeBlock ? "active" : ""}`}
              title="Code Block"
            >
              <FileCode size={18} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="toolbar-btn" title="Horizontal Rule">
              <Minus size={18} />
            </button>
          </div>

          <div className="toolbar-divider" />

          {/* Undo/Redo */}
          <div className="toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editorState?.canUndo}
              className="toolbar-btn"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={18} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editorState?.canRedo}
              className="toolbar-btn"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
};
