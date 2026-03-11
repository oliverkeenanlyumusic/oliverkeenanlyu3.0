import type { DSP_CONFIG } from "./lib";

export type DspKey = keyof typeof DSP_CONFIG;

export interface DspEntry {
  url: string;
  displayName: string;
  isPrimary: boolean;
}

/** The normalised shape stored in the DB and returned by the router */
export type SmartLinks = Record<string, DspEntry>;

interface SonglinkPlatformEntry {
  url?: string;
  nativeAppUriDesktop?: string;
  nativeAppUriMobile?: string;
  entityUniqueId?: string;
}

export type SonglinkLinksByPlatform = Record<string, SonglinkPlatformEntry>;