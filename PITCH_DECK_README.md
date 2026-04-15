# Pitch Deck Template System

This system allows you to create private, unindexed pitch deck pages for sharing music libraries with clients. 

## Features

- **Private Links**: All pitch deck URLs (`/p/[deckId]`) are excluded from SEO indexing
- **Spotify Embeds**: Embed individual tracks and playlists directly from Spotify  
- **Modern Design**: Follows your existing design system with dark theme and blur effects
- **Responsive**: Optimized for both desktop and mobile viewing
- **Share Functionality**: Built-in sharing with copy-to-clipboard functionality

## Usage

### Viewing Existing Pitch Decks

- **Cinematic Demo**: `/p/cinematic-demo`
- **Electronic Ambient**: `/p/electronic-ambient`

### Creating a New Pitch Deck

1. **Update the data** in `/src/lib/pitch-deck-manager.ts`
2. **Add a new entry** to the `PITCH_DECKS` object
3. **Replace the Spotify IDs** with your actual track and playlist IDs

### Example Pitch Deck Creation

```typescript
// Add this to PITCH_DECKS in pitch-deck-manager.ts
"my-new-pitch": {
  title: "My Music Library",
  subtitle: "Perfect for your next project",
  description: "Description of the music collection...",
  backgroundImage: "/your-background.jpg", // Optional
  tracks: [
    {
      id: "1",
      title: "Track Name",
      artist: "Your Name",
      spotifyId: "ACTUAL_SPOTIFY_TRACK_ID", // Get from Spotify
      description: "Why this track works for the project"
    }
    // Add 2-3 tracks total
  ],
  playlistSpotifyId: "ACTUAL_SPOTIFY_PLAYLIST_ID",
  playlistTitle: "Complete Collection",
  contactInfo: {
    email: "your@email.com",
    website: "https://yoursite.com"
  }
}
```

### Finding Spotify IDs

**For Tracks:**
1. Go to Spotify Web Player
2. Right-click on a track → "Copy link"
3. Extract the ID from: `https://open.spotify.com/track/[TRACK_ID]?...`

**For Playlists:**
1. Go to your playlist in Spotify Web Player
2. Click Share → Copy link
3. Extract the ID from: `https://open.spotify.com/playlist/[PLAYLIST_ID]?...`

### Custom Styling

Add custom colors and styles via the `customStyles` property:

```typescript
customStyles: {
  accentColor: "#FF0080", // Custom accent color
  textColor: "#FFFFFF"    // Custom text color
}
```

## Security & Privacy

- All `/p/*` routes have `robots.txt` exclusions  
- Metadata includes `noindex`, `nofollow`, `noarchive`, `nosnippet`
- Social sharing shows generic "Private Music Pitch" descriptions
- URLs are not easily guessable (use descriptive but unique identifiers)

## Future Enhancements

This system can be easily extended with:
- Database storage (replace in-memory `PITCH_DECKS`)
- Admin interface for deck creation
- Analytics tracking for pitch deck views
- Password protection for extra security
- Custom domains for whitelabel pitches
- Video embeds alongside audio
- PDF export functionality

## File Structure

```
src/
  app/p/[deckId]/page.tsx        # Dynamic pitch deck routes
  _components/pitch-deck.tsx     # Main pitch deck component  
  types/pitch-deck.ts            # TypeScript interfaces
  lib/pitch-deck-manager.ts      # Data management utilities
```