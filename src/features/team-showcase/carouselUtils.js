export const getNextIndex = (currentIndex, delta, total) => {
  if (total <= 0) {
    return 0;
  }
  const normalizedDelta = delta % total;
  const candidate = (currentIndex + normalizedDelta + total) % total;
  return candidate;
};

export const getPreviousIndex = (currentIndex, total) => {
  return getNextIndex(currentIndex, -1, total);
};

export const getFollowingIndex = (currentIndex, total) => {
  return getNextIndex(currentIndex, 1, total);
};
