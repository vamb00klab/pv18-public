'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SONGS } from '@/data/songs'
import { SongLinkButtons } from '@/components/SongLinkButtons'
import { SongIntro } from '@/components/SongIntro'
import { VOCALOID_LABEL, buildFeatStr } from '@/lib/vocaloidLabels'
import { isNewSong } from '@/lib/songUtils'
import type { Song, Feel, EvalGrade, PkmnGen } from '@/types/song'

// --- 定数 ---

const ALL_FEELS: Feel[] = [
  '感動/泣ける', '懐かしい', 'かわいい', 'かっこいい', 'チル/癒し', '疾走感/ノリ', '中毒性/リピート',
]
const ALL_GRADES: EvalGrade[] = ['殿堂入り', '高評価/名曲']
const ALL_GENS: PkmnGen[]   = ['gen1', 'gen2', 'gen3', 'gen4', 'gen5', 'gen6', 'gen7', 'gen8', 'gen9', 'gen10']

// songs.ts の配列から重複排除してキャラ一覧を生成
const ALL_VOCALOIDS: string[] = Array.from(new Set(SONGS.flatMap(s => s.vocaloids))).sort()

const FEEL_LABEL: Record<Feel, string> = {
  '感動/泣ける':     '感動',
  '懐かしい':        '懐かしい',
  'かわいい':        'かわいい',
  'かっこいい':      'かっこいい',
  'チル/癒し':       'チル/癒し',
  '疾走感/ノリ':     '疾走感',
  '中毒性/リピート': '中毒性',
}
const GEN_LABEL: Record<PkmnGen, string> = {
  gen1:  '第1世代',
  gen2:  '第2世代',
  gen3:  '第3世代',
  gen4:  '第4世代',
  gen5:  '第5世代',
  gen6:  '第6世代',
  gen7:  '第7世代',
  gen8:  '第8世代',
  gen9:  '第9世代',
  gen10: '第10世代',
}
const GEN_GAMES_FULL: Record<PkmnGen, string> = {
  gen1:  '赤・緑・青・ピカチュウ（1996〜）',
  gen2:  '金・銀・クリスタル（1999〜）',
  gen3:  'ルビー・サファイア・エメラルド（2002〜）',
  gen4:  'ダイヤモンド・パール・プラチナ（2006〜）',
  gen5:  'ブラック・ホワイト（2010〜）',
  gen6:  'X・Y（2013〜）',
  gen7:  'サン・ムーン（2016〜）',
  gen8:  'ソード・シールド（2019〜）',
  gen9:  'スカーレット・バイオレット（2022〜）',
  gen10: 'レジェンズ Z-A（2025〜）',
}
const CATEGORY_HELP: Record<string, string> = {
  feels:    '気分・雰囲気で絞り込みます。OR モードではいずれかに当てはまる曲、AND モードではすべてに当てはまる曲を表示します。',
  grade:    'サイト開発者が YouTube 動画の投稿日・再生数・コメント欄を元に評価し独自にタグ付け。特に強い傾向が見られた曲を「高評価」、評価が抜きん出ていた曲を「殿堂入り」としています。',
  vocaloid: 'メインボーカルまたは印象的なパートを担当しているキャラクターで絞り込みます。OR モードではいずれかのキャラが参加している曲、AND モードではすべてのキャラが参加している曲を表示します。',
  gen:              '登場するポケモンの世代で絞り込みます。世代情報がない曲は選択時に非表示になります。',
  pokemon_criteria: '各曲の MV に登場するポケモンから代表的なものを最大3体、紫タグで表示しています。世代フィルタの絞り込みにも使われます。登場ポケモンが多い曲では一部のみの掲載になります。',
}
/** songs.ts の pokemon_names（英語）→ 日本語表示名 */
const POKEMON_JP: Record<string, string> = {
  // Gen 1
  Pikachu:      'ピカチュウ',
  Raichu:       'ライチュウ',
  Clefairy:     'ピッピ',
  Jigglypuff:   'プリン',
  Mewtwo:       'ミュウツー',
  Mew:          'ミュウ',
  Bulbasaur:    'フシギダネ',
  Ivysaur:      'フシギソウ',
  Venusaur:     'フシギバナ',
  Charmander:   'ヒトカゲ',
  Squirtle:     'ゼニガメ',
  Gengar:       'ゲンガー',
  Cubone:       'カラカラ',
  Eevee:        'イーブイ',
  Voltorb:      'ビリリダマ',
  Electrode:    'マルマイン',
  Arbok:        'アーボック',
  Nidoking:     'ニドキング',
  Slowpoke:     'ヤドン',
  Ditto:        'メタモン',
  // Gen 2
  Pichu:        'ピチュー',
  Espeon:       'エーフィ',
  Ledyba:       'レディバ',
  Sudowoodo:    'ウソッキー',
  Lugia:        'ルギア',
  'Ho-Oh':      'ホウオウ',
  Houndoom:     'ヘルガー',
  // Gen 3
  Mudkip:       'ミズゴロウ',
  Gardevoir:    'サーナイト',
  Milotic:      'ミロカロス',
  Latias:       'ラティアス',
  Latios:       'ラティオス',
  Deoxys:       'デオキシス',
  Pelipper:     'ペリッパー',
  Swablu:       'チルット',
  Azurill:      'ルリリ',
  Mawile:       'クチート',
  // Gen 4
  Bidoof:       'ビッパ',
  Bibarel:      'ビーダル',
  Garchomp:     'ガブリアス',
  Spiritomb:    'ミカルゲ',
  Roserade:     'ロズレイド',
  Lucario:      'ルカリオ',
  Togekiss:     'トゲキッス',
  'Mime Jr.':   'マネネ',
  Bronzong:     'ドータクン',
  'Porygon-Z':  'ポリゴンZ',
  'Heat Rotom': 'ヒートロトム',
  // Gen 5
  Meloetta:     'メロエッタ',
  Zekrom:       'ゼクロム',
  Reshiram:     'レシラム',
  Foongus:      'タマゲタケ',
  Amoonguss:    'モロバレル',
  Ferroseed:    'テッシード',
  Stunfisk:     'マッギョ',
  // Gen 6
  Goomy:        'ヌメラ',
  // Gen 7
  Mimikyu:      'ミミッキュ',
  Incineroar:   'ガオガエン',
  Sandygast:    'スナバァ',
  // Gen 8
  'Mr. Rime':   'ブリムオン',
  Alcremie:     'マホイップ',
  Polteageist:  'ポットデス',
  Eiscue:       'コオリッポ',
  Applin:       'カジッチュ',
  // Gen 9
  Miraidon:     'ミライドン',
  Tinkaton:     'デカヌチャン',
  Pawmot:       'パーモット',
}

// --- ユーティリティ ---

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]
}


/** "YYYY-MM-DD" → "YYYY.MM.DD" */
function formatDate(iso: string): string {
  return iso.replace(/-/g, '.')
}

// --- FilterChip ---

function FilterChip({
  label,
  active,
  onClick,
  chipFilterMode,
}: {
  label: string
  active: boolean
  onClick: () => void
  /** undefined = OR 固定（常に緑）。感情/ボカロのみ 'OR'|'AND' を渡す */
  chipFilterMode?: 'OR' | 'AND'
}) {
  const isAnd = chipFilterMode === 'AND'
  const activeColor = isAnd ? '#f87171' : '#43d9bf'
  const activeBg    = isAnd ? 'rgba(248,113,113,0.15)' : 'rgba(67,217,191,0.15)'
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1.5 rounded-full transition-colors"
      style={{
        backgroundColor: active ? activeBg : 'rgba(255,255,255,0.10)',
        border: `1px solid ${active ? activeColor : 'rgba(255,255,255,0.22)'}`,
        color: active ? activeColor : 'rgba(255,255,255,0.80)',
      }}
    >
      {label}
    </button>
  )
}

// --- タグバッジ共通コンポーネント ---

function GradeBadge({ grade }: { grade: EvalGrade }) {
  const isHall = grade === '殿堂入り'
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{
        border: `1px solid ${isHall ? '#fee02380' : '#43d9bf50'}`,
        color: isHall ? '#fee023' : '#43d9bf',
        backgroundColor: isHall ? '#fee02314' : '#43d9bf14',
      }}
    >
      {isHall ? '★ 殿堂入り' : '✓ 名曲'}
    </span>
  )
}

function NewBadge() {
  return (
    <span
      className="text-xs px-1.5 py-0.5 rounded font-bold"
      style={{ backgroundColor: '#fee023', color: '#000000' }}
    >
      NEW
    </span>
  )
}

// --- SongCard (グリッドビュー) ---

function SongCard({
  song,
  isActive,
  onToggle,
}: {
  song: Song
  isActive: boolean
  onToggle: () => void
}) {
  return (
    <div id={`song-${song.youtube_id}`} className={`song-card rounded-2xl flex flex-col${isActive ? ' is-active' : ''}${isNewSong(song) ? ' is-new' : ''}`}>
      {/* サムネ / プレーヤー */}
      <div className="relative w-full aspect-video shrink-0">
        {isActive ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${song.youtube_id}?autoplay=1`}
            title={song.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <button
            onClick={onToggle}
            className="w-full h-full relative group block"
            aria-label={`${song.title} を再生`}
          >
            <Image
              src={`https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`}
              alt={song.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl ml-0.5">▶</span>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* 情報エリア */}
      <div className="px-4 py-3 space-y-2 flex-1">
        {/* タイトル・アーティスト feat. */}
        <div>
          <p className="text-sm font-bold text-white leading-snug">{song.title}</p>
          <p className="text-xs text-volt-muted mt-0.5">
            {song.artist}{buildFeatStr(song)}
          </p>
          {song.release_date && (
            <p className="text-xs mt-0.5" style={{ color: '#8891a4' }}>
              {formatDate(song.release_date)}
            </p>
          )}
        </div>

        {/* タグ（新曲・グレード・feels・登場ポケモン） */}
        <div className="flex flex-wrap gap-1">
          {isNewSong(song) && <NewBadge />}
          {song.grade && <GradeBadge grade={song.grade} />}
          {song.feels.slice(0, 2).map(f => (
            <span
              key={f}
              className="text-xs px-2 py-0.5 rounded-full border border-volt-cyan/25 text-volt-cyan/60"
            >
              {FEEL_LABEL[f]}
            </span>
          ))}
          {song.pokemon_names.map(p => (
            <span
              key={p}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ border: '1px solid #c084fc40', color: '#c084fc99', backgroundColor: '#c084fc0a' }}
            >
              {POKEMON_JP[p] ?? p}
            </span>
          ))}
        </div>

        {/* リンク / 閉じる */}
        <div className="flex items-center justify-between pt-0.5 gap-2">
          <SongLinkButtons youtubeId={song.youtube_id} officialUrl={song.official_url} />
          {isActive && (
            <button
              onClick={onToggle}
              className="shrink-0 text-xs text-volt-muted hover:text-white/60 transition-colors"
            >
              ✕ 閉じる
            </button>
          )}
        </div>

        {/* 曲紹介 */}
        <SongIntro intro={song.intro} />
      </div>
    </div>
  )
}

// --- SongRow (リストビュー) ---

function SongRow({
  song,
  isActive,
  onToggle,
  onShowIntro,
}: {
  song: Song
  isActive: boolean
  onToggle: () => void
  onShowIntro: () => void
}) {
  return (
    <div id={`song-${song.youtube_id}`} className={`song-card rounded-xl${isActive ? ' is-active' : ''}${isNewSong(song) ? ' is-new' : ''}`}>
      <div className="flex gap-3 items-center">
        {/* サムネ */}
        <div className="relative w-28 aspect-video shrink-0 overflow-hidden">
          {isActive ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${song.youtube_id}?autoplay=1`}
              title={song.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <button
              onClick={onToggle}
              className="w-full h-full relative group block"
              aria-label={`${song.title} を再生`}
            >
              <Image
                src={`https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`}
                alt={song.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-red-600/90 flex items-center justify-center">
                  <span className="text-white text-xs ml-0.5">▶</span>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* 情報 */}
        <div className="flex-1 min-w-0 py-2.5">
          <p className="text-sm font-bold text-white leading-snug truncate">{song.title}</p>
          <p className="text-xs text-volt-muted mt-0.5 truncate">
            {song.artist}{buildFeatStr(song)}
            {song.release_date && (
              <span className="ml-2" style={{ color: '#8891a4' }}>{formatDate(song.release_date)}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {isNewSong(song) && <NewBadge />}
            {song.grade && <GradeBadge grade={song.grade} />}
            {song.feels.slice(0, 2).map(f => (
              <span key={f} className="text-xs px-2 py-0.5 rounded-full border border-volt-cyan/25 text-volt-cyan/60">
                {FEEL_LABEL[f]}
              </span>
            ))}
            {song.pokemon_names.map(p => (
              <span
                key={p}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ border: '1px solid #c084fc40', color: '#c084fc99', backgroundColor: '#c084fc0a' }}
              >
                {POKEMON_JP[p] ?? p}
              </span>
            ))}
          </div>
          <div className="mt-2">
            <SongLinkButtons youtubeId={song.youtube_id} officialUrl={song.official_url} />
          </div>
          {song.intro && (
            <button
              onClick={onShowIntro}
              className="inline-flex items-center gap-1 mt-1 text-xs px-2.5 py-1.5 rounded-lg border border-volt-yellow/30 text-volt-yellow/70 hover:border-volt-yellow/50 hover:text-volt-yellow transition-colors"
            >
              <span className="text-[10px]">▶</span>
              曲紹介を見る
            </button>
          )}
        </div>

        {/* 閉じるボタン */}
        <div className="shrink-0 pr-4 flex items-center">
          {isActive && (
            <button onClick={onToggle} className="text-xs text-volt-muted hover:text-white/60 transition-colors">
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// --- メインコンポーネント ---

type SortMode = 'release_date' | 'title' | 'views'
type SortDir  = 'asc' | 'desc'

export default function SongsClient() {
  const [activeFeels,     setActiveFeels]     = useState<Feel[]>([])
  const [activeGrades,    setActiveGrades]    = useState<EvalGrade[]>([])
  const [activeVocaloids, setActiveVocaloids] = useState<string[]>([])
  const [activeGens,      setActiveGens]      = useState<PkmnGen[]>([])
  const [activeVideoId,   setActiveVideoId]   = useState<string | null>(null)
  const [viewMode,        setViewMode]        = useState<'grid' | 'list'>('grid')
  const [sortMode,        setSortMode]        = useState<SortMode>('release_date')
  const [sortDir,         setSortDir]         = useState<SortDir>('desc')
  const [panelOpen,       setPanelOpen]       = useState(false)
  const [filterMode,      setFilterMode]      = useState<'OR' | 'AND'>('OR')
  const [helpOpen,        setHelpOpen]        = useState<string | null>(null)
  const [showScrollTop,   setShowScrollTop]   = useState(false)
  const [introSong,       setIntroSong]       = useState<Song | null>(null)

  // パネル or モーダル表示中はボディスクロールをロック
  useEffect(() => {
    document.body.style.overflow = (panelOpen || introSong) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [panelOpen, introSong])

  // イントロモーダル Escape キー対応
  useEffect(() => {
    if (!introSong) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIntroSong(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [introSong])

  // スクロール量に応じて TOPへ戻るボタンを表示
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /** ソートモード変更時にデフォルト方向も設定 */
  function handleSortModeChange(mode: SortMode) {
    setSortMode(mode)
    if (mode === 'title') setSortDir('asc')
    else setSortDir('desc')
  }

  const filtered = useMemo(() => {
    return SONGS.filter(song => {
      if (activeFeels.length > 0) {
        const match = filterMode === 'OR'
          ? activeFeels.some(f => song.feels.includes(f))
          : activeFeels.every(f => song.feels.includes(f))
        if (!match) return false
      }
      if (activeGrades.length > 0 && (song.grade === undefined || !activeGrades.includes(song.grade))) return false
      if (activeVocaloids.length > 0) {
        const match = filterMode === 'OR'
          ? activeVocaloids.some(v => song.vocaloids.includes(v))
          : activeVocaloids.every(v => song.vocaloids.includes(v))
        if (!match) return false
      }
      if (activeGens.length > 0 && (song.pokemon_gen === null || !activeGens.includes(song.pokemon_gen))) return false
      return true
    })
  }, [activeFeels, activeGrades, activeVocaloids, activeGens, filterMode])

  const sorted = useMemo(() => {
    const a = [...filtered]
    const dir = sortDir === 'asc' ? 1 : -1
    if (sortMode === 'title') {
      a.sort((x, y) => dir * x.title.localeCompare(y.title, 'ja'))
    } else if (sortMode === 'views') {
      a.sort((x, y) => dir * (x.approx_views - y.approx_views))
    } else {
      a.sort((x, y) => dir * (x.release_date ?? '').localeCompare(y.release_date ?? ''))
    }
    return a
  }, [filtered, sortMode, sortDir])

  const hasFilter =
    activeFeels.length > 0 || activeGrades.length > 0 ||
    activeVocaloids.length > 0 || activeGens.length > 0

  const filterCount =
    activeFeels.length + activeGrades.length + activeVocaloids.length + activeGens.length

  /** フィルタ or ソートがデフォルトから変更されているか */
  const hasAnyChange = hasFilter || sortMode !== 'release_date' || sortDir !== 'desc'

  function resetAll() {
    setActiveFeels([])
    setActiveGrades([])
    setActiveVocaloids([])
    setActiveGens([])
    setSortMode('release_date')
    setSortDir('desc')
  }

  function toggleHelp(key: string) {
    setHelpOpen(prev => prev === key ? null : key)
  }

  const isZeroResult = filtered.length === 0

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0e0c00 0%, #00110e 100%)' }}
    >
      {/* 背景グリッド */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(67,217,191,0.07) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(67,217,191,0.07) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 48px',
        }}
      />

      {/* 浮遊ドット + ホタル */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {([
          { x: 5,  y: 10, r: 1.5, color: '#43d9bf', dur: 13, delay: 0 },
          { x: 93, y: 7,  r: 1,   color: '#fee023', dur: 12, delay: -2.8 },
          { x: 8,  y: 42, r: 1,   color: '#43d9bf', dur: 11, delay: -5.5 },
          { x: 95, y: 35, r: 1.5, color: '#fee023', dur: 14, delay: -1.2 },
          { x: 4,  y: 68, r: 1,   color: '#43d9bf', dur: 15, delay: -8.0 },
          { x: 92, y: 75, r: 1.5, color: '#fee023', dur: 10, delay: -3.9 },
        ] as const).map((d, i) => (
          <circle
            key={`dot-${i}`}
            className="svg-particle"
            cx={`${d.x}%`} cy={`${d.y}%`} r={d.r} fill={d.color} opacity={0.55}
            style={{
              animation: `${(['dot-float-a', 'dot-float-b', 'dot-float-c'] as const)[i % 3]} ${d.dur}s ease-in-out infinite`,
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}
        {([
          { x: 7,  y: 20, r: 3,   color: '#43d9bf', dur: 7, delay: 0 },
          { x: 92, y: 15, r: 3.5, color: '#fee023', dur: 6, delay: -2.0 },
          { x: 4,  y: 55, r: 2.5, color: '#43d9bf', dur: 8, delay: -4.3 },
        ] as const).map((f, i) => (
          <circle
            key={`ff-${i}`}
            className="svg-particle"
            cx={`${f.x}%`} cy={`${f.y}%`} r={f.r} fill={f.color}
            style={{
              animation: `firefly-pulse ${f.dur}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </svg>

      {/* コンテンツ */}
      <div className="relative z-10">

        {/* ヘッダー */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6">
          <div className="inline-flex flex-col items-start gap-1">
            <Link href="/" className="group">
              <Image
                src="/logos/pv18_logo_header_w400.png"
                alt="PersonaVOLT18"
                width={200}
                height={42}
                className="opacity-75 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="flex items-center gap-1.5 text-xs tracking-widest">
              <Link href="/" className="hover:underline transition-colors" style={{ color: '#43d9bf' }}>トップ</Link>
              <span style={{ color: '#43d9bf', opacity: 0.35 }}>/</span>
              <span style={{ color: '#43d9bf', opacity: 0.5 }}>全曲一覧</span>
            </p>
          </div>
          <p className="text-sm text-volt-muted mt-4">
            Project VOLTAGE 全{SONGS.length}曲 — タグで絞り込めます
          </p>
          <div className="h-px mt-4 bg-linear-to-r from-volt-yellow via-volt-cyan to-transparent" />
        </div>

        {/* スティッキーバー（常時1行） */}
        <div
          className="sticky top-0 z-20"
          style={{
            borderBottom: '1px solid #2a2a2a',
            backgroundColor: 'rgba(14,12,0,0.92)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
            {/* 左: 件数 */}
            <span className="text-xs text-volt-muted">
              {filtered.length} / {SONGS.length} 曲
            </span>
            {/* 右: リセット（変更時のみ）+ フィルタ */}
            <div className="flex items-center gap-2">
              {hasAnyChange && (
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1 text-xs rounded-full px-3 py-1.5 transition-colors"
                  style={{
                    backgroundColor: 'rgba(56,189,248,0.12)',
                    border: '1px solid rgba(56,189,248,0.40)',
                    color: '#38bdf8',
                  }}
                >
                  ↺ リセット
                </button>
              )}
              <button
                onClick={() => setPanelOpen(true)}
                className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 transition-colors"
                style={{
                  backgroundColor: hasFilter ? 'rgba(67,217,191,0.12)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${hasFilter ? '#43d9bf80' : 'rgba(255,255,255,0.20)'}`,
                  color: hasFilter ? '#43d9bf' : 'rgba(255,255,255,0.80)',
                }}
              >
                <svg width="13" height="10" viewBox="0 0 13 10" fill="currentColor">
                  <rect x="0" y="0" width="13" height="1.5" rx="0.75"/>
                  <rect x="2" y="4" width="9" height="1.5" rx="0.75"/>
                  <rect x="4" y="8" width="5" height="1.5" rx="0.75"/>
                </svg>
                絞り込み{filterCount > 0 ? ` (${filterCount})` : ''}
              </button>
            </div>
          </div>
        </div>

        {/* カード / リスト */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">

          {/* ソート + ビュー切り替え行 */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs" style={{ color: '#f87171' }}>
              🔊 音量注意！
            </p>
            <div className="flex items-center gap-2">
              {/* ソート */}
              <select
                value={sortMode}
                onChange={e => handleSortModeChange(e.target.value as SortMode)}
                className="text-xs rounded px-2 py-0.5 outline-hidden"
                style={{
                  backgroundColor: '#ffffff08',
                  border: '1px solid #2a2a2a',
                  color: '#ffffff80',
                }}
              >
                <option value="release_date">リリース日</option>
                <option value="title">タイトル</option>
                <option value="views">再生数</option>
              </select>
              {/* 降順・昇順トグル */}
              <button
                onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                title={sortDir === 'asc' ? '昇順 → クリックで降順' : '降順 → クリックで昇順'}
                className="text-xs w-6 h-[22px] rounded flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: '#ffffff08',
                  border: `1px solid ${sortDir === 'asc' ? '#4ade8055' : '#fb923c55'}`,
                  color: sortDir === 'asc' ? '#4ade80' : '#fb923c',
                  cursor: 'pointer',
                }}
              >
                {sortDir === 'asc' ? '▲' : '▼'}
              </button>
              {/* ビュー切り替え */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  title="グリッド表示"
                  className="p-1 rounded transition-colors"
                  style={{ color: viewMode === 'grid' ? '#43d9bf' : '#ffffff40' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="0" y="0" width="6" height="6" rx="1"/>
                    <rect x="8" y="0" width="6" height="6" rx="1"/>
                    <rect x="0" y="8" width="6" height="6" rx="1"/>
                    <rect x="8" y="8" width="6" height="6" rx="1"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  title="リスト表示"
                  className="p-1 rounded transition-colors"
                  style={{ color: viewMode === 'list' ? '#43d9bf' : '#ffffff40' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="0" y="1" width="14" height="3" rx="1"/>
                    <rect x="0" y="6" width="14" height="3" rx="1"/>
                    <rect x="0" y="11" width="14" height="3" rx="1"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 曲一覧 */}
          {sorted.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <p className="text-volt-muted text-sm">条件に合う曲が見つかりませんでした</p>
              <button
                onClick={resetAll}
                className="text-xs text-volt-cyan hover:underline underline-offset-2"
              >
                絞り込みをリセット
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map(song => (
                <SongCard
                  key={song.id}
                  song={song}
                  isActive={activeVideoId === song.youtube_id}
                  onToggle={() =>
                    setActiveVideoId(prev =>
                      prev === song.youtube_id ? null : song.youtube_id
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sorted.map(song => (
                <SongRow
                  key={song.id}
                  song={song}
                  isActive={activeVideoId === song.youtube_id}
                  onToggle={() =>
                    setActiveVideoId(prev =>
                      prev === song.youtube_id ? null : song.youtube_id
                    )
                  }
                  onShowIntro={() => setIntroSong(song)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ━━━ フィルタパネル ━━━ */}
      {panelOpen && (
        <>
          {/* バックドロップ */}
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
            onClick={() => setPanelOpen(false)}
          />

          {/* パネル本体 */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[20px] sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-2xl sm:rounded-[20px]"
            style={{
              height: '90dvh',
              borderTop: '1px solid #3a3a3a',
              backgroundColor: 'rgba(12,10,0,0.97)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* パネルヘッダー */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid #2a2a2a' }}
            >
              {/* ドラッグハンドル風の上部インジケーター */}
              <div
                className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.20)' }}
              />
              <h2 className="text-sm font-semibold text-white">絞り込み</h2>
              <button
                onClick={() => setPanelOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.60)' }}
              >
                ✕
              </button>
            </div>

            {/* パネルボディ（スクロール可） */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

              {/* ？ヒント */}
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
                ？ をタップすると各項目の詳細説明を確認できます
              </p>

              {/* AND/OR トグル */}
              <div className="flex items-center gap-3">
                <span className="text-xs shrink-0" style={{ color: '#8891a4' }}>選択方式</span>
                <div className="flex rounded-full overflow-hidden" style={{ border: '1px solid #3a3a3a' }}>
                  <button
                    onClick={() => setFilterMode('OR')}
                    className="text-xs px-2.5 py-1 transition-colors"
                    style={{
                      backgroundColor: filterMode === 'OR' ? 'rgba(67,217,191,0.15)' : 'transparent',
                      color: filterMode === 'OR' ? '#43d9bf' : 'rgba(255,255,255,0.55)',
                      borderRight: '1px solid #3a3a3a',
                    }}
                  >
                    OR
                  </button>
                  <button
                    onClick={() => setFilterMode('AND')}
                    className="text-xs px-2.5 py-1 transition-colors"
                    style={{
                      backgroundColor: filterMode === 'AND' ? 'rgba(248,113,113,0.15)' : 'transparent',
                      color: filterMode === 'AND' ? '#f87171' : 'rgba(255,255,255,0.55)',
                    }}
                  >
                    AND
                  </button>
                </div>
                <span className="text-xs" style={{ color: '#8891a4' }}>感情/ボカロに適用</span>
              </div>

              {/* 感情/ムード（AND/OR 適用） */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>感情 / ムード</span>
                  <button
                    onClick={() => toggleHelp('feels')}
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      border: `1px solid ${helpOpen === 'feels' ? '#43d9bf60' : 'rgba(255,255,255,0.28)'}`,
                      color: helpOpen === 'feels' ? '#43d9bf' : 'rgba(255,255,255,0.45)',
                      fontSize: '10px',
                    }}
                  >
                    ?
                  </button>
                </div>
                {helpOpen === 'feels' && (
                  <p className="text-xs leading-relaxed px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' }}>
                    {CATEGORY_HELP.feels}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {ALL_FEELS.map(f => (
                    <FilterChip
                      key={f}
                      label={FEEL_LABEL[f]}
                      active={activeFeels.includes(f)}
                      onClick={() => setActiveFeels(toggleItem(activeFeels, f))}
                      chipFilterMode={filterMode}
                    />
                  ))}
                </div>
              </div>

              {/* ボカロ（AND/OR 適用） */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>ボカロ</span>
                  <button
                    onClick={() => toggleHelp('vocaloid')}
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      border: `1px solid ${helpOpen === 'vocaloid' ? '#43d9bf60' : 'rgba(255,255,255,0.28)'}`,
                      color: helpOpen === 'vocaloid' ? '#43d9bf' : 'rgba(255,255,255,0.45)',
                      fontSize: '10px',
                    }}
                  >
                    ?
                  </button>
                </div>
                {helpOpen === 'vocaloid' && (
                  <p className="text-xs leading-relaxed px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' }}>
                    {CATEGORY_HELP.vocaloid}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {ALL_VOCALOIDS.map(v => (
                    <FilterChip
                      key={v}
                      label={VOCALOID_LABEL[v] ?? v}
                      active={activeVocaloids.includes(v)}
                      onClick={() => setActiveVocaloids(toggleItem(activeVocaloids, v))}
                      chipFilterMode={filterMode}
                    />
                  ))}
                </div>
              </div>

              {/* 仕切り線（以下 OR のみ） */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.10)' }} />
                <span className="text-xs shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }}>以下は OR のみ</span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.10)' }} />
              </div>

              {/* 評価（OR 固定） */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>評価</span>
                  <button
                    onClick={() => toggleHelp('grade')}
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      border: `1px solid ${helpOpen === 'grade' ? '#43d9bf60' : 'rgba(255,255,255,0.28)'}`,
                      color: helpOpen === 'grade' ? '#43d9bf' : 'rgba(255,255,255,0.45)',
                      fontSize: '10px',
                    }}
                  >
                    ?
                  </button>
                </div>
                {helpOpen === 'grade' && (
                  <p className="text-xs leading-relaxed px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' }}>
                    {CATEGORY_HELP.grade}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {ALL_GRADES.map(g => (
                    <FilterChip
                      key={g}
                      label={g === '殿堂入り' ? '★ 殿堂入り' : '✓ 高評価/名曲'}
                      active={activeGrades.includes(g)}
                      onClick={() => setActiveGrades(toggleItem(activeGrades, g))}
                    />
                  ))}
                </div>
              </div>

              {/* 登場ポケモン世代（OR 固定） */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>登場ポケモン</span>
                  <button
                    onClick={() => toggleHelp('gen')}
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      border: `1px solid ${helpOpen === 'gen' ? '#43d9bf60' : 'rgba(255,255,255,0.28)'}`,
                      color: helpOpen === 'gen' ? '#43d9bf' : 'rgba(255,255,255,0.45)',
                      fontSize: '10px',
                    }}
                  >
                    ?
                  </button>
                </div>
                {helpOpen === 'gen' && (
                  <div className="text-xs leading-relaxed px-3 py-2 rounded-lg space-y-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' }}>
                    <p>{CATEGORY_HELP.gen}</p>
                    <div className="space-y-0.5 pt-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                      {ALL_GENS.map(g => (
                        <p key={g}>
                          <span style={{ color: 'rgba(255,255,255,0.45)' }}>{GEN_LABEL[g]}</span>
                          {' — '}
                          {GEN_GAMES_FULL[g]}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {ALL_GENS.map(g => (
                    <FilterChip
                      key={g}
                      label={GEN_LABEL[g]}
                      active={activeGens.includes(g)}
                      onClick={() => setActiveGens(toggleItem(activeGens, g))}
                    />
                  ))}
                </div>
                {activeGens.length > 0 && (
                  <p className="text-xs text-volt-muted">※ 世代情報のない曲は非表示になります</p>
                )}
              </div>

              {/* 代表ポケモン選定 info 行 */}
              <div className="space-y-2 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.70)' }}>代表ポケモンについて</span>
                  <button
                    onClick={() => toggleHelp('pokemon_criteria')}
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      border: `1px solid ${helpOpen === 'pokemon_criteria' ? '#43d9bf60' : 'rgba(255,255,255,0.28)'}`,
                      color: helpOpen === 'pokemon_criteria' ? '#43d9bf' : 'rgba(255,255,255,0.45)',
                      fontSize: '10px',
                    }}
                  >
                    ?
                  </button>
                </div>
                {helpOpen === 'pokemon_criteria' && (
                  <p className="text-xs leading-relaxed px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' }}>
                    {CATEGORY_HELP.pokemon_criteria}
                  </p>
                )}
              </div>

            </div>

            {/* パネルフッター */}
            <div
              className="shrink-0 px-5 py-4"
              style={{ borderTop: '1px solid #2a2a2a' }}
            >
              {/* 0件警告 */}
              {isZeroResult && hasFilter && (
                <p className="text-xs mb-3 text-center" style={{ color: '#fb923c' }}>
                  ⚠ この条件だと対象曲が 0 件になります — 条件を変えてみてください
                </p>
              )}
              <div className="flex items-center gap-3">
                {/* リセット */}
                <button
                  onClick={resetAll}
                  className="flex-1 py-2.5 rounded-xl text-sm transition-colors"
                  style={{
                    backgroundColor: hasAnyChange ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${hasAnyChange ? 'rgba(56,189,248,0.40)' : 'rgba(255,255,255,0.14)'}`,
                    color: hasAnyChange ? '#38bdf8' : 'rgba(255,255,255,0.65)',
                  }}
                >
                  ↺ リセット
                </button>
                {/* 適用 / 0件警告 */}
                <button
                  onClick={() => setPanelOpen(false)}
                  className="flex-[2] py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: isZeroResult && hasFilter
                      ? 'rgba(251,146,60,0.15)'
                      : 'rgba(67,217,191,0.15)',
                    border: `1px solid ${isZeroResult && hasFilter ? '#fb923c80' : '#43d9bf'}`,
                    color: isZeroResult && hasFilter ? '#fb923c' : '#43d9bf',
                  }}
                >
                  {isZeroResult && hasFilter
                    ? '⚠ このまま閉じる'
                    : `適用する（${filtered.length} 曲）`
                  }
                </button>
              </div>
              {/* レコメンド誘導 */}
              <Link
                href="/recommend"
                onClick={() => setPanelOpen(false)}
                className="block text-center text-xs py-2 mt-1 rounded-xl transition-colors"
                style={{
                  backgroundColor: 'rgba(254,224,35,0.06)',
                  border: '1px solid rgba(254,224,35,0.20)',
                  color: 'rgba(254,224,35,0.65)',
                }}
              >
                🎵 楽曲レコメンドを使ってみませんか？ →
              </Link>
            </div>

          </div>
        </>
      )}

      {/* TOPへ戻るフローティングボタン */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed z-30 flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold shadow-lg transition-all hover:opacity-90 active:scale-95"
          style={{
            bottom: activeVideoId ? '7.5rem' : '4.5rem',
            right: '1.25rem',
            backgroundColor: 'rgba(14,12,0,0.92)',
            border: '1px solid #8891a4',
            color: '#8891a4',
            backdropFilter: 'blur(8px)',
          }}
        >
          ▲ TOPへ
        </button>
      )}

      {/* 再生中の曲に戻るフローティングボタン */}
      {activeVideoId && (
        <button
          onClick={() =>
            document.getElementById(`song-${activeVideoId}`)
              ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          className="fixed z-30 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold shadow-lg transition-all hover:opacity-90 active:scale-95"
          style={{
            bottom: '4.5rem',
            right: '1.25rem',
            backgroundColor: 'rgba(14,12,0,0.92)',
            border: '1px solid #43d9bf',
            color: '#43d9bf',
            backdropFilter: 'blur(8px)',
          }}
        >
          ▶ 再生中の曲に戻る
        </button>
      )}
      {/* ━━━ 曲紹介モーダル（リスト表示用） ━━━ */}
      {introSong && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setIntroSong(null)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative bg-volt-surface border border-volt-edge rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[70vh] overflow-y-auto p-5 space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <p className="font-bold text-white text-sm">{introSong.title}</p>
              <button
                onClick={() => setIntroSong(null)}
                className="text-volt-muted hover:text-white text-xs shrink-0 ml-2"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-volt-muted">{introSong.artist}</p>
            <div className="space-y-2 pt-1">
              {introSong.intro!.split('\n\n').filter(Boolean).map((p, i) => (
                <p key={i} className="text-xs text-white/70 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
