import type { BlogPost } from "@/lib/blog-store";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";

const COLLECTION = "blogs";

type BlogDocument = BlogPost & { _id?: string };

export async function getBlogsMongo(): Promise<BlogPost[]> {
  if (!isMongoConfigured()) {
    return [];
  }

  const db = await getMongoDb();
  const documents = await db
    .collection<BlogDocument>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return documents.map(({ _id, ...blog }) => blog);
}

export async function getBlogByIdMongo(id: string): Promise<BlogPost | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const db = await getMongoDb();
  const document = await db.collection<BlogDocument>(COLLECTION).findOne({ id });

  if (!document) {
    return null;
  }

  const { _id, ...blog } = document;
  return blog;
}

export async function insertBlogMongo(blog: BlogPost): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db.collection<BlogDocument>(COLLECTION).insertOne(blog);
}

export async function updateBlogMongo(blog: BlogPost): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db
    .collection<BlogDocument>(COLLECTION)
    .replaceOne({ id: blog.id }, blog, { upsert: true });
}

export async function deleteBlogMongo(id: string): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db.collection<BlogDocument>(COLLECTION).deleteOne({ id });
}
