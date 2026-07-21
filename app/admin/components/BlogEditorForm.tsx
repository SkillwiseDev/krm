"use client";

import { useState } from "react";
import type { BlogPost, BlogStatus } from "@/lib/blog-store";
import RichTextEditor from "@/app/admin/components/RichTextEditor";

type BlogEditorFormProps = {
  initialBlog?: BlogPost;
  action: (formData: FormData) => void | Promise<void>;
};

export default function BlogEditorForm({
  initialBlog,
  action,
}: BlogEditorFormProps) {
  const [title, setTitle] = useState(initialBlog?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt ?? "");
  const [content, setContent] = useState(initialBlog?.content ?? "<p></p>");
  const [status, setStatus] = useState<BlogStatus>(
    initialBlog?.status ?? "draft",
  );

  return (
    <form className="admin-form admin-blog-form" action={action}>
      {initialBlog ? <input type="hidden" name="id" value={initialBlog.id} /> : null}

      <article className="admin-card">
        <h2>Blog Details</h2>
        <label>
          Title
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Blog title"
            required
          />
        </label>
        <label>
          Excerpt
          <textarea
            name="excerpt"
            rows={3}
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            placeholder="Short summary for blog list"
          />
        </label>
        <label>
          Status
          <select
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as BlogStatus)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </article>

      <article className="admin-card">
        <h2>Content</h2>
        <RichTextEditor
          name="content"
          value={content}
          onChange={setContent}
          placeholder="Write your blog post content..."
        />
      </article>

      <div className="admin-service-form__actions">
        <button type="submit">
          {initialBlog ? "Update Blog" : "Create Blog"}
        </button>
      </div>
    </form>
  );
}
