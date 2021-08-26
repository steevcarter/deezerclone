import { FormEvent, useCallback, useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";
import { Song } from "../types";
import { fetchSongs } from "../utils/apiCalls";
import { Header } from "../components/Header/Header";
import { Player } from "../components/Player/Player";
import { SongsList } from "../components/SongsList/SongsList";
import { LoadingView } from "../components/LoadingView/LoadingView";
import { useSongsStatus } from "../hooks/useSongsStatus";

const FETCH_INDEX = 25 as const;

const Home = () => {
  // header's search
  const [search, setSearch] = useState("");
  const [prevSearch, setPrevSearch] = useState("");

  // songs fetching
  const [queryIndex, setQueryIndex] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [songsStatus, updateSongsStatus] = useSongsStatus();

  // Player state
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const playPrev = useCallback(() => {
    if (!songs) return;
    setCurrentSongIndex((prev) => {
      const prevIndex = prev - 1;
      if (prevIndex < 0) {
        return songs.length - 1;
      }
      return prevIndex;
    });
  }, [songs]);

  const playNext = useCallback(() => {
    if (!songs) return;
    setCurrentSongIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex > songs.length - 1) {
        return 0;
      }
      return nextIndex;
    });
  }, [songs]);

  const handleTileClick = useCallback((clickedIndex: number) => {
    setCurrentSongIndex(clickedIndex);
    setIsPlaying(true);
  }, []);

  const handleSearchInput = (e: FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const handleSearchSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!search || search === prevSearch) return;
      updateSongsStatus("FETCH_SONGS");
      try {
        const { songs, next } = await fetchSongs(search, 0);
        setHasNext(!!next);
        setSongs(songs);
        setError(null);
        setQueryIndex(FETCH_INDEX);
        setPrevSearch(search);
        updateSongsStatus("FETCH_SONGS_SUCCESS");
        setIsPlaying(false);
        setCurrentSongIndex(-1);
      } catch (error) {
        setError(error.message);
        setPrevSearch("");
        updateSongsStatus("FETCH_SONGS_ERROR");
      }
    },
    [prevSearch, search, updateSongsStatus]
  );

  const loadMoreSongs = useCallback(async () => {
    if (!hasNext) return;
    updateSongsStatus("FETCH_SONGS");
    try {
      const { songs, next } = await fetchSongs(search, queryIndex);
      setHasNext(!!next);
      setSongs((prevSongs) => [...prevSongs!, ...songs]);
      setError(null);
      setQueryIndex((prev) => prev + FETCH_INDEX);
      updateSongsStatus("FETCH_SONGS_SUCCESS");
    } catch (error) {
      setError(error.message);
      setPrevSearch("");
      updateSongsStatus("FETCH_SONGS_ERROR");
    }
  }, [hasNext, queryIndex, search, updateSongsStatus]);

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener("resize", setAppHeight);

    return () => window.removeEventListener("resize", setAppHeight);
  }, []);

  return (
    <div className={styles.appWrapper}>
      <Header
        search={search}
        handleSearchInput={handleSearchInput}
        handleSearchSubmit={handleSearchSubmit}
      />
      <SongsList
        handleTileClick={handleTileClick}
        songsStatus={songsStatus}
        songs={songs}
        hasNext={hasNext}
        error={error}
        loadMoreSongs={loadMoreSongs}
        currentSongIndex={currentSongIndex}
      />
      {songsStatus === "loading" && <LoadingView />}
      <Player
        currentSong={songs && songs[currentSongIndex]}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        playNext={playNext}
        playPrev={playPrev}
      />
    </div>
  );
};

export default Home;
