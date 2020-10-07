export function getVisibleStartEnd({ scrollData, width }) {
  const { percentScrolled, viewportWidth } = scrollData;

  const visibleStart = percentScrolled * (width - viewportWidth);
  const visibleEnd = visibleStart + viewportWidth;
  return { visibleEnd, visibleStart };
}
