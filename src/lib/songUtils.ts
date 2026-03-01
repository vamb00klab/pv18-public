import type { Song } from '@/types/song'

/** リリースから30日以内の曲を「新曲」とみなす */
export const NEW_SONG_DAYS = 30

/** リリース日をもとに新曲かどうか判定する */
export function isNewSong(song: Song): boolean {
  if (!song.release_date) return false
  const releaseMs = new Date(song.release_date).getTime()
  return releaseMs >= Date.now() - NEW_SONG_DAYS * 24 * 60 * 60 * 1000
}
