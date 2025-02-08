import { IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';

import { formatTime } from '@/lib/string/formatTime';
import { DragHandler } from '@/components/DragHandler';
import { VideoState } from '@/components/Video/Video';
import { VideoTime } from '@/components/Video/VideoTime';

export interface VideoControlsProps {
  state: VideoState;
  setState: React.Dispatch<React.SetStateAction<VideoState>>;
  video: React.RefObject<HTMLVideoElement | null>;
  handlePlay: () => void;
  handlePause: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  state,
  setState,
  video,
  handlePlay,
  handlePause,
}) => {
  const handleDragStart = () => {
    if (video.current) {
      setState((prevState) => ({ ...prevState, isDragging: true }));
    }
  };

  const handleDrag = (value: number) => {
    if (video.current && !isNaN(value)) {
      setState((prevState) => ({
        ...prevState,
        handlePosition: 100 * value,
        intentPosition: state.videoDuration * value,
      }));
    }
  };

  const handleDragEnd = (value: number | null) => {
    if (video.current && value !== null && !isNaN(value)) {
      video.current.currentTime = state.videoDuration * value;
      setState((prevState) => ({ ...prevState, isDragging: false }));
    }
  };

  const handleIntent = (value: number) => {
    if (video.current && !isNaN(value)) {
      setState((prevState) => ({
        ...prevState,
        intentPosition: state.videoDuration * value,
      }));
    }
  };

  return (
    <div
      style={{
        transform: state.controlsVisible ? 'scaleY(1)' : 'scaleY(0)',
      }}
      className="absolute bottom-[5%] bg-black h-10 flex items-center py-0 px-2 w-[85%] transition-transform duration-300 ease-in-out"
    >
      {/* Play pause button */}
      <button
        className="bg-transparent border-0 size-10 flex justify-center items-center outline-0 cursor-pointer flex-[0_0_40px] p-0"
        type="button"
        onClick={state.videoPlaying === false ? handlePlay : handlePause}
      >
        {state.videoPlaying === false ? (
          <IconPlayerPlayFilled className="text-white" />
        ) : (
          <IconPlayerPauseFilled className="text-white" />
        )}
      </button>
      {/* Current Time */}
      <VideoTime className="pl-0">{formatTime(state.videoCurrentTime)}</VideoTime>
      {/* Progress */}
      <DragHandler
        className="relative flex items-center flex-[1_0_auto]"
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onIntent={handleIntent}
      >
        <div className="w-full h-5 bg-transparent cursor-pointer"></div>
        <progress
          max="100"
          value={state.handlePosition}
          className="bg-white h-0.5 w-full absolute top-[calc(50%_-_1px)] left-0 pointer-events-none"
        ></progress>
        <div
          className="absolute size-2.5 rounded-[50%] bg-white transform-gpu -translate-x-1 translate-y-[1px] top-[calc(50%_-_6px)]"
          style={{
            left: state.handlePosition + '%',
          }}
        ></div>
      </DragHandler>
      {/* Total time */}
      <VideoTime className="pl-4">{formatTime(state.videoDuration)}</VideoTime>
    </div>
  );
};
