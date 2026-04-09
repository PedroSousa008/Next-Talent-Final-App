import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** v2: safe merge so missing JSON keys do not wipe fields like avatarUri */
const STORAGE_KEY = "@next_talent_profile_v2";
const STORAGE_KEY_LEGACY = "@next_talent_profile_v1";

export type ProfileData = {
  displayName: string;
  handle: string;
  position: string;
  club: string;
  nationality: string;
  /** Local file URI from image picker — persisted until cleared */
  avatarUri: string | null;
  /** Aligns with Search position filter; "Any" = match any position filter */
  searchPosition: string;
  /** Dominant foot for Search; empty = match any foot filter */
  searchFoot: string;
  /** Player profile card / bio (metres) */
  heightMeters: number;
  /** Player profile card / bio (kilograms) */
  weightKg: number;
  /** DD/MM/YYYY — age is derived from this every day */
  dateOfBirth: string;
  /** Kit number shown on player card */
  shirtNumber: number;
};

const defaultProfile: ProfileData = {
  displayName: "Pedro Sousa",
  handle: "pedrosousa",
  position: "CAM",
  club: "Benfica",
  nationality: "Portugal",
  avatarUri: null,
  searchPosition: "CAM",
  searchFoot: "Right Foot",
  heightMeters: 1.8,
  weightKg: 73,
  dateOfBirth: "13/04/2003",
  shirtNumber: 8,
};

/** One-time style upgrades for Pedro Sousa saved before Benfica / CAM defaults */
function migratePedroSousaProfile(p: ProfileData): ProfileData {
  if (p.displayName.trim().toLowerCase() !== "pedro sousa") return p;
  let next = { ...p };
  if (next.club === "North City FC") next = { ...next, club: "Benfica" };
  if (next.searchPosition === "Any") {
    next = { ...next, searchPosition: "CAM", position: "CAM" };
  }
  if (!next.searchFoot.trim()) {
    next = { ...next, searchFoot: "Right Foot" };
  }
  return next;
}

function mergeStoredProfile(raw: unknown): ProfileData {
  const merged = { ...defaultProfile };
  if (!raw || typeof raw !== "object") return merged;
  const p = raw as Record<string, unknown>;
  (Object.keys(defaultProfile) as (keyof ProfileData)[]).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(p, key)) return;
    const v = p[key];
    if (v === undefined) return;
    switch (key) {
      case "shirtNumber":
      case "heightMeters":
      case "weightKg": {
        const n = typeof v === "number" ? v : Number(v);
        if (Number.isFinite(n)) (merged as Record<string, unknown>)[key] = n;
        break;
      }
      case "avatarUri":
        merged.avatarUri =
          v === null || typeof v === "string" ? v : merged.avatarUri;
        break;
      default:
        if (typeof v === "string") {
          (merged as Record<string, unknown>)[key] = v;
        }
    }
  });
  return merged;
}

type ProfileContextValue = {
  profile: ProfileData;
  ready: boolean;
  updateProfile: (next: Partial<ProfileData>) => void;
  replaceProfile: (next: ProfileData) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let rawStr = await AsyncStorage.getItem(STORAGE_KEY);
        if (!rawStr) {
          rawStr = await AsyncStorage.getItem(STORAGE_KEY_LEGACY);
        }
        if (cancelled) return;
        if (rawStr) {
          const parsed = JSON.parse(rawStr) as unknown;
          const merged = migratePedroSousaProfile(mergeStoredProfile(parsed));
          setProfile(merged);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      } catch {
        /* keep defaults */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: ProfileData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const updateProfile = useCallback(
    (partial: Partial<ProfileData>) => {
      setProfile((prev) => {
        const next = { ...prev, ...partial };
        void persist(next);
        return next;
      });
    },
    [persist]
  );

  const replaceProfile = useCallback(
    (next: ProfileData) => {
      setProfile(next);
      void persist(next);
    },
    [persist]
  );

  const value = useMemo(
    () => ({
      profile,
      ready,
      updateProfile,
      replaceProfile,
    }),
    [profile, ready, updateProfile, replaceProfile]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return ctx;
}
