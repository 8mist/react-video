export const formatTime = (time: number) => {
  const minutes = isNaN(Math.floor(time / 60)) ? 0 : Math.floor(time / 60);
  const seconds = isNaN(Math.floor(time % 60)) ? 0 : Math.floor(time % 60);
  return `${String(minutes >= 10 ? minutes : '0' + minutes)}:${String(seconds >= 10 ? seconds : '0' + seconds)}`;
};
