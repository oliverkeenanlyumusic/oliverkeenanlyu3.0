import { type PitchDeckData } from "@/types/pitch-deck";

// In a real application, this would be stored in a database
// For now, we'll use a simple in-memory store that can be easily migrated
const PITCH_DECKS: Record<string, PitchDeckData> = {
  // "cinematic-demo": {
  //   title: "Cinematic Soundscapes",
  //   subtitle: "Original compositions for film & media",
  //   description: "A curated collection of atmospheric and emotional compositions perfect for film scoring, documentary work, and brand experiences. These tracks blend electronic elements with organic instrumentation to create immersive sonic landscapes that enhance storytelling and create memorable viewer experiences.",
  //   backgroundImage: "/oliver-studio-1.jpg",
  //   tracks: [
  //     {
  //       id: "1",
  //       title: "Ethereal Dawn",
  //       artist: "Oliver Lyu", 
  //       spotifyId: "4uLU6hMCjMI75M1A2tKUQC", // Replace with your actual track ID
  //       description: "An ambient opener perfect for establishing atmosphere in documentary work. Builds slowly with layered textures."
  //     },
  //     {
  //       id: "2",
  //       title: "Urban Pulse", 
  //       artist: "Oliver Lyu",
  //       spotifyId: "7qiZfU4dY4WbJe0bX3FjnK", // Replace with your actual track ID
  //       description: "Electronic-driven piece ideal for contemporary media and advertising. Features driving beats and evolving synth work."
  //     },
  //     {
  //       id: "3",
  //       title: "Reflective Moments",
  //       artist: "Oliver Lyu",
  //       spotifyId: "2tAKN1w2gCCgjYH4o9XSdm", // Replace with your actual track ID  
  //       description: "Contemplative composition featuring piano and strings, perfect for emotional scenes and character development."
  //     }
  //   ],
  //   playlistSpotifyId: "37i9dQZF1DX0XUsuxWHRQd", // Replace with your actual playlist ID
  //   playlistTitle: "Complete Syncing Portfolio",
  //   contactInfo: {
  //     email: "oliver@oliverkeenanlyu.com",
  //     website: "https://oliverkeenanlyu.music"
  //   },
  //   isActive: true,
  //   createdAt: new Date().toISOString()
  // },

  // "electronic-ambient": {
  //   title: "Electronic Ambient Collection",
  //   subtitle: "Atmospheric electronic compositions",
  //   description: "A selection of electronic ambient pieces designed for modern media, tech presentations, and brand storytelling. These compositions feature lush synthesizer work, subtle rhythmic elements, and evolving textures that create space for dialogue while maintaining emotional engagement.",
  //   backgroundImage: "/oliver-studio-1.jpg",
  //   tracks: [
  //     {
  //       id: "1",
  //       title: "Digital Horizons",
  //       artist: "Oliver Lyu",
  //       spotifyId: "5Z7wP8vOkOl9hFjF2E4m1B", // Replace with actual ID
  //       description: "Perfect for tech presentations and futuristic narratives. Clean, modern production."
  //     },
  //     {
  //       id: "2", 
  //       title: "Neon Nights",
  //       artist: "Oliver Lyu",
  //       spotifyId: "1A2B3C4D5E6F7G8H9I0J1K", // Replace with actual ID
  //       description: "Urban electronic piece with subtle noir influences. Ideal for night scenes and cityscapes."
  //     },
  //     {
  //       id: "3",
  //       title: "Weightless",
  //       artist: "Oliver Lyu", 
  //       spotifyId: "9K8J7H6G5F4E3D2C1B0A9Z", // Replace with actual ID
  //       description: "Floating ambient textures perfect for relaxation, meditation, or contemplative moments."
  //     }
  //   ],
  //   playlistSpotifyId: "5K9J8H7G6F5E4D3C2B1A0P", // Replace with actual playlist ID
  //   playlistTitle: "Electronic Ambient Portfolio",
  //   contactInfo: {
  //     email: "oliver@oliverkeenanlyu.com",
  //     website: "https://oliverkeenanlyu.music",
  //     phone: "+44 (0) 7XXX XXXXXX" // Add your actual number if desired
  //   },
  //   customStyles: {
  //     accentColor: "#00D4FF" // Cyan accent for electronic theme
  //   },
  //   isActive: true,
  //   createdAt: new Date().toISOString()
  // }
};

export class PitchDeckManager {
  /**
   * Get a pitch deck by ID
   */
  static async getPitchDeck(deckId: string): Promise<PitchDeckData | null> {
    // Add a small delay to simulate database lookup
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const deck = PITCH_DECKS[deckId];
    return deck && deck.isActive !== false ? deck : null;
  }

  /**
   * Get all active pitch decks
   */
  static async getAllPitchDecks(): Promise<Array<{ id: string; data: PitchDeckData }>> {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    return Object.entries(PITCH_DECKS)
      .filter(([_, deck]) => deck.isActive !== false)
      .map(([id, data]) => ({ id, data }));
  }

  /**
   * Create a new pitch deck
   */
  static async createPitchDeck(deckId: string, data: PitchDeckData): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (PITCH_DECKS[deckId]) {
      return false; // Deck already exists
    }
    
    PITCH_DECKS[deckId] = {
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    return true;
  }

  /**
   * Update an existing pitch deck
   */
  static async updatePitchDeck(deckId: string, data: Partial<PitchDeckData>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (!PITCH_DECKS[deckId]) {
      return false;
    }
    
    PITCH_DECKS[deckId] = {
      ...PITCH_DECKS[deckId],
      ...data,
      lastModified: new Date().toISOString()
    };
    
    return true;
  }

  /**
   * Deactivate a pitch deck (soft delete)
   */
  static async deactivatePitchDeck(deckId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (!PITCH_DECKS[deckId]) {
      return false;
    }
    
    PITCH_DECKS[deckId].isActive = false;
    PITCH_DECKS[deckId].lastModified = new Date().toISOString();
    
    return true;
  }

  /**
   * Generate a random deck ID for new pitch decks
   */
  static generateDeckId(): string {
    const words = [
      "ambient", "cinematic", "electronic", "orchestral", "minimal",
      "urban", "ethereal", "atmospheric", "dreamy", "pulsing",
      "reflective", "soaring", "intimate", "expansive", "flowing"
    ];
    
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    const number = Math.floor(Math.random() * 1000);
    
    return `${word1}-${word2}-${number}`.toLowerCase();
  }
}