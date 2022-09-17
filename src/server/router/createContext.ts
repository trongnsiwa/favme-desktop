import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db/client";

export const createContext = async (opts: trpcNext.CreateNextContextOptions) => {
  const { req, res } = opts;

  return {
    req,
    res,
    prisma
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
