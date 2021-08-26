import styles from "./SongTile.module.scss";
import Image from "next/image";

type Props = {
  title: string;
  artistName: string;
  albumCoverSrc: string;
  songSrc: string;
  onClick: () => void;
  active: boolean;
};

export const SongTile = ({ title, artistName, albumCoverSrc, onClick, active }: Props) => {
  return (
    <li onClick={onClick} className={`${styles.song} ${active ? styles.active : ""}`}>
      <button>
        <div className={styles.songContent}>
          <p className={styles.songTitle}>{title}</p>
          <p className={styles.songArtist}>{artistName}</p>
        </div>
        <div className={styles.songImageWrapper}>
          {albumCoverSrc ? (
            <Image
              className={styles.songImage}
              src={albumCoverSrc}
              alt=""
              layout="fill"
              objectFit="fill"
            />
          ) : (
            <p className={styles.noCoverImg}>No cover img</p>
          )}
        </div>
      </button>
    </li>
  );
};
