"use client";

import Image from "next/image";
import { ShareButton } from "./share-button";
import { type PitchDeckProps } from "@/types/pitch-deck";

export function PitchDeck({
  title,
  subtitle,
  description,
  backgroundImage,
  logoUrl,
  tracks,
  playlistSpotifyId,
  playlistTitle,
  contactInfo,
  customStyles,
  deckId,
  shareUrl,
}: PitchDeckProps) {
  const accentColor = customStyles?.accentColor ?? "white";
  
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      {backgroundImage ? (
        <>
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat blur-2xl"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
          <div className="absolute inset-0 bg-black/70" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        {/* Header Section */}
        <div className="mb-16 text-center">
          {logoUrl && (
            <div className="mb-8 flex justify-center">
              <div className="relative h-16 w-32 overflow-hidden rounded-lg bg-white/10 p-2">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
          
          <h1 className="mb-4 text-4xl md:text-6xl font-bold leading-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="mb-6 text-xl md:text-2xl text-white/80 font-light">
              {subtitle}
            </p>
          )}
          
          <div className="mx-auto max-w-2xl">
            <p className="text-lg text-white/70 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Featured Tracks Section */}
        {tracks.length > 0 && (
          <div className="mb-16">
            <div className="mb-8 flex items-center items-baseline gap-4">
              <h2 className="text-sm uppercase tracking-widest text-white/60">
                Featured Tracks
              </h2>
              <div className="h-px flex-1 bg-white/40" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {tracks.slice(0, 3).map((track) => (
                <div key={track.id} className="group">
                  <div className="mb-4 overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    {/* Spotify Embed */}
                    <div className="aspect-[4/5]">
                      <iframe
                        src={`https://open.spotify.com/embed/track/${track.spotifyId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="px-1">
                    <h3 className="mb-1 font-semibold text-white group-hover:text-white/80 transition-colors">
                      {track.title}
                    </h3>
                    <p className="mb-2 text-sm text-white/60">
                      {track.artist}
                    </p>
                    {track.description && (
                      <p className="text-xs text-white/40 leading-relaxed">
                        {track.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Playlist Section */}
        {playlistSpotifyId && (
          <div className="mb-16">
            <div className="mb-8 flex items-center items-baseline gap-4">
              <h2 className="text-sm uppercase tracking-widest text-white/60">
                {playlistTitle ?? "Complete Playlist"}
              </h2>
              <div className="h-px flex-1 bg-white/40" />
            </div>

            <div className="mx-auto max-w-lg">
              <div className="overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-1">
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${playlistSpotifyId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {contactInfo && (
          <div className="mb-12">
            <div className="mb-8 flex items-center items-baseline gap-4">
              <h2 className="text-sm uppercase tracking-widest text-white/60">
                Contact
              </h2>
              <div className="h-px flex-1 bg-white/40" />
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-center">
              {contactInfo.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="group block rounded-xl bg-white/5 px-6 py-6 transition-all hover:bg-white/10 hover:scale-[1.02]"
                >
                  <div className="mb-2 text-xs uppercase tracking-widest text-white/40">
                    Email
                  </div>
                  <div className="text-sm font-medium group-hover:text-white/80">
                    {contactInfo.email}
                  </div>
                </a>
              )}
              
              {contactInfo.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="group block rounded-xl bg-white/5 px-6 py-6 transition-all hover:bg-white/10 hover:scale-[1.02]"
                >
                  <div className="mb-2 text-xs uppercase tracking-widest text-white/40">
                    Phone
                  </div>
                  <div className="text-sm font-medium group-hover:text-white/80">
                    {contactInfo.phone}
                  </div>
                </a>
              )}
              
              {contactInfo.website && (
                <a
                  href={contactInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-xl bg-white/5 px-6 py-6 transition-all hover:bg-white/10 hover:scale-[1.02]"
                >
                  <div className="mb-2 text-xs uppercase tracking-widest text-white/40">
                    Website
                  </div>
                  <div className="text-sm font-medium group-hover:text-white/80">
                    {contactInfo.website.replace(/^https?:\/\//, '')}
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mx-auto max-w-sm">
          <div className="mb-4 text-center">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Share This Pitch
            </p>
          </div>
          <ShareButton url={shareUrl} />
        </div>
      </div>
    </main>
  );
}