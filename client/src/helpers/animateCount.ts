/** Быстрый старт, замедление к концу. */
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/**
 * Анимирует число от `from` до `to`.
 * Возвращает функцию отмены.
 */
export const animateCount = (
  from: number,
  to: number,
  durationMs: number,
  onUpdate: (value: number) => void,
): (() => void) => {
  let frameId = 0
  let cancelled = false
  const start = performance.now()

  const tick = (now: number) => {
    if (cancelled) return
    const t = Math.min(1, (now - start) / durationMs)
    onUpdate(Math.round(from + (to - from) * easeOutCubic(t)))
    if (t < 1) {
      frameId = requestAnimationFrame(tick)
    }
  }

  frameId = requestAnimationFrame(tick)

  return () => {
    cancelled = true
    cancelAnimationFrame(frameId)
  }
}
