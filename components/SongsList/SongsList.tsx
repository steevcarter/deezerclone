import styles from "../SongsList/SongsList.module.scss";
import { Song, SongsStatus } from "../../types";
import { SongTile } from "../SongTile/SongTile";

type Props = {
  error: string | null;
  songs: Song[] | null;
  hasNext: boolean;
  songsStatus: SongsStatus;
  loadMoreSongs: () => Promise<void>;
  handleTileClick: (clickedIndex: number) => void;
  currentSongIndex: number;
};

export const SongsList = ({
  songsStatus,
  error,
  songs,
  hasNext,
  loadMoreSongs,
  handleTileClick,
  currentSongIndex,
}: Props) => {
  return (
    <div className={styles.listWrapper}>
      {songsStatus === "idle" ? (
        <p className={styles.idleStateText}>Search for your favourite songs!</p>
      ) : (
        <ul className={styles.songsList}>
          {songs &&
            songs.map((song: Song, index) => {
              return (
                <SongTile
                  key={index + "-" + song.id}
                  title={song.title}
                  artistName={song.artist.name}
                  albumCoverSrc={song.album.cover}
                  songSrc={song.preview}
                  onClick={() => handleTileClick(index)}
                  active={index === currentSongIndex}
                />
              );
            })}
          {error && (
            <p className={styles.errorStateText}>
              <span>{error}</span>
              <span>Try again later</span>
            </p>
          )}
          {(songsStatus === "loaded" || songsStatus === "error") && hasNext && (
            <li className={styles.loadMoreWrapper}>
              <button className={styles.loadMoreButton} onClick={loadMoreSongs}>
                load more
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
