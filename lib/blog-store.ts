import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import {
  deleteBlogMongo,
  getBlogByIdMongo,
  getBlogBySlugMongo,
  getBlogsMongo,
  insertBlogMongo,
  updateBlogMongo,
} from "@/lib/blogs-db";
import { isMongoConfigured } from "@/lib/mongodb";

const STORE_PATH = path.join(process.cwd(), "data", "admin-store.json");

export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
};

export type BlogInput = {
  title: string;
  excerpt: string;
  content: string;
  status: BlogStatus;
};

type AdminStore = {
  blogs?: BlogPost[];
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createId(): string {
  return crypto.randomUUID();
}

async function readBlogsFromStore(): Promise<BlogPost[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const store = JSON.parse(raw) as AdminStore;
    return store.blogs ?? [];
  } catch {
    return [];
  }
}

async function writeBlogsToStore(blogs: BlogPost[]): Promise<void> {
  let store: Record<string, unknown> = {};

  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    store = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    store = {
      serviceCategories: [],
      services: [],
      formSubmissions: [],
    };
  }

  store.blogs = blogs;
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function normalizeBlogPost(
  blog: Partial<BlogPost> & Pick<BlogPost, "id" | "title" | "slug" | "createdAt">,
): BlogPost {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt ?? "",
    content: blog.content ?? "",
    status: blog.status ?? "draft",
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt ?? blog.createdAt,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isMongoConfigured()) {
    const blogs = await getBlogsMongo();
    return blogs
      .map((blog) => normalizeBlogPost(blog))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  const blogs = await readBlogsFromStore();
  return blogs
    .map((blog) => normalizeBlogPost(blog))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const blogs = await getBlogPosts();
  return blogs.filter((blog) => blog.status === "published");
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isMongoConfigured()) {
    const blog = await getBlogBySlugMongo(slug);
    return blog ? normalizeBlogPost(blog) : null;
  }

  const blogs = await readBlogsFromStore();
  const blog = blogs.find((item) => item.slug === slug);
  return blog ? normalizeBlogPost(blog) : null;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  if (isMongoConfigured()) {
    const blog = await getBlogByIdMongo(id);
    return blog ? normalizeBlogPost(blog) : null;
  }

  const blogs = await readBlogsFromStore();
  const blog = blogs.find((item) => item.id === id);
  return blog ? normalizeBlogPost(blog) : null;
}

export async function createBlogPost(input: BlogInput): Promise<BlogPost> {
  const now = new Date().toISOString();
  const blog: BlogPost = {
    id: createId(),
    title: input.title.trim(),
    slug: slugify(input.title),
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    status: input.status,
    createdAt: now,
    updatedAt: now,
  };

  if (isMongoConfigured()) {
    await insertBlogMongo(blog);
  }

  const blogs = await readBlogsFromStore();
  blogs.unshift(blog);
  await writeBlogsToStore(blogs);
  return blog;
}

export async function updateBlogPost(
  id: string,
  input: BlogInput,
): Promise<BlogPost | null> {
  const existing = await getBlogPostById(id);

  if (!existing) {
    return null;
  }

  const blog: BlogPost = {
    ...existing,
    title: input.title.trim(),
    slug: slugify(input.title),
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    status: input.status,
    updatedAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    await updateBlogMongo(blog);
  }

  const blogs = await readBlogsFromStore();
  const index = blogs.findIndex((item) => item.id === id);

  if (index >= 0) {
    blogs[index] = blog;
    await writeBlogsToStore(blogs);
  }

  return blog;
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (isMongoConfigured()) {
    await deleteBlogMongo(id);
  }

  const blogs = await readBlogsFromStore();
  await writeBlogsToStore(blogs.filter((blog) => blog.id !== id));
}
