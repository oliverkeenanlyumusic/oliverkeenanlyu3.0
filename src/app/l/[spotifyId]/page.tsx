import { Header } from "@/app/_components/header";
import { ShareButton } from "@/app/_components/share-button";
import { env } from "@/env";
import { DSP_PRIORITY } from "@/server/lib";
import type { DspEntry } from "@/server/types";
import { api } from "@/trpc/server";
import Image from "next/image";

export default async function SmartLinkPage({
    params,
    searchParams,
}: {
    params: Promise<{ spotifyId: string }>;
    searchParams: Promise<{ type?: string; name?: string; image?: string }>;
}) {
    const { spotifyId } = await params;
    const { type, name, image } = await searchParams;

    const albumType =
        type === "single" || type === "album" || type === "compilation"
            ? type
            : "album";

    const { links, name: cachedName, imageUrl: cachedImageUrl } = await api.smartlink.smartLinks({
        spotifyId,
        albumType,
        name,
        imageUrl: image ? decodeURIComponent(image) : undefined,
    });

    const primary = DSP_PRIORITY.map((key) => ({ key, entry: links[key] })).filter(
        (p): p is { key: typeof p.key; entry: DspEntry } => !!p.entry,
    );

    const secondary = Object.entries(links).filter(
        ([key]) => !(DSP_PRIORITY as readonly string[]).includes(key),
    ) satisfies [string, DspEntry][];

    // Use DB values, fall back to URL params
    const imageUrl = cachedImageUrl ?? (image ? decodeURIComponent(image) : null);
    const releaseName = cachedName ?? (name ? decodeURIComponent(name) : null);
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">


            {/* Blurred artwork background */}
            {imageUrl && (
                <>
                    <div
                        className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat blur-2xl"
                        style={{ backgroundImage: `url('${imageUrl}')` }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </>
            )}


            <div className="relative z-10 w-full max-w-sm px-4 py-12">
                <Header />




                {/* Artwork + title */}
                {imageUrl && (
                    <div className="mb-8 flex flex-col items-center gap-4">
                        <div className="relative h-48 w-48 overflow-hidden rounded-2xl shadow-2xl">
                            <Image
                                src={imageUrl}
                                alt={releaseName ?? "Release artwork"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {releaseName && (
                            <p className="text-center text-lg font-semibold">{releaseName}</p>
                        )}
                    </div>
                )}

                <p className="mb-4 text-center text-sm text-white/50 uppercase tracking-widest">
                    Listen on
                </p>

                <div className="space-y-3">
                    {primary.map(({ key, entry }) => (
                        <a
                            key={key}
                            href={entry.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-xl bg-white/10 px-6 py-4 text-center font-medium transition-colors hover:bg-white/20"
                        >
                            {entry.displayName}
                        </a>
                    ))}

                    {secondary.length > 0 && (
                        <>
                            <div className="pb-1 pt-2 text-center text-xs uppercase tracking-widest text-white/30">
                                More platforms
                            </div>
                            {secondary.map(([key, entry]) => (
                                <a
                                    key={key}
                                    href={entry.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block rounded-xl bg-white/5 px-6 py-3 text-center text-sm transition-colors hover:bg-white/10"
                                >
                                    {entry.displayName}
                                </a>
                            ))}
                        </>
                    )}
                </div>
                <ShareButton url={`${env.NEXT_PUBLIC_BASE_URL}/l/${spotifyId}`} />

            </div>

        </main>
    );
}