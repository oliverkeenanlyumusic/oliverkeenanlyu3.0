import { notFound } from "next/navigation";
import { PitchDeck } from "@/app/_components/pitch-deck";
import { env } from "@/env";
import { PitchDeckManager } from "@/lib/pitch-deck-manager";
import type { Metadata } from "next";

// Prevent SEO indexing for privacy
export async function generateMetadata({
  params,
}: {
  params: Promise<{ deckId: string }>;
}): Promise<Metadata> {
  const { deckId } = await params;
  const deck = await PitchDeckManager.getPitchDeck(deckId);
  
  if (!deck) {
    return {
      title: "Pitch Not Found",
      robots: { index: false, follow: false }
    };
  }

  return {
    title: `${deck.title} - Private Pitch`,
    description: deck.subtitle ?? deck.description,
    robots: { 
      index: false, 
      follow: false, 
      noarchive: true, 
      nosnippet: true,
      nocache: true 
    },
    // Prevent social sharing previews for extra privacy
    openGraph: {
      title: "Private Music Pitch",
      description: "This is a private music library presentation."
    },
    twitter: {
      title: "Private Music Pitch", 
      description: "This is a private music library presentation."
    }
  };
}

export default async function PitchDeckPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { deckId } = await params;
  const deck = await PitchDeckManager.getPitchDeck(deckId);

  if (!deck) {
    notFound();
  }

  const shareUrl = `${env.NEXT_PUBLIC_BASE_URL}/p/${deckId}`;

  return (
    <PitchDeck
      {...deck}
      deckId={deckId}
      shareUrl={shareUrl}
    />
  );
}