import type { DspKey, SmartLinks, SonglinkLinksByPlatform } from "./types";

export const DSP_CONFIG = {
    spotify: "Spotify",
    appleMusic: "Apple Music",
    tidal: "Tidal",
    amazonMusic: "Amazon Music",
    youtubeMusic: "YouTube Music",
    youtube: "YouTube",
    deezer: "Deezer",
    soundcloud: "SoundCloud",
    bandcamp: "Bandcamp",
    pandora: "Pandora",
    napster: "Napster",
    itunes: "iTunes",
} as const;

/** Ordered list of "primary" DSPs shown above the divider */
export const DSP_PRIORITY: ReadonlyArray<keyof typeof DSP_CONFIG> = [
    "spotify",
    "appleMusic",
    "tidal",
    "amazonMusic",
    "youtubeMusic",
];

/**
 * Converts the raw `linksByPlatform` from the Songlink API into our
 * `SmartLinks` shape.  Only platforms with a valid URL are included.
 */
export function normalizePlatforms(
    raw: SonglinkLinksByPlatform,
): SmartLinks {
    const result: SmartLinks = {};

    for (const [key, entry] of Object.entries(raw)) {
        const url = entry?.url;
        if (!url) continue;

        const isKnown = key in DSP_CONFIG;
        const displayName = isKnown
            ? DSP_CONFIG[key as DspKey]
            : prettifyKey(key);

        result[key] = {
            url,
            displayName,
            isPrimary: (DSP_PRIORITY as ReadonlyArray<string>).includes(key),
        };
    }

    return result;
}

/** Fallback pretty-printer for unknown platform keys e.g. "amazonUnlimited" → "Amazon Unlimited" */
function prettifyKey(key: string): string {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase())
        .trim();
}