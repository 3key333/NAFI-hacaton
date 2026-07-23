/** Короткие союзы и предлоги — не должны оставаться в конце строки. */
const HANGING_PARTICLES =
  /\s(и|а|но|в|во|на|с|со|к|ко|о|об|обо|от|до|за|по|у|из|для|под|над|без|про|или|же|ли|бы|ни|не|то|при)\s/giu

/** Заменяет пробел после короткого слова на неразрывный. */
export const fixHangingParticles = (text: string): string =>
  text.replace(HANGING_PARTICLES, (_match, word: string) => ` ${word}\u00A0`)
