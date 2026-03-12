export async function getAppleMusicUrl(
  albumName: string,
  artistName: string,
): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${albumName} ${artistName}`);
    const url = `https://itunes.apple.com/search?term=${query}&entity=album&limit=5&country=us`;
    
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 7 } });
    if (!res.ok) return null;

    const json = await res.json() as {
      results?: { collectionName?: string; artistName?: string; collectionViewUrl?: string }[]
    };

    // Find closest match by name
    const match = json.results?.find((r) =>
      r.collectionName?.toLowerCase().includes(albumName.toLowerCase()) ??
      albumName.toLowerCase().includes(r.collectionName?.toLowerCase() ?? ""),
    );

    return match?.collectionViewUrl ?? null;
  } catch {
    return null;
  }
}