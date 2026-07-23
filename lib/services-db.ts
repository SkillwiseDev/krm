import type { Service, ServiceCategory } from "@/lib/admin-store";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";

const CATEGORIES_COLLECTION = "service_categories";
const SERVICES_COLLECTION = "services";

type ServiceCategoryDocument = ServiceCategory & { _id?: string };
type ServiceDocument = Service & { _id?: string };

export async function getServiceCategoriesMongo(): Promise<ServiceCategory[]> {
  if (!isMongoConfigured()) {
    return [];
  }

  const db = await getMongoDb();
  const documents = await db
    .collection<ServiceCategoryDocument>(CATEGORIES_COLLECTION)
    .find({})
    .sort({ name: 1 })
    .toArray();

  return documents.map(({ _id, ...category }) => category);
}

export async function insertServiceCategoryMongo(
  category: ServiceCategory,
): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db
    .collection<ServiceCategoryDocument>(CATEGORIES_COLLECTION)
    .insertOne(category);
}

export async function deleteServiceCategoryMongo(id: string): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db
    .collection<ServiceCategoryDocument>(CATEGORIES_COLLECTION)
    .deleteOne({ id });
}

export async function getServicesMongo(): Promise<Service[]> {
  if (!isMongoConfigured()) {
    return [];
  }

  const db = await getMongoDb();
  const documents = await db
    .collection<ServiceDocument>(SERVICES_COLLECTION)
    .find({})
    .sort({ title: 1 })
    .toArray();

  return documents.map(({ _id, ...service }) => service);
}

export async function getServiceCategoryMongo(
  id: string,
): Promise<ServiceCategory | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const db = await getMongoDb();
  const document = await db
    .collection<ServiceCategoryDocument>(CATEGORIES_COLLECTION)
    .findOne({ id });

  if (!document) {
    return null;
  }

  const { _id, ...category } = document;
  return category;
}

export async function insertServiceMongo(service: Service): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db.collection<ServiceDocument>(SERVICES_COLLECTION).insertOne(service);
}

export async function deleteServiceMongo(id: string): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db.collection<ServiceDocument>(SERVICES_COLLECTION).deleteOne({ id });
}

export async function getServicesByCategoryMongo(
  categoryId: string,
): Promise<Service[]> {
  if (!isMongoConfigured()) {
    return [];
  }

  const db = await getMongoDb();
  const documents = await db
    .collection<ServiceDocument>(SERVICES_COLLECTION)
    .find({ categoryId })
    .sort({ title: 1 })
    .toArray();

  return documents.map(({ _id, ...service }) => service);
}

export async function getServiceCategoryBySlugMongo(
  slug: string,
): Promise<ServiceCategory | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const db = await getMongoDb();
  const document = await db
    .collection<ServiceCategoryDocument>(CATEGORIES_COLLECTION)
    .findOne({ slug });

  if (!document) {
    return null;
  }

  const { _id, ...category } = document;
  return category;
}

export async function updateServiceCategoryMongo(
  category: ServiceCategory,
): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db
    .collection<ServiceCategoryDocument>(CATEGORIES_COLLECTION)
    .replaceOne({ id: category.id }, category, { upsert: true });
}

export async function getServiceByIdMongo(id: string): Promise<Service | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const db = await getMongoDb();
  const document = await db
    .collection<ServiceDocument>(SERVICES_COLLECTION)
    .findOne({ id });

  if (!document) {
    return null;
  }

  const { _id, ...service } = document;
  return service;
}

export async function getServiceBySlugMongo(
  slug: string,
): Promise<Service | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const db = await getMongoDb();
  const document = await db
    .collection<ServiceDocument>(SERVICES_COLLECTION)
    .findOne({ slug });

  if (!document) {
    return null;
  }

  const { _id, ...service } = document;
  return service;
}

export async function updateServiceMongo(service: Service): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db
    .collection<ServiceDocument>(SERVICES_COLLECTION)
    .replaceOne({ id: service.id }, service, { upsert: true });
}

export async function deleteServicesByCategoryMongo(
  categoryId: string,
): Promise<void> {
  if (!isMongoConfigured()) {
    return;
  }

  const db = await getMongoDb();
  await db
    .collection<ServiceDocument>(SERVICES_COLLECTION)
    .deleteMany({ categoryId });
}
