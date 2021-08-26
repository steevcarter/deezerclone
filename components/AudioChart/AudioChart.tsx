import { useCallback, useEffect, useRef } from "react";
import styles from "./AudioChart.module.scss";

type Props = {
  audioElement: HTMLMediaElement;
};

export const AudioChart = ({ audioElement }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const bufferLengthRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    ctxRef.current = canvasRef.current.getContext("2d");
    canvasRef.current.width = window.innerWidth;
  }, []);

  const drawFrequency = useCallback((frequencyData: Uint8Array) => {
    if (!ctxRef.current || !canvasRef.current || !analyzerRef.current) return;
    const WIDTH = canvasRef.current.width;
    const HEIGHT = canvasRef.current.height;
    ctxRef.current.clearRect(0, 0, WIDTH, HEIGHT);

    analyzerRef.current.getByteFrequencyData(frequencyData);

    const barWidth = (WIDTH / bufferLengthRef.current) * 2.5;
    let x = 0;

    frequencyData.forEach((amount) => {
      const percent = amount / 255;
      const barHeight = HEIGHT * percent;

      ctxRef.current!.fillStyle = `hsla(204, 96%, 49%, ${percent})`;
      ctxRef.current!.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
      x += barWidth;
    });

    requestAnimationFrame(() => drawFrequency(frequencyData));
  }, []);

  const getAudioData = useCallback(async () => {
    if (!(audioElement as any).captureStream) return;
    const stream = (audioElement as any).captureStream();
    const audioCtx = new window.AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);

    analyzerRef.current = audioCtx.createAnalyser();
    source.connect(analyzerRef.current);

    analyzerRef.current.fftSize = 256; //2**8;

    bufferLengthRef.current = analyzerRef.current.frequencyBinCount;
    const frequencyData = new Uint8Array(bufferLengthRef.current);

    drawFrequency(frequencyData);
  }, [audioElement, drawFrequency]);

  useEffect(() => {
    audioElement.addEventListener("canplaythrough", getAudioData);
    return () => {
      audioElement.removeEventListener("canplaythrough", getAudioData);
    };
  }, [audioElement, getAudioData]);

  return (
    <div className={styles.chartWrapper}>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
    </div>
  );
};
