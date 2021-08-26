import { useState } from "react";

export const songsStatuses = {
  idle: "idle",
  isLoading: "loading",
  hasLoaded: "loaded",
  hasError: "error",
} as const;

export type SongsStatus = typeof songsStatuses[keyof typeof songsStatuses];

const transitions: Transitions = {
  [songsStatuses.idle]: {
    FETCH_SONGS: songsStatuses.isLoading,
  },
  [songsStatuses.isLoading]: {
    FETCH_SONGS_SUCCESS: songsStatuses.hasLoaded,
    FETCH_SONGS_ERROR: songsStatuses.hasError,
  },
  [songsStatuses.hasLoaded]: {
    FETCH_SONGS: songsStatuses.isLoading,
  },
  [songsStatuses.hasError]: {
    FETCH_SONGS: songsStatuses.isLoading,
  },
};

type Action = "FETCH_SONGS" | "FETCH_SONGS_SUCCESS" | "FETCH_SONGS_ERROR";

type Transitions = {
  [key in SongsStatus]: { [key in Action]?: SongsStatus };
};

const useSongsStatus = () => {
  const [songsStatus, setSongsStatus] = useState<SongsStatus>(songsStatuses.idle);

  const transition = (currentStatus: SongsStatus, action: Action): SongsStatus => {
    const nextStatus = transitions[currentStatus][action];
    return nextStatus || currentStatus;
  };

  const updateSongsStatus = (action: Action) => {
    setSongsStatus((currentStatus) => transition(currentStatus, action));
  };

  return [songsStatus, updateSongsStatus] as const;
};

export { useSongsStatus };
