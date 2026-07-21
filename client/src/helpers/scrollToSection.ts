/** Скролл к секции так, чтобы её верх совпал с низом sticky-хедера. */
export const scrollToSection = (id: string, behavior: ScrollBehavior = 'smooth') => {
  const el = document.getElementById(id)
  if (!el) return

  const headerHeight =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72

  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight

  window.scrollTo({ top: Math.max(0, top), behavior })
}
