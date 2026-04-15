/**
 * Example script showing how to create new pitch decks
 * Run this with: npx tsx scripts/create-pitch-deck.ts
 */

import { PitchDeckManager } from "../src/lib/pitch-deck-manager";
import { type PitchDeckData } from "../src/types/pitch-deck";

async function createExamplePitch() {
  const deckId = PitchDeckManager.generateDeckId();
  
  const newPitchDeck: PitchDeckData = {
    title: "Syncing Showcase 2024",
    subtitle: "Fresh compositions for advertising & media",
    description: "An exclusive collection of brand-new compositions specifically crafted for sync licensing. These tracks cover a range of moods and genres, from uplifting corporate pieces to intimate character moments. Each composition is designed to enhance storytelling while leaving space for dialogue and sound design.",
    backgroundImage: "/oliver-studio-1.jpg",
    tracks: [
      {
        id: "1",
        title: "Rising Optimism",
        artist: "Oliver Lyu",
        spotifyId: "REPLACE_WITH_ACTUAL_TRACK_ID",
        description: "Perfect for product launches and success stories. Builds from minimal piano to full orchestral arrangement."
      },
      {
        id: "2", 
        title: "Tech Innovation",
        artist: "Oliver Lyu",
        spotifyId: "REPLACE_WITH_ACTUAL_TRACK_ID",
        description: "Modern electronic piece ideal for tech companies and startup pitches. Clean, professional, forward-thinking."
      },
      {
        id: "3",
        title: "Heartfelt Moments",
        artist: "Oliver Lyu", 
        spotifyId: "REPLACE_WITH_ACTUAL_TRACK_ID",
        description: "Emotional piece featuring strings and piano. Perfect for family brands and touching narratives."
      }
    ],
    playlistSpotifyId: "REPLACE_WITH_ACTUAL_PLAYLIST_ID",
    playlistTitle: "2024 Sync Portfolio",
    contactInfo: {
      email: "oliver@oliverkeenanlyu.com",
      website: "https://oliverkeenanlyu.music"
    },
    customStyles: {
      accentColor: "#10B981" // Emerald green accent
    }
  };

  try {
    const success = await PitchDeckManager.createPitchDeck(deckId, newPitchDeck);
    
    if (success) {
      console.log(`✅ Created new pitch deck: ${deckId}`);
      console.log(`🔗 URL: /p/${deckId}`);
      console.log(`🔗 Full URL: ${process.env.NEXT_PUBLIC_BASE_URL}/p/${deckId}`);
    } else {
      console.log(`❌ Failed to create pitch deck (ID may already exist)`);
    }
  } catch (error) {
    console.error('Error creating pitch deck:', error);
  }
}

async function listAllPitchDecks() {
  console.log('\n📋 Current Pitch Decks:');
  console.log('=' .repeat(50));
  
  const decks = await PitchDeckManager.getAllPitchDecks();
  
  if (decks.length === 0) {
    console.log('No pitch decks found.');
    return;
  }
  
  decks.forEach(({ id, data }) => {
    console.log(`\n🎵 ${data.title}`);
    console.log(`   ID: ${id}`);
    console.log(`   URL: /p/${id}`);
    console.log(`   Tracks: ${data.tracks.length}`);
    console.log(`   Created: ${data.createdAt ? new Date(data.createdAt).toDateString() : 'Unknown'}`);
  });
}

// Example usage
async function main() {
  console.log('🎵 Pitch Deck Manager Demo\n');
  
  // List existing decks
  await listAllPitchDecks();
  
  // Uncomment to create a new demo deck
  // await createExamplePitch();
}

if (require.main === module) {
  main().catch(console.error);
}