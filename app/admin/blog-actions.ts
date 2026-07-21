"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createBlogPost,
  deleteBlogPost,
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
    redirect("/admin/blogs");
  }

  const id = formData.get("id");

  if (typeof id === "string" && id) {
    await updateBlogPost(id, input);
    revalidatePath("/admin/blogs");
    revalidatePath(`/admin/blogs/${id}`);
    redirect(`/admin/blogs/${id}`);
  }

  const blog = await createBlogPost(input);
  revalidatePath("/admin/blogs");
  redirect(`/admin/blogs/${blog.id}`);
}

export async function removeBlog(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return;
  }

  await deleteBlogPost(id);
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
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
