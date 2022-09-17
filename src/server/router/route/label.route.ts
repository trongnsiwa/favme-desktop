import { deleteLabelSchema, getLabelByFavoriteSchema } from "src/schemas/label.schema";
import { createRouter } from "../createRouter";

export const labelRouter = createRouter()
  .query("labels", {
    resolve({ ctx }) {
      return ctx.prisma.label.findMany({
        orderBy: {
          name: "asc"
        }
      });
    }
  })
  .query("favorite-labels", {
    input: getLabelByFavoriteSchema,
    resolve({ ctx, input }) {
      return ctx.prisma.label.findMany({
        where: {
          favorites: {
            some: {
              id: input.favoriteId
            }
          }
        },
        orderBy: {
          name: "asc"
        }
      });
    }
  })
  .mutation("delete-label", {
    input: deleteLabelSchema,
    async resolve({ ctx, input }) {
      return ctx.prisma.label.delete({
        where: {
          id: input.id
        }
      });
    }
  });
