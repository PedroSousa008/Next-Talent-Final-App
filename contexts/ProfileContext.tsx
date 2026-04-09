import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@next_talent_profile_v1";

export type ProfileData = {
  displayName: string;
  handle: string;
  position: string;
  club: string;
  nationality: string;
  /** Local file URI from image picker */
  avatarUri: string | null;
};

const defaultProfile: ProfileData = {
  displayName: "Pedro Castro",
  handle: "pedrocastro",
  position: "Winger",
  club: "North City FC",
  nationality: "Portugal",
  avatarUri: null,
};

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
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<ProfileData>;
          setProfile((prev) => ({ ...prev, ...parsed }));
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
