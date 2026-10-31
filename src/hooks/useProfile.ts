import { useEffect, useRef, useState } from 'react';
import {
  fetchRemoteProfile,
  readStoredProfile,
  saveRemoteProfile,
  writeStoredProfile,
  type Profile,
} from '@/lib/profile';

const REMOTE_SAVE_DELAY_MS = 400;

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile>(() => readStoredProfile());
  const pendingRemote = useRef<Partial<Profile>>({});
  const remoteTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      try {
        const remote = await fetchRemoteProfile();
        if (!active) return;
        const local = readStoredProfile();
        if (remote) {
          setProfile(writeStoredProfile({ activity: remote.activity ?? local.activity, glassOpacity: remote.glassOpacity }));
          if (remote.activity === null && local.activity) await saveRemoteProfile({ activity: local.activity });
        } else {
          await saveRemoteProfile(local);
        }
      } catch {
        return;
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    return () => {
      if (remoteTimer.current !== null) window.clearTimeout(remoteTimer.current);
    };
  }, []);

  const setGlassOpacity = (glassOpacity: number) => {
    setProfile(writeStoredProfile({ glassOpacity }));
    if (!userId) return;
    pendingRemote.current = { ...pendingRemote.current, glassOpacity };
    if (remoteTimer.current !== null) window.clearTimeout(remoteTimer.current);
    remoteTimer.current = window.setTimeout(() => {
      const patch = pendingRemote.current;
      pendingRemote.current = {};
      saveRemoteProfile(patch).catch(() => undefined);
    }, REMOTE_SAVE_DELAY_MS);
  };

  return { activity: profile.activity, glassOpacity: profile.glassOpacity, setGlassOpacity };
}
