const PANEL_VIDEO_SRC = '/hero-bg.mp4'

let started = false

/** Греет кэш браузера, чтобы на /panel видео стартовало без паузы. */
export const preloadPanelVideo = () => {
  if (started || typeof document === 'undefined') return
  started = true

  const video = document.createElement('video')
  video.preload = 'auto'
  video.muted = true
  video.playsInline = true
  video.src = PANEL_VIDEO_SRC
  video.load()
}

export { PANEL_VIDEO_SRC }
