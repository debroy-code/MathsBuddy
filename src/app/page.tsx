'use client';

import { HomePage } from '@/components/home-page';
import { OpeningAnimation } from '@/components/opening-animation';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isShowingAnimation, setIsShowingAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowingAnimation(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isShowingAnimation) {
    return <OpeningAnimation />;
  }

  return <HomePage />;
}
