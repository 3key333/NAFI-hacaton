/** Короткие союзы и предлоги — не должны оставаться в конце строки. */
const HANGING_PARTICLE =
  '(и|а|но|в|во|на|с|со|к|ко|о|об|обо|от|до|за|по|у|из|для|под|над|без|про|или|же|ли|бы|ни|не|то|при)'

/** Заменяет пробел после короткого слова на неразрывный. */
export const fixHangingParticles = (text: string): string => {
  const pattern = new RegExp(`\\s${HANGING_PARTICLE}\\s`, 'giu')
  let result = text
  let prev = ''
  // Повторно, чтобы поймать подряд идущие частицы («и в»).
  while (result !== prev) {
    prev = result
    result = result.replace(pattern, (_match, word: string) => ` ${word}\u00A0`)
  }
  return result
}
