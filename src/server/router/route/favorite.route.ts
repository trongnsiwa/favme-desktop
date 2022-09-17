import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  changeStatusSchema,
  createFavoriteSchema,
  deleteFavoriteSchema,
  editFavoriteSchema,
  getFavoriteByCategorySchemma,
  getLikedFavoriteSchemma
} from "./../../../schemas/favorite.schema";
import { createRouter } from "../createRouter";
import * as trpc from "@trpc/server";
import { FavoriteStatus } from "@prisma/client";
export const favoriteRouter = createRouter()
  .mutation("create-favorite", {
    input: createFavoriteSchema,
    async resolve({ ctx, input }) {
      try {
        const favorite = await ctx.prisma.favorite.create({
          data: {
            ...input,
            category: {
              connect: {
                id: input.category
              }
            },
            labels: {
              connectOrCreate: input.labels.map((label) => ({
                where: {
                  name: label
                },
                create: {
                  name: label
                }
              }))
            }
          }
        });

        return favorite;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "Favorite already exists"
            });
          }
        }

        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong"
        });
      }
    }
  })
  .query("get-favorites", {
    input: getFavoriteByCategorySchemma,
    async resolve({ ctx, input }) {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const favorites = await ctx.prisma.favorite.findMany({
        where: {
          category: {
            slug: input.category
          },
          status:
            input.status && input.status.length > 0 ? (input.status as FavoriteStatus) : undefined,
          name: input.searchBy
            ? {
                contains: input.searchBy,
                mode: "insensitive"
              }
            : undefined,
          labels: input.labels
            ? {
                some: {
                  name: {
                    in: input.labels
                  }
                }
              }
            : undefined
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          category: true,
          labels: true
        },
        orderBy: input.orderBy
          ? {
              status: input.orderBy?.startsWith("status")
                ? (input.orderBy.split("_")[1] as "asc" | "desc")
                : undefined,
              name: input.orderBy?.startsWith("name")
                ? (input.orderBy.split("_")[1] as "asc" | "desc")
                : undefined,
              createdAt: input.orderBy?.startsWith("createdAt")
                ? (input.orderBy.split("_")[1] as "asc" | "desc")
                : undefined
            }
          : {
              createdAt: "desc"
            }
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (favorites.length > limit) {
        const nextItem = favorites.pop();
        nextCursor = nextItem!.id;
      }
      return {
        favorites,
        nextCursor
      };
    }
  })
  .mutation("change-status", {
    input: changeStatusSchema,
    async resolve({ ctx, input }) {
      const favorite = await ctx.prisma.favorite.update({
        where: {
          id: input.id
        },
        data: {
          status: input.status
        }
      });

      return favorite;
    }
  })
  .mutation("edit-favorite", {
    input: editFavoriteSchema,
    async resolve({ ctx, input }) {
      try {
        const favorite = await ctx.prisma.favorite.update({
          where: {
            id: input.id
          },
          data: {
            name: input.name,
            description: input.description,
            slug: input.slug,
            cover: input.cover,
            link: input.link,
            category: {
              connect: {
                id: input.category
              }
            },
            labels: {
              connectOrCreate: input.labels.map((label) => ({
                where: {
                  name: label
                },
                create: {
                  name: label
                }
              }))
            }
          }
        });

        return favorite;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "Favorite already exists"
            });
          }
        }

        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong"
        });
      }
    }
  })
  .mutation("delete-favorite", {
    input: deleteFavoriteSchema,
    async resolve({ ctx, input }) {
      const favorite = await ctx.prisma.favorite.delete({
        where: {
          id: input.id
        }
      });

      return favorite;
    }
  })
  .query("get-liked-favorites", {
    input: getLikedFavoriteSchemma,
    async resolve({ ctx, input }) {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const favorites = await ctx.prisma.favorite.findMany({
        where: {
          status: FavoriteStatus.FAVORED,
          name: input.searchBy
            ? {
                contains: input.searchBy,
                mode: "insensitive"
              }
            : undefined,
          labels: input.labels
            ? {
                some: {
                  name: {
                    in: input.labels
                  }
                }
              }
            : undefined
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor.toString() } : undefined,
        include: {
          category: true,
          labels: true
        },
        orderBy: input.orderBy
          ? {
              name: input.orderBy?.startsWith("name")
                ? (input.orderBy.split("_")[1] as "asc" | "desc")
                : undefined,
              createdAt: input.orderBy?.startsWith("createdAt")
                ? (input.orderBy.split("_")[1] as "asc" | "desc")
                : undefined
            }
          : {
              createdAt: "desc"
            }
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (favorites.length > limit) {
        const nextItem = favorites.pop();
        nextCursor = parseInt(nextItem!.id as string, 10);
      }
      return {
        favorites,
        nextCursor
      };
    }
  });
