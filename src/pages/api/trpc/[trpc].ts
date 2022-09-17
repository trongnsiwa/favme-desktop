// src/pages/api/trpc/[trpc].ts
import { appRouter } from "@server/router/route/app.route";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createContext } from "../../../server/router/createContext";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext
});
