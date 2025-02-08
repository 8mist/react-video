import { cn } from '@/lib/cn';

type VideoTimeProps = {
  children: React.ReactNode;
  className?: string;
};

export const VideoTime: React.FC<VideoTimeProps> = ({ children, className }) => {
  return (
    <div
      className={cn('text-xs text-white leading-10 font-semibold w-16 flex-[0_0_auto]', className)}
    >
      {children}
    </div>
  );
};
