// src/server/router/index.ts
import { Context } from "./createContext";
import superjson from "superjson";
import { router } from "@trpc/server";

export function createRouter() {
  return router<Context>().transformer(superjson);
}
