import { Video } from '@/components/Video/Video';

export const App = () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center my-10">React Video Player</h1>
      <div className="container">
        <Video src="/rick.mp4" />
      </div>
    </>
  );
};
