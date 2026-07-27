import { preloadPanelVideo } from '@/helpers/preloadPanelVideo'

const PANEL_PATH = '/panel'

const normalizePath = (pathname: string) =>
  pathname.replace(/\/+$/, '') || '/'

export const isPanelRoute = (pathname = window.location.pathname): boolean =>
  normalizePath(pathname) === PANEL_PATH

const notifyRouteChange = () => {
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export const navigateToPanel = () => {
  preloadPanelVideo()
  if (isPanelRoute()) return
  window.history.pushState(null, '', PANEL_PATH)
  notifyRouteChange()
}

export const navigateToHome = () => {
  if (isPanelRoute()) {
    window.history.pushState(null, '', '/')
    notifyRouteChange()
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
