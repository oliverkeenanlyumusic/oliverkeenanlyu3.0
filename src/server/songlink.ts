import { normalizePlatforms } from "./lib";
import { getReleaseISRC } from "./spotify";
import type { SmartLinks } from "./types";



export async function getSmartLinks(
  spotifyId: string,
  albumType: "album" | "single" | "compilation",
): Promise<SmartLinks> {
  let identifier: string;

  if (albumType === "single") {
    const isrc = await getReleaseISRC(spotifyId);
    identifier = isrc ? `isrc/${isrc}` : `https://open.spotify.com/album/${spotifyId}`;
    console.log(`[songlink] single — using ${isrc ? `ISRC:${isrc}` : "Spotify URL"}`);
  } else {
    identifier = `https://open.spotify.com/album/${spotifyId}`;
    console.log(`[songlink] album — using Spotify URL`);
  }

  // Guaranteed Spotify fallback — always present regardless of Songlink result
  const spotifyFallback: SmartLinks = {
    spotify: {
      url: `https://open.spotify.com/album/${spotifyId}`,
      displayName: "Spotify",
      isPrimary: true,
    },
  };

  const apiUrl = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(identifier)}&userCountry=US`;
  const res = await fetch(apiUrl, { next: { revalidate: 60 * 60 * 24 * 7 } });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn(`[songlink] request failed: ${res.status} — ${body}, falling back to Spotify only`);
    return spotifyFallback;
  }

  const json = (await res.json()) as {
    linksByPlatform?: Record<string, { url?: string }>;
  };

  if (!json.linksByPlatform) {
    console.warn("[songlink] response missing linksByPlatform, falling back to Spotify only");
    return spotifyFallback;
  }

  console.log(`[songlink] platforms found:`, Object.keys(json.linksByPlatform));

  // Merge: Songlink results take priority, Spotify fallback fills the gap if missing
  return {
    ...spotifyFallback,
    ...normalizePlatforms(json.linksByPlatform),
  };
}