import { useEffect, useRef, useState, MouseEvent, Dispatch, SetStateAction, memo } from "react";
import styles from "./Player.module.scss";
import { isIOS } from "../../utils/isIOS";
import { Song } from "../../types";
import PrevIcon from "../../public/prev-icon.svg";
import NextIcon from "../../public/next-icon.svg";
import PlayIcon from "../../public/play-icon.svg";
import PauseIcon from "../../public/pause-icon.svg";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { VolumeBar } from "../VolumeBar/VolumeBar";
import { AudioChart } from "../AudioChart/AudioChart";

type Props = {
  currentSong: Song | null;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  playPrev: () => void;
  playNext: () => void;
};

export const Player = memo(
  ({ currentSong, isPlaying, setIsPlaying, playPrev, playNext }: Props) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const disabled = !currentSong || !currentSong.preview;

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      }, 500);

      return () => {
        clearInterval(intervalId);
      };
    }, [audioRef]);

    useEffect(() => {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    });

    const handleProgressBarClick = (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (!audioRef.current) return;
      const { left, width } = e.currentTarget.getBoundingClientRect();
      const clickedX = e.pageX;
      const newValue = (clickedX - left) / width;
      audioRef.current.currentTime = newValue * audioRef.current.duration;
    };

    const handlePlayPauseClick = () => {
      setIsPlaying((prev) => !prev);
    };

    const handleVolumeChange = (volume: number) => {
      setVolume(volume);
    };

    useEffect(() => {
      if (!audioRef.current) return;
      audioRef.current.volume = volume;
    }, [volume]);

    return (
      <div className={styles.playerWrapper}>
        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          src={currentSong ? currentSong.preview : ""}
          onEnded={playNext}
        ></audio>
        <div className={styles.songTitle}>
          {currentSong ? `${currentSong.artist.name} - ${currentSong.title}` : "..."}
        </div>
        <ProgressBar
          disabled={disabled}
          handleClick={handleProgressBarClick}
          currentTime={currentTime || 0}
          duration={audioRef.current?.duration || 0}
        />
        <div className={styles.buttonsWrapper}>
          <button disabled={disabled} onClick={playPrev}>
            <span aria-hidden="true">
              <PrevIcon />
            </span>
            <span className="visuallyhidden">Prev song</span>
          </button>
          <button disabled={disabled} onClick={handlePlayPauseClick}>
            {isPlaying ? (
              <>
                <span aria-hidden="true">
                  <PauseIcon />
                </span>
                <span className="visuallyhidden">Pause song</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">
                  <PlayIcon />
                </span>
                <span className="visuallyhidden">Play song</span>
              </>
            )}
          </button>
          <button disabled={disabled} onClick={playNext}>
            <span aria-hidden="true">
              <NextIcon />
            </span>
            <span className="visuallyhidden">Next song</span>
          </button>
        </div>
        {/* iOS does not support volume level control and media stream capturing */}
        {!isIOS() && (
          <>
            <VolumeBar
              disabled={disabled}
              volume={volume}
              handleVolumeChange={handleVolumeChange}
            />
            {audioRef.current && <AudioChart audioElement={audioRef.current} />}
          </>
        )}
      </div>
    );
  }
);

Player.displayName = "Player";
