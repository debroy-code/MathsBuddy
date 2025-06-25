'use client';

import { MathBuddy } from '@/components/math-buddy';
import { OpeningAnimation } from '@/components/opening-animation';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isShowingAnimation, setIsShowingAnimation] = useState(true);

  useEffect(() => {
    // This timeout should match the total animation duration in OpeningAnimation
    const timer = setTimeout(() => {
      setIsShowingAnimation(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isShowingAnimation) {
    return <OpeningAnimation />;
  }

  return <MathBuddy />;
}
