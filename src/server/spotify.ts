import { env } from "@/env";
import { z } from "zod";
import { OMIT_RELEASE_IDS } from "@/server/omit";

type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 10_000) return cachedToken.token;

  const basic = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) throw new Error(`Spotify token error: ${res.status}`);

  const data = (await res.json()) as SpotifyTokenResponse;
  cachedToken = { token: data.access_token, expiresAt: now + data.expires_in * 1000 };
  return cachedToken.token;
}

async function spotifyFetch(path: string, params?: Record<string, string>) {
  const token = await getAccessToken();
  const url = new URL(`https://api.spotify.com/v1/${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 * 60 }, // 1 hour
  });

  if (!res.ok) throw new Error(`Spotify API error ${res.status} for ${path}`);
  return (await res.json()) as unknown;
}

export type SpotifyRelease = {
  id: string;
  name: string;
  releaseDate: string;
  totalTracks: number;
  albumType: "album" | "single" | "compilation";
  group: "album" | "single" | "appears_on" | "compilation";
  spotifyUrl: string;
  imageUrl?: string;
};

/**
 * Minimal schemas for what you actually use
 */
const SpotifyImageSchema = z.object({
  url: z.string().url(),
});

const SpotifyExternalUrlsSchema = z.object({
  spotify: z.string().url(),
});

const ArtistAlbumItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  release_date: z.string(),
  total_tracks: z.number(),
  album_type: z.enum(["album", "single", "compilation"]),
  album_group: z.enum(["album", "single", "appears_on", "compilation"]),
  external_urls: SpotifyExternalUrlsSchema.optional(),
  images: z.array(SpotifyImageSchema).optional(),
});

const ArtistAlbumsResponseSchema = z.object({
  items: z.array(ArtistAlbumItemSchema),
});

export async function getArtistReleases(input: {
  artistId: string;
  limit: number;
  market?: string;
}) {
  const { artistId, limit, market = "GB" } = input;

  // Ask Spotify for more than you need so filtering doesn't leave you short
  const fetchLimit = Math.min(Math.max(limit * 3, 50), 50);

  const raw = await spotifyFetch(`artists/${artistId}/albums`, {
    include_groups: "album,single,appears_on,compilation",
    market,
    limit: String(fetchLimit),
  });

  const data = ArtistAlbumsResponseSchema.parse(raw);

  const dedupe = new Set<string>();
  const releases: SpotifyRelease[] = [];

  for (const it of data.items) {
    if (OMIT_RELEASE_IDS.has(it.id)) continue;

    // De-dupe by name+date+type
    const key = `${it.name}__${it.release_date}__${it.album_type}`;
    if (dedupe.has(key)) continue;
    dedupe.add(key);

    console.log("rellllleases",releases);

    releases.push({
      id: it.id,
      name: it.name,
      releaseDate: it.release_date,
      totalTracks: it.total_tracks,
      albumType: it.album_type,
      group: it.album_group,
      spotifyUrl: it.external_urls?.spotify ?? `https://open.spotify.com/album/${it.id}`,
      imageUrl: it.images?.[0]?.url,
    });
  }



  releases.sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1));
  return releases.slice(0, limit);
}

export type SpotifyAlbumDetails = {
  id: string;
  name: string;
  spotifyUrl: string;
  imageUrl?: string;
  artists: { id: string; name: string }[];
  tracks: {
    id: string;
    name: string;
    trackNumber: number;
    durationMs: string; // formatted mm:ss
    spotifyUrl: string;
  }[];
};

function formatMs(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const AlbumArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const AlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  external_urls: SpotifyExternalUrlsSchema.optional(),
  images: z.array(SpotifyImageSchema).optional(),
  artists: z.array(AlbumArtistSchema).optional(),
});

const AlbumTrackItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  track_number: z.number(),
  duration_ms: z.number(),
  external_urls: SpotifyExternalUrlsSchema.optional(),
});

const AlbumTracksSchema = z.object({
  items: z.array(AlbumTrackItemSchema),
});

export async function getAlbumDetails(input: { albumId: string; market?: string }) {
  const { albumId, market = "GB" } = input;

  const rawAlbum = await spotifyFetch(`albums/${albumId}`, { market });
  const rawTracks = await spotifyFetch(`albums/${albumId}/tracks`, {
    market,
    limit: "50",
  });

  const album = AlbumSchema.parse(rawAlbum);
  const tracks = AlbumTracksSchema.parse(rawTracks);

  return {
    id: album.id,
    name: album.name,
    spotifyUrl: album.external_urls?.spotify ?? `https://open.spotify.com/album/${album.id}`,
    imageUrl: album.images?.[0]?.url,
    artists: (album.artists ?? []).map((a) => ({ id: a.id, name: a.name })),
    tracks: tracks.items.map((t) => ({
      id: t.id,
      name: t.name,
      trackNumber: t.track_number,
      durationMs: formatMs(t.duration_ms),
      spotifyUrl: t.external_urls?.spotify ?? `https://open.spotify.com/track/${t.id}`,
    })),
  } satisfies SpotifyAlbumDetails;
}

// Add to spotify.ts
export async function getTrackISRC(trackId: string): Promise<string | null> {
  const raw = await spotifyFetch(`tracks/${trackId}`);
  const data = z.object({ 
    external_ids: z.object({ isrc: z.string() }).optional() 
  }).parse(raw);
  return data.external_ids?.isrc ?? null;
}

export async function getReleaseISRC(albumId: string): Promise<string | null> {
  try {
    const raw = await spotifyFetch(`albums/${albumId}/tracks`, { limit: "1" });
    const data = z.object({
      items: z.array(z.object({
        external_ids: z.object({ isrc: z.string() }).optional()
      }))
    }).parse(raw);
    return data.items[0]?.external_ids?.isrc ?? null;
  } catch {
    return null;
  }
}