import { MouseEvent } from "react";
import styles from "./VolumeBar.module.scss";
import MuteIcon from "../../public/mute-icon.svg";
import UnmuteIcon from "../../public/unmute-icon.svg";

type Props = {
  volume: number;
  handleVolumeChange: (volume: number) => void;
  disabled: boolean;
};

export const VolumeBar = ({ volume, handleVolumeChange, disabled }: Props) => {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickedX = e.pageX;
    const newValue = (clickedX - left) / width;
    handleVolumeChange(newValue);
  };

  return (
    <div className={styles.volumeWrapper}>
      <button
        disabled={disabled}
        onClick={() => handleVolumeChange(0)}
        className={styles.muteUnmute}
      >
        <span aria-hidden="true">
          <MuteIcon />
        </span>
        <span className="visuallyhidden">Mute sound.</span>
      </button>
      <div style={{opacity: disabled ? 0.5 : 1, cursor: disabled ? "default" : "pointer"}} onClick={handleClick} className={styles.volumeBar}>
        <div style={{ width: `${volume * 100}%` }} className={styles.volume}></div>
      </div>
      <button
        disabled={disabled}
        onClick={() => handleVolumeChange(1)}
        className={styles.muteUnmute}
      >
        <span aria-hidden="true">
          <UnmuteIcon />
        </span>
        <span className="visuallyhidden">Unmute sound.</span>
      </button>
    </div>
  );
};
