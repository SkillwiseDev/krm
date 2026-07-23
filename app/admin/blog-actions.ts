"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirectWithToast } from "@/lib/admin-toast";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPostById,
  updateBlogPost,
  type BlogInput,
  type BlogStatus,
} from "@/lib/blog-store";
import { uploadAdminImage, type AdminImageUploadResult } from "@/lib/admin-image-upload";

export type BlogImageUploadResult = AdminImageUploadResult;

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

function parseBlogInput(formData: FormData): BlogInput | null {
  const title = formData.get("title");
  const excerpt = formData.get("excerpt");
  const content = formData.get("content");
  const status = formData.get("status");

  if (typeof title !== "string" || !title.trim()) {
    return null;
  }

  const normalizedStatus: BlogStatus =
    status === "published" ? "published" : "draft";

  return {
    title,
    excerpt: typeof excerpt === "string" ? excerpt : "",
    content: typeof content === "string" ? content : "",
    status: normalizedStatus,
  };
}

export async function saveBlog(formData: FormData): Promise<void> {
  await requireAdmin();

  const input = parseBlogInput(formData);

  if (!input) {
    redirectWithToast("/admin/blogs", "Blog title is required.", "error");
  }

  const id = formData.get("id");

  if (typeof id === "string" && id) {
    const blog = await updateBlogPost(id, input);
    revalidatePath("/admin/blogs");
    revalidatePath(`/admin/blogs/${id}`);
    revalidatePath("/blogs");
    if (blog) {
      revalidatePath(`/blogs/${blog.slug}`);
    }
    redirectWithToast(`/admin/blogs/${id}`, "Blog updated.");
  }

  const blog = await createBlogPost(input);
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  if (blog.status === "published") {
    revalidatePath(`/blogs/${blog.slug}`);
  }
  redirectWithToast(`/admin/blogs/${blog.id}`, "Blog created.");
}

export async function removeBlog(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    redirectWithToast("/admin/blogs", "Blog could not be deleted.", "error");
  }

  const existing = await getBlogPostById(id);
  await deleteBlogPost(id);
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  if (existing) {
    revalidatePath(`/blogs/${existing.slug}`);
  }
  redirectWithToast("/admin/blogs", "Blog deleted.");
}

export async function uploadBlogImage(
  formData: FormData,
): Promise<BlogImageUploadResult> {
  if (!(await isAdminAuthenticated())) {
    return { error: "You must be signed in to upload images." };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "Please choose an image file." };
  }

  return uploadAdminImage(file, "krm/blogs");
}
