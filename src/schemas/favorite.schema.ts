import { FavoriteStatus } from "@prisma/client";
import z from "zod";

export const createFavoriteSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(5).max(300),
  slug: z
    .string()
    .min(2)
    .max(30)
    .regex(/^\/[a-z0-9-]+$/),
  cover: z.string().url(),
  category: z.string().min(1),
  link: z.string().url(),
  labels: z.array(z.string())
});

export type CreateFavoriteInput = z.TypeOf<typeof createFavoriteSchema>;

export const getFavoriteByCategorySchemma = z.object({
  searchBy: z.string().optional(),
  status: z.string().optional(),
  orderBy: z.string().optional(),
  category: z.string().min(1),
  labels: z.array(z.string()).optional().or(z.string().optional()),
  cursor: z.string().nullish(),
  limit: z.number().min(1).nullish()
});

export type GetFavoriteByCategoryInput = z.TypeOf<typeof getFavoriteByCategorySchemma>;

export const changeStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum([FavoriteStatus.UNFAVORED, FavoriteStatus.FAVORED])
});

export type ChangeStatusInput = z.TypeOf<typeof changeStatusSchema>;

export const editFavoriteSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  description: z.string().min(5).max(300),
  slug: z
    .string()
    .min(2)
    .max(30)
    .regex(/^\/[a-z0-9-]+$/),
  cover: z.string().url(),
  category: z.string().min(1),
  link: z.string().url(),
  labels: z.array(z.string().min(1).max(30))
});

export const deleteFavoriteSchema = z.object({
  id: z.string()
});

export const getLikedFavoriteSchemma = z.object({
  searchBy: z.string().optional(),
  orderBy: z.string().optional(),
  cursor: z.number().nullish(),
  limit: z.number().min(1).nullish(),
  labels: z.array(z.string()).optional().or(z.string().optional())
});

export type GetLikedFavoriteInput = z.TypeOf<typeof getLikedFavoriteSchemma>;
