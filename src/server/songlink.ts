import { normalizePlatforms } from "./lib";
import { getReleaseISRC } from "./spotify";
import type { SmartLinks } from "./types";



export async function getSmartLinks(
  spotifyId: string,
  albumType: "album" | "single" | "compilation",
): Promise<SmartLinks> {
  const spotifyFallback: SmartLinks = {
    spotify: {
      url: `https://open.spotify.com/album/${spotifyId}`,
      displayName: "Spotify",
      isPrimary: true,
    },
  };

  async function fetchFromSonglink(identifier: string) {
    const apiUrl = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(identifier)}&userCountry=US`;
    const res = await fetch(apiUrl, { next: { revalidate: 60 * 60 * 24 * 7 } });
    if (!res.ok) return null;
    const json = await res.json() as { linksByPlatform?: Record<string, { url?: string }> };
    if (!json.linksByPlatform) return null;
    console.log(`[songlink] ${identifier} →`, Object.keys(json.linksByPlatform));
    return normalizePlatforms(json.linksByPlatform);
  }

  // Build list of identifiers to try
  const identifiers: string[] = [];

  if (albumType === "single") {
    const isrc = await getReleaseISRC(spotifyId);
    if (isrc) identifiers.push(`isrc/${isrc}`);
  }

  // Always try Spotify URL as well
  identifiers.push(`https://open.spotify.com/album/${spotifyId}`);

  // Fetch all in parallel, merge results — more identifiers = more platform coverage
  const results = await Promise.all(identifiers.map(fetchFromSonglink));

  const merged = results.reduce<SmartLinks>((acc, result) => {
    if (!result) return acc;
    return { ...acc, ...result };
  }, spotifyFallback);

  return merged;
}