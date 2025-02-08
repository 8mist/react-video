import React, { useCallback, useEffect, useRef, useState } from 'react';

type DragHandlerProps = {
  children: React.ReactNode;
  className?: string;
  onDrag?: (value: number) => void;
  onDragStart?: (value: number | null) => void;
  onDragEnd?: (value: number | null) => void;
  onIntent?: (value: number) => void;
  onMouseLeave?: () => void;
};

export const DragHandler: React.FC<DragHandlerProps> = ({
  className,
  children,
  onDrag,
  onDragStart,
  onDragEnd,
  onIntent,
  onMouseLeave,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleIntentMove = (e: any) => {
    if (!isDragging) {
      triggerIntent(e);
    }
  };

  const triggerIntent = (e: any) => {
    e.persist();
    if (onIntent) {
      requestAnimationFrame(() => {
        const value = getHorizontalValue(e);
        onIntent(value);
      });
    }
  };

  const getPageX = (e: any): number => {
    return e.pageX !== undefined ? e.pageX : e.touches[0].pageX;
  };

  const getValueFromMouseEvent = useCallback((e: any): number => {
    const pageX = getPageX(e);
    return getHorizontalValue(pageX);
  }, []);

  const triggerRangeChange = useCallback(
    (e: any) => {
      if (onDrag) {
        onDrag(getValueFromMouseEvent(e));
      }
    },
    [getValueFromMouseEvent, onDrag],
  );

  const getHorizontalValue = (pageX: number): number => {
    const el = ref.current;
    if (!el) {
      return 0;
    }
    const rect = el.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset ||
      (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    let value = (pageX - (rect.left + scrollLeft)) / rect.width;
    value = Math.min(Math.max(value, 0), 1);
    return value;
  };

  const toggleSelection = (value: string) => {
    const body = document.getElementsByTagName('body')[0];
    body.style.userSelect = value;
  };

  const startDrag = (e: any) => {
    setIsDragging(true);

    window.addEventListener('mousemove', triggerRangeChange);
    window.addEventListener('touchmove', triggerRangeChange);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    toggleSelection('none');
    const value = e ? getValueFromMouseEvent(e) : null;
    if (onDragStart) {
      onDragStart(value);
    }
  };

  const endDrag = useCallback(
    (e?: any) => {
      if (e) {
        triggerRangeChange(e);
      }
      setIsDragging(false);

      window.removeEventListener('mousemove', triggerRangeChange);
      window.removeEventListener('touchmove', triggerRangeChange);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);

      toggleSelection('');
      const value = e ? getValueFromMouseEvent(e) : null;
      if (onDragEnd) {
        onDragEnd(value);
      }
    },
    [getValueFromMouseEvent, onDragEnd, triggerRangeChange],
  );

  useEffect(() => {
    return () => {
      endDrag();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={className}
      onMouseDown={startDrag}
      onMouseLeave={onMouseLeave}
      onMouseMove={handleIntentMove}
      onTouchStart={startDrag}
      ref={ref}
    >
      {children}
    </div>
  );
};
