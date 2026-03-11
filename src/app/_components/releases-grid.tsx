"use client";

import * as React from "react";
import Image from "next/image";
import type { RouterOutputs } from "@/trpc/react";

type Release = RouterOutputs["spotify"]["releases"][number];

export function ReleasesGrid({ releases }: { releases: Release[] }) {
    const featured = releases[0];
    const rest = releases.slice(1);

    if (!featured) return null;

    return (
        <>
            {/* Mobile: 2-col flat grid */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
                {releases.map((r, i) => (
                    <ReleaseCard key={r.id} release={r} featured={i === 0} />
                ))}
            </div>

            {/* md: 3-col flat grid */}
            <div className="hidden md:grid lg:hidden grid-cols-3 gap-3">
                {releases.map((r, i) => (
                    <ReleaseCard key={r.id} release={r} featured={i === 0} />
                ))}
            </div>

            {/* lg+: featured left, rest right */}
            <div className="hidden lg:grid gap-8 lg:grid-cols-[1.1fr_1.9fr]">
                <ReleaseCard release={featured} featured />
                <div className="grid gap-3 grid-cols-3 content-start">
                    {rest.map((r) => (
                        <ReleaseCard key={r.id} release={r} />
                    ))}
                </div>
            </div>
        </>
    );
}

function ReleaseCard({ release, featured = false }: { release: Release; featured?: boolean }) {
    const albumLinkUrl = `/l/${release.id}?type=${release.albumType}&image=${encodeURIComponent(release.imageUrl ?? "")}&name=${encodeURIComponent(release.name)}`;

    return (
        <a
            href={albumLinkUrl}
            target="_blank"
            rel="noreferrer"
            className={[
                "group relative block text-left",
                featured ? "w-full" : "",
            ].join(" ")}
        >
            {/* Artwork */}
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-white/5">
                {release.imageUrl ? (
                    <Image
                        src={release.imageUrl}
                        alt={release.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-75"
                        sizes={featured ? "(min-width: 768px) 420px, 100vw" : "(min-width: 1024px) 220px, 50vw"}
                    />
                ) : null}

                {/* Listen overlay — all cards */}
                <div className="pointer-events-none absolute inset-0 flex items-end justify-start p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-xs font-medium tracking-widest uppercase text-white/90">
                        Listen →
                    </span>
                </div>

                {/* Latest release badge — on image, top left */}
                {featured && (
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-sm bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-black">
                            Latest
                        </span>
                    </div>
                )}
            </div>

            {/* Text */}
            <div className="mt-2.5 px-0.5">
                <div className={[
                    "font-medium leading-snug",
                    featured ? "text-base line-clamp-2" : "text-sm line-clamp-1",
                ].join(" ")}>
                    <span title={release.name}>{release.name}</span>
                </div>
                <div className="mt-0.5 text-xs text-white/40 uppercase tracking-wider">
                    {release.albumType} · {release.releaseDate.slice(0, 4)}
                </div>
            </div>
        </a>
    );
}