import { useRef, useState } from 'react';

import { VideoControls } from '@/components/Video/VideoControls';

type VideoProps = {
  src: string;
  width?: number;
  height?: number;
  controls?: boolean;
  playsInline?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  maxWidth?: number;
};

export type VideoState = {
  src: string;
  isPlayable: boolean;
  videoPlaying: boolean;
  videoLoaded: boolean;
  handlePosition: number;
  isDragging: boolean;
  controlsVisible: boolean;
  videoDuration: number;
  videoCurrentTime: number;
  videoAutoplay: boolean;
  videoIsReady: boolean;
  intentPosition: number;
  loops: number;
};

export const Video: React.FC<VideoProps> = (props) => {
  const {
    src,
    width = 2000,
    height = 1300,
    controls = true,
    playsInline = true,
    muted = true,
    loop = true,
    autoPlay = window.matchMedia('(prefers-reduced-motion: no-preference)').matches,
    preload = 'auto',
  } = props;

  const PADDING_BOTTOM = String((height / width) * 100) + '%';

  const [state, setState] = useState<VideoState>({
    src,
    isPlayable: true,
    videoPlaying: false,
    videoLoaded: false,
    handlePosition: 0,
    isDragging: false,
    controlsVisible: false,
    videoDuration: 0,
    videoCurrentTime: 0,
    videoAutoplay: false,
    videoIsReady: false,
    intentPosition: 0,
    loops: 0,
  });

  const video = useRef<HTMLVideoElement | null>(null);
  const playPromise = useRef<Promise<void> | null>(null);

  const setVideoRef = (element: HTMLVideoElement) => {
    video.current = element;
    onVideoLoaded();
  };

  const onVideoLoaded = () => {
    requestAnimationFrame(() => {
      if (video.current && video.current.readyState >= 3) {
        setState((prevState) => ({
          ...prevState,
          videoLoaded: true,
          videoAutoplay: video.current!.autoplay,
          videoIsReady: true,
          videoDuration: video.current!.duration,
        }));
      } else {
        onVideoLoaded();
      }
    });
  };

  const handlePlay = () => {
    if (!video.current) return;

    try {
      playPromise.current = video.current.play();
    } catch (error) {
      console.error(error);
    }

    if (playPromise.current) {
      playPromise.current
        .then(() => {
          setState((prevState) => ({ ...prevState, videoPlaying: true }));
        })
        .catch(() => {
          setState((prevState) => ({ ...prevState, videoPlaying: false }));
        });
    }
  };

  const handlePause = () => {
    if (!video.current) return;

    if (playPromise.current) {
      playPromise.current
        .then(() => {
          video.current!.pause();
          setState((prevState) => ({ ...prevState, videoPlaying: false }));
        })
        .catch(() => {
          setState((prevState) => ({ ...prevState, videoPlaying: true }));
        });
      return;
    }

    video.current.pause();
    setState((prevState) => ({ ...prevState, videoPlaying: false }));
  };

  const handleProgress = () => {
    if (state.isDragging) {
      return;
    }

    const currentTime = video.current?.currentTime ?? 0;

    setState((prevState) => ({
      ...prevState,
      videoCurrentTime: currentTime,
      handlePosition: (currentTime / state.videoDuration) * 100,
    }));
  };

  const handleEnded = () => {
    if (loop === false) {
      handlePause();
      return;
    }

    const loops = state.loops;
    if (loops < 2) {
      handlePlay();
      setState((prevState) => ({ ...prevState, loops: loops + 1 }));
    } else {
      handlePause();
      setState((prevState) => ({ ...prevState, videoPlaying: false }));
    }
  };

  const handleMouseEnter = () => {
    setState((prevState) => ({ ...prevState, controlsVisible: true }));
  };

  const handleMouseLeave = () => {
    setState((prevState) => ({ ...prevState, controlsVisible: false }));
  };

  return (
    <figure onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        style={{
          width: width + 'px',
        }}
        className="my-0 mx-auto max-w-full relative"
      >
        <div
          style={{
            paddingBottom: PADDING_BOTTOM,
          }}
          className="flex justify-center"
        >
          <video
            ref={setVideoRef}
            className="h-full w-full absolute top-0 left-0 cursor-pointer"
            src={src}
            autoPlay={autoPlay}
            muted={muted}
            preload={preload}
            playsInline={playsInline}
            onEnded={handleEnded}
            onPause={handlePause}
            onPlay={handlePlay}
            onTimeUpdate={handleProgress}
          />

          {controls === true && state.videoLoaded && (
            <VideoControls
              state={state}
              setState={setState}
              handlePause={handlePause}
              handlePlay={handlePlay}
              video={video}
            />
          )}
        </div>
      </div>
    </figure>
  );
};
