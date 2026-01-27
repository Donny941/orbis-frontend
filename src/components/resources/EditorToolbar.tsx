// src/components/resources/EditorToolbar.tsx
import type { Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Minus, Undo, Redo, FileCode } from "lucide-react";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

// Definito FUORI dal componente principale
const ToolbarButton = ({ onClick, isActive = false, disabled = false, children, title }: ToolbarButtonProps) => (
  <button type="button" onClick={onClick} disabled={disabled} className={`toolbar-btn ${isActive ? "active" : ""}`} title={title}>
    {children}
  </button>
);

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  return (
    <div className="editor-toolbar">
      {/* Text Formatting */}
      <div className="toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold (Ctrl+B)">
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic (Ctrl+I)">
          <Italic size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive("code")} title="Inline Code">
          <Code size={18} />
        </ToolbarButton>
      </div>

      <div className="toolbar-divider" />

      {/* Headings */}
      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </ToolbarButton>
      </div>

      <div className="toolbar-divider" />

      {/* Lists & Blocks */}
      <div className="toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet List">
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Numbered List">
          <ListOrdered size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote">
          <Quote size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} title="Code Block">
          <FileCode size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus size={18} />
        </ToolbarButton>
      </div>

      <div className="toolbar-divider" />

      {/* Undo/Redo */}
      <div className="toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Shift+Z)">
          <Redo size={18} />
        </ToolbarButton>
      </div>
    </div>
  );
};
