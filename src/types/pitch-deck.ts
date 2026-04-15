export interface TrackEmbed {
  id: string;
  title: string;
  artist: string;
  spotifyId: string;
  appleMusicId?: string;
  soundCloudId?: string;
  description?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
}

export interface CustomStyles {
  accentColor?: string;
  textColor?: string;
}

export interface PitchDeckData {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage?: string;
  logoUrl?: string;
  tracks: TrackEmbed[];
  playlistSpotifyId?: string;
  playlistTitle?: string;
  contactInfo?: ContactInfo;
  customStyles?: CustomStyles;
  createdAt?: string;
  lastModified?: string;
  isActive?: boolean;
}

export interface PitchDeckProps extends PitchDeckData {
  deckId: string;
  shareUrl: string;
}