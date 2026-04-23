'use client';

import { useEffect, useState } from 'react';

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformationLike;
};

const isLowPerformanceDevice = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const nav = navigator as NavigatorWithHints;
  const connection = nav.connection;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isNarrowViewport = window.matchMedia('(max-width: 900px)').matches;
  const saveData = connection?.saveData ?? false;
  const hasSlowNetwork = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
  const memory = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : undefined;
  const cores = nav.hardwareConcurrency ?? 8;

  return (
    prefersReducedMotion ||
    saveData ||
    hasSlowNetwork ||
    (hasCoarsePointer && (cores <= 6 || (typeof memory === 'number' && memory <= 6))) ||
    (isNarrowViewport && (cores <= 4 || (typeof memory === 'number' && memory <= 4)))
  );
};

export const useLowPerformanceMode = () => {
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false);

  useEffect(() => {
    setLowPerformanceMode(isLowPerformanceDevice());
  }, []);

  return lowPerformanceMode;
};
