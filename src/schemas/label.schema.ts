import { z } from "zod";

export const getLabelByFavoriteSchema = z.object({
  favoriteId: z.string()
});

export const deleteLabelSchema = z.object({
  id: z.string()
});
