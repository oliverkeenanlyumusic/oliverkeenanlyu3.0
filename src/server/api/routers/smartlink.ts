import { db } from "@/server/db";
import { smartLinks } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getSmartLinks } from "@/server/songlink";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import type { SmartLinks } from "@/server/types";

const CACHE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const smartlinkRouter = createTRPCRouter({
  smartLinks: publicProcedure
    .input(
      z.object({
        spotifyId: z.string(),
        albumType: z.enum(["album", "single", "compilation"]).default("album"),
        name:      z.string().optional(),
        imageUrl:  z.string().optional(),
      }),
    )
   .query(async ({ input }): Promise<{ links: SmartLinks; name?: string; imageUrl?: string }> => {
  const [cached] = await db
    .select()
    .from(smartLinks)
    .where(eq(smartLinks.spotifyId, input.spotifyId))
    .limit(1);

  if (cached) {
    const age = Date.now() - new Date(cached.updatedAt).getTime();
    if (age < CACHE_MS) {
      return {
        links: cached.data as SmartLinks,
        name: cached.name ?? input.name,
        imageUrl: cached.imageUrl ?? input.imageUrl,
      };
    }

    const links = await getSmartLinks(input.spotifyId, input.albumType);
    await db.update(smartLinks)
      .set({ data: links, name: input.name, imageUrl: input.imageUrl, albumType: input.albumType, updatedAt: new Date() })
      .where(eq(smartLinks.spotifyId, input.spotifyId));
    return { links, name: input.name, imageUrl: input.imageUrl };
  }

  const links = await getSmartLinks(input.spotifyId, input.albumType);
  await db.insert(smartLinks).values({
    spotifyId: input.spotifyId,
    albumType: input.albumType,
    name: input.name,
    imageUrl: input.imageUrl,
    data: links,
  });
  return { links, name: input.name, imageUrl: input.imageUrl };
})
});