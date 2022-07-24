import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { prisma } from "../../../db/client";
import { slugRegex, urlRegex } from "../../../utils/validationRules";

export const appRouter = trpc
  .router()
  .query("slugCheck", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      const count = await prisma.shortLink.count({
        where: {
          slug: input.slug,
        },
      });
      return { used: count > 0 };
    },
  })
  .mutation("createSlug", {
    input: z.object({
      slug: z.object({
        value: z.string().min(1).regex(slugRegex),
      }),
      url: z.object({
        value: z.string().regex(urlRegex),
      }),
    }),
    async resolve({ input }) {
      try {
        await prisma.shortLink.create({
          data: {
            slug: input.slug.value,
            url: input.url.value,
          },
        });
      } catch (e) {}
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
