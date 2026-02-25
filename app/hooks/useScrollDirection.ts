import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down";

export function useScrollDirection(threshold = 8): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("up");
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const currY = window.scrollY;
      if (currY < 30) {
        setDirection("up");
      } else if (Math.abs(currY - lastY) >= threshold) {
        setDirection(currY > lastY ? "down" : "up");
      }
      lastY = currY;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return direction;
}
