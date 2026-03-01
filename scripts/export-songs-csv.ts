/**
 * scripts/export-songs-csv.ts — songs.ts → CSV エクスポート
 *
 * 実行: npx tsx scripts/export-songs-csv.ts > scripts/songs.csv
 *
 * 出力列:
 *   id, title, artist,
 *   feels (;区切り), pokemon_context (;区切り), lyrics_themes (;区切り),
 *   grade, pokemon_gen, pokemon_types (;区切り), pokemon_names (;区切り),
 *   priority, approx_views
 *
 * 編集後の反映: CSV を Claude に貼り付けて「songs.ts に反映して」と依頼
 */

import { SONGS } from '../src/data/songs'

const HEADERS = [
  'id', 'title', 'artist',
  'feels', 'pokemon_context', 'lyrics_themes',
  'grade', 'pokemon_gen', 'pokemon_types', 'pokemon_names',
  'priority', 'approx_views',
]

function csv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}

const rows = SONGS.map(s =>
  [
    s.id,
    s.title,
    s.artist,
    s.feels.join(';'),
    s.pokemon_context.join(';'),
    s.lyrics_themes.join(';'),
    s.grade ?? '',
    s.pokemon_gen ?? '',
    s.pokemon_types.join(';'),
    s.pokemon_names.join(';'),
    String(s.priority ?? 0),
    String(s.approx_views),
  ].map(csv).join(',')
)

console.log(HEADERS.join(','))
rows.forEach(r => console.log(r))
