import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { env } from "@/env";
import { getAlbumDetails, getArtistReleases } from "@/server/spotify";

export const spotifyRouter = createTRPCRouter({
  releases: publicProcedure
    .input(
      z
        .object({
          artistId: z.string().optional(),
          limit: z.number().min(1).max(50).default(24),
          market: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {

      
      return getArtistReleases({
        artistId: input?.artistId ?? env.SPOTIFY_ARTIST_ID,
        limit: input?.limit ?? 24,
        market: input?.market ?? "GB",
      });
    }),

  albumDetails: publicProcedure
    .input(z.object({ albumId: z.string(), market: z.string().optional() }))
    .query(async ({ input }) => {
      return getAlbumDetails({
        albumId: input.albumId,
        market: input.market ?? "GB",
      });
    }),
});