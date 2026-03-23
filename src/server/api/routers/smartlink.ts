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
        forceRefresh: z.boolean().default(false),
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
    if (age < CACHE_MS && !input.forceRefresh) {
      return {
        links: cached.data as SmartLinks,
        name: cached.name ?? input.name,
        imageUrl: cached.imageUrl ?? input.imageUrl,
      };
    }

    // Fetch fresh data
    const freshLinks = await getSmartLinks(input.spotifyId, input.albumType);
    
    let finalLinks: SmartLinks;
    
    if (input.forceRefresh) {
      // Complete replacement of cache
      finalLinks = freshLinks;
      console.log(`[force-refresh] ${input.spotifyId}: replacing with fresh platforms:`, Object.keys(freshLinks));
    } else {
      // Merge fresh data with existing cached data
      const existingLinks = cached.data as SmartLinks;
      const mergedLinks: SmartLinks = { ...existingLinks };
      
      // Log what we're working with
      console.log(`[cache-refresh] ${input.spotifyId}: existing platforms:`, Object.keys(existingLinks));
      console.log(`[cache-refresh] ${input.spotifyId}: fresh platforms:`, Object.keys(freshLinks));
      
      // Check if fresh data seems incomplete (possible rate limiting)
      const freshPlatformCount = Object.keys(freshLinks).length;
      const existingPlatformCount = Object.keys(existingLinks).length;
      
      if (freshPlatformCount <= 2 && existingPlatformCount > freshPlatformCount) {
        console.warn(`[cache-refresh] ⚠️  Fresh data has only ${freshPlatformCount} platforms vs ${existingPlatformCount} existing - possible rate limiting. Being conservative with merge.`);
        
        // Only update platforms that we're confident about (Spotify always, Apple Music if returned)
        for (const [platform, linkData] of Object.entries(freshLinks)) {
          if (platform === 'spotify' || platform === 'appleMusic') {
            mergedLinks[platform] = linkData;
            console.log(`[cache-refresh] Updated ${platform} link`);
          }
        }
      } else {
        // Normal merge - update/add all fresh platforms
        for (const [platform, linkData] of Object.entries(freshLinks)) {
          mergedLinks[platform] = linkData;
        }
      }
      
      console.log(`[cache-refresh] ${input.spotifyId}: merged platforms:`, Object.keys(mergedLinks));
      finalLinks = mergedLinks;
    }

    await db.update(smartLinks)
      .set({ data: finalLinks, name: input.name, imageUrl: input.imageUrl, albumType: input.albumType, updatedAt: new Date() })
      .where(eq(smartLinks.spotifyId, input.spotifyId));
    return { links: finalLinks, name: input.name, imageUrl: input.imageUrl };
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