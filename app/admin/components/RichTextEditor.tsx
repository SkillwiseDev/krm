"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { uploadBlogImage } from "@/app/admin/blog-actions";

type RichTextEditorProps = {
  name: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({
  name,
  value,
  onChange,
  placeholder = "Write your blog content here...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rich-text-editor__image",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "rich-text-editor__content",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  function setLink() {
    const previousUrl = editor?.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter link URL", previousUrl ?? "https://");

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function insertImage(file: File) {
    if (!editor) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadBlogImage(formData);

      if (!result.url) {
        setUploadError(result.error ?? "Image upload failed.");
        return;
      }

      const alt =
        window.prompt("Alt text for this image (optional)", file.name) ?? "";

      editor
        .chain()
        .focus()
        .setImage({
          src: result.url,
          alt: alt.trim(),
          title: alt.trim() || undefined,
        })
        .run();
    } finally {
      setIsUploading(false);
    }
  }

  async function handleImageInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    await insertImage(file);
  }

  return (
    <div className="rich-text-editor">
      <input type="hidden" name={name} value={value} readOnly />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        onChange={handleImageInputChange}
      />

      <div className="rich-text-editor__toolbar" role="toolbar" aria-label="Formatting">
        <button
          type="button"
          className={editor.isActive("bold") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={editor.isActive("italic") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className={editor.isActive("bulletList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </button>
        <button
          type="button"
          className={editor.isActive("orderedList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered List
        </button>
        <button
          type="button"
          className={editor.isActive("blockquote") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>
        <button type="button" onClick={setLink}>
          Link
        </button>
        <button
          type="button"
          className="rich-text-editor__media-button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? "Uploading..." : "Insert Image"}
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </button>
      </div>

      {uploadError ? (
        <p className="rich-text-editor__error" role="alert">
          {uploadError}
        </p>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
}
