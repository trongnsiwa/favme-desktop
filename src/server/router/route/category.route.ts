import { Category } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import {
  createCategorySchema,
  deleteCategorySchema,
  editCategorySchema,
  getCategoriesSchema
} from "src/schemas/category.schema";
import { createRouter } from "../createRouter";

export const categoryRouter = createRouter()
  .mutation("create-category", {
    input: createCategorySchema,
    async resolve({ ctx, input }) {
      try {
        const category: Category = await ctx.prisma.category.create({
          data: {
            ...input
          }
        });

        return category;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "Category already exists"
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
  .query("categories", {
    input: getCategoriesSchema,
    resolve({ ctx, input }) {
      return ctx.prisma.category.findMany({
        where: {
          name: {
            contains: input.searchBy ?? undefined,
            mode: "insensitive"
          }
        },
        orderBy: {
          name: "asc"
        }
      });
    }
  })
  .mutation("edit-category", {
    input: editCategorySchema,
    async resolve({ ctx, input }) {
      try {
        const category = await ctx.prisma.category.update({
          where: {
            id: input.id
          },
          data: {
            name: input.name,
            description: input.description,
            slug: input.slug,
            cover: input.cover,
            color: input.color
          }
        });

        return category;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "Category already exists"
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
  .mutation("delete-category", {
    input: deleteCategorySchema,
    async resolve({ ctx, input }) {
      const category = await ctx.prisma.category.delete({
        where: {
          id: input.id
        }
      });

      return category;
    }
  });
