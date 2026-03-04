/**
 * /live ページ用静的データ・ユーティリティ
 *
 * EVENT_CONFIG, チェックリスト, Q&A, 公式リンク, カウントダウン計算, フェーズ判定
 */

import type { Song } from "@/types/song";

/* ── Event configuration ─────────────────────────────────────────── */

export const EVENT_CONFIG = {
  name: "ポケモン feat. 初音ミク VOLTAGE Live!",
  dates: [
    { date: "2026-03-20", dayLabel: "Day 1（3/20 金祝）" },
    { date: "2026-03-21", dayLabel: "Day 2（3/21 土）" },
    { date: "2026-03-22", dayLabel: "Day 3（3/22 日）" },
  ],
  firstShowStart: new Date("2026-03-20T12:00:00+09:00"),
  lastShowEnd: new Date("2026-03-22T21:00:00+09:00"),
  venue: "LaLa arena TOKYO-BAY",
  venueAddress: "千葉県船橋市浜町2-5-15",
  officialUrl: "https://www.project-voltage.jp/live2026/",
  officialX: "https://x.com/PokeMikuVOLTAGE",
  guidelineUrl: "https://www.project-voltage.jp/live2026/guideline.html",
  accessUrl: "https://lalaarenatokyo-bay.com/access/",
} as const;

/* ── Event phase ─────────────────────────────────────────────────── */

export type EventPhase = "before" | "today" | "during" | "after";

/**
 * Determine the current event phase. Pure function — SSR safe.
 * Takes `nowMs` as parameter to avoid calling Date.now() in render.
 */
export function getEventPhase(nowMs: number): EventPhase {
  const start = EVENT_CONFIG.firstShowStart.getTime();
  const end = EVENT_CONFIG.lastShowEnd.getTime();

  if (nowMs >= end) return "after";
  if (nowMs >= start) return "during";

  // Same calendar day in JST?
  const jstOffset = 9 * 60 * 60 * 1000;
  const jstNowDay = Math.floor((nowMs + jstOffset) / 86400000);
  const jstStartDay = Math.floor((start + jstOffset) / 86400000);
  if (jstNowDay === jstStartDay) return "today";

  return "before";
}

/* ── Countdown calculation ───────────────────────────────────────── */

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

/**
 * Calculate countdown breakdown from nowMs to targetMs.
 * Pure function — SSR safe.
 */
export function calculateCountdown(
  targetMs: number,
  nowMs: number,
): CountdownValues {
  const diff = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalMs: diff,
  };
}

/* ── Guideline highlights ──────────────────────────────────────── */

export interface GuidelinePoint {
  id: string;
  emoji: string;
  title: string;
  details: string[];
}

/** 公式ガイドライン（guideline.html）から抜粋した重要ポイント */
export const GUIDELINE_POINTS: GuidelinePoint[] = [
  {
    id: "penlight",
    emoji: "🔦",
    title: "ペンライト",
    details: [
      "1人2本まで（片手に1本ずつ）",
      "25cm以上・ボタン電池以外・改造/自作品は使用不可",
      "胸元までの高さで使用",
    ],
  },
  {
    id: "food-drink",
    emoji: "🥤",
    title: "飲食",
    details: [
      "客席での飲食は禁止（水分補給のみ可）",
      "飲み物は会場内売店で購入（外部持ち込み不可）",
      "会場内での飲酒は禁止",
    ],
  },
  {
    id: "camera",
    emoji: "📵",
    title: "撮影・録音",
    details: [
      "開演前・終演後含め全面禁止",
      "配信（リアルタイム含む）も禁止",
    ],
  },
  {
    id: "entry",
    emoji: "🎟️",
    title: "入場",
    details: [
      "本人確認の場合あり — 身分証明書を必ず持参",
      "再入場は原則不可",
      "開場10分前から整列開始予定",
    ],
  },
  {
    id: "manners",
    emoji: "⚠️",
    title: "マナー",
    details: [
      "ジャンプ・踏み台での観覧は禁止",
      "帽子・カチューシャは周囲の視界にご配慮を",
      "大型荷物・ベビーカーは預かり対象外",
    ],
  },
];

/* ── Checklist ───────────────────────────────────────────────────── */

export interface ChecklistItem {
  id: string;
  label: string;
  emoji: string;
  hint?: string;
  group: "essential" | "recommended";
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 必須
  { id: "ticket", label: "チケット（電子 or 紙）", emoji: "🎟️", hint: "スクショもバックアップに", group: "essential" },
  { id: "id", label: "身分証明書", emoji: "🪪", hint: "本人確認が実施されます", group: "essential" },
  { id: "phone", label: "スマホ（充電済み）", emoji: "📱", group: "essential" },
  // あると便利
  { id: "battery", label: "モバイルバッテリー", emoji: "🔋", group: "recommended" },
  { id: "penlight", label: "ペンライト", emoji: "🔦", hint: "1人2本まで / 25cm以下 / ボタン電池式のみ", group: "recommended" },
  { id: "water", label: "飲み物（会場内売店で購入）", emoji: "💧", hint: "外部からの持ち込み不可。客席は水分補給のみ", group: "recommended" },
  { id: "towel", label: "タオル", emoji: "🧣", group: "recommended" },
  { id: "cash", label: "現金（グッズ購入用）", emoji: "💰", group: "recommended" },
];

export const CHECKLIST_STORAGE_KEY = "pv18:live:checklist";

/* ── Setlist prediction ──────────────────────────────────────────── */

export interface SetlistPrediction {
  firstSong: string | null;
  lastSong: string | null;
  hypeSong: string | null;
  freeComment: string;
}

export const EMPTY_PREDICTION: SetlistPrediction = {
  firstSong: null,
  lastSong: null,
  hypeSong: null,
  freeComment: "",
};

export const SETLIST_STORAGE_KEY = "pv18:live:setlist";

/** 自由記述の最大文字数。X投稿上限(280)からテンプレ・最長曲名・ハッシュタグ・URL分を差し引いた安全値。 */
export const FREE_COMMENT_MAX = 130;

/**
 * Build the song options list for <select> elements.
 * Sorted by release_date descending (newest first), numbered in release order
 * (oldest = #1, newest = highest number).
 */
export function buildSongOptions(songs: readonly Song[]): { value: string; label: string }[] {
  // Sort ascending by release_date to assign numbers (oldest = 1)
  const sorted = [...songs].sort((a, b) =>
    (a.release_date ?? "").localeCompare(b.release_date ?? ""),
  );
  const numbered = sorted.map((s, i) => ({
    song: s,
    num: i + 1,
  }));
  // Return in descending order (newest first) for the dropdown
  const options = numbered.reverse().map(({ song, num }) => ({
    value: song.title,
    label: `#${num} ${song.title} / ${song.artist}`,
  }));
  // Special entries at the top
  const nextNum = sorted.length + 1;
  options.unshift(
    { value: `未発表曲 (#${nextNum})`, label: `#${nextNum}（未発表）` },
  );
  options.push(
    { value: "その他", label: "その他" },
  );
  return options;
}

/* ── Venue & nearby spots ─────────────────────────────────────────── */

/** Google Maps 検索 URL を生成 */
function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Google Maps embed URL（LaLa arena TOKYO-BAY — 公式埋め込みコード・place ID 指定） */
export const VENUE_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18852.623162952274!2d139.9764358315958!3d35.68219959637476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60187ff714cb1e67%3A0xadef695d04aff1d1!2sLaLa%20arena%20TOKYO-BAY!5e0!3m2!1sja!2sjp!4v1772592056223!5m2!1sja!2sjp";

/** Google Maps での会場リンク（タップ時に Maps アプリへ） */
export const VENUE_MAP_URL = mapsSearchUrl("LaLa arena TOKYO-BAY 千葉県船橋市浜町");

export interface AccessPoint {
  emoji: string;
  text: string;
}

export const ACCESS_POINTS: AccessPoint[] = [
  { emoji: "🚃", text: "JR南船橋駅（京葉線・武蔵野線）南口 徒歩約6分" },
  { emoji: "🚃", text: "京成 船橋競馬場駅 南口 徒歩約16分" },
  { emoji: "⚠️", text: "駐車場・駐輪場なし — 公共交通機関をご利用ください" },
];

export interface NearbySpot {
  id: string;
  emoji: string;
  name: string;
  detail: string;
  note?: string;
  mapUrl: string;
}

export const NEARBY_SPOTS: NearbySpot[] = [
  {
    id: "pokemon-center",
    emoji: "⚡",
    name: "ポケモンセンタートウキョーベイ",
    detail: "ららぽーと西館2F。ポケモングッズの聖地",
    note: "ライブ当日は大混雑が予想されます",
    mapUrl: mapsSearchUrl("ポケモンセンタートウキョーベイ ららぽーとTOKYO-BAY"),
  },
  {
    id: "lalaport",
    emoji: "🏬",
    name: "ららぽーとTOKYO-BAY",
    detail: "フードコート・スタバ2店舗・レストラン多数。2Fデッキでアリーナ直結",
    mapUrl: mapsSearchUrl("ららぽーとTOKYO-BAY"),
  },
  {
    id: "lalaterrace",
    emoji: "☕",
    name: "ららテラス TOKYO-BAY",
    detail: "南船橋駅直結。PRONTO・ガスト・ミスド等。2Fフードコートに電源席あり",
    mapUrl: mapsSearchUrl("ららテラスTOKYO-BAY 南船橋"),
  },
  {
    id: "kaikatsu",
    emoji: "🛋️",
    name: "快活CLUB 船橋競馬場駅前店",
    detail: "南船橋駅から徒歩約11分（京成船橋競馬場駅前）。24時間営業のネットカフェ",
    mapUrl: mapsSearchUrl("快活CLUB 船橋競馬場駅前店"),
  },
  {
    id: "coin-locker",
    emoji: "🔑",
    name: "コインロッカー（南船橋駅）",
    detail: "改札外 南階段下。小21個(400円) + 中12個(500円)。大型ロッカーなし",
    note: "ライブ日は早めの確保を。ららぽーと内にもロッカーあり（North Gate 1F が安い: 大200円/小100円）",
    mapUrl: mapsSearchUrl("南船橋駅"),
  },
  {
    id: "ikea",
    emoji: "🪑",
    name: "IKEA Tokyo-Bay",
    detail: "駅南口から徒歩約3分。レストラン・カフェあり。開演前の時間つぶしに",
    mapUrl: mapsSearchUrl("IKEA Tokyo-Bay 南船橋"),
  },
];

export interface ParkingInfo {
  emoji: string;
  title: string;
  details: string[];
}

export const PARKING_INFO: ParkingInfo[] = [
  {
    emoji: "🅿️",
    title: "駐車場",
    details: [
      "会場に駐車場はありません（公式案内）",
      "ららぽーと P10 が最寄り（最初の1時間無料・以降有料）",
      "ライブ日は周辺駐車場が大変混雑します。akippa 等で事前予約がおすすめ",
    ],
  },
  {
    emoji: "🚲",
    title: "駐輪場",
    details: [
      "会場に駐輪場はありません（公式案内）",
      "南船橋駅 市営駐輪場を利用（自転車 100円/回）",
    ],
  },
];

/* ── Official links ──────────────────────────────────────────────── */

export interface OfficialLink {
  label: string;
  url: string;
  description?: string;
}

export const OFFICIAL_LINKS: OfficialLink[] = [
  {
    label: "VOLTAGE Live! 公式サイト",
    url: EVENT_CONFIG.officialUrl,
    description: "日程・チケット・グッズ情報",
  },
  {
    label: "会場ガイドライン",
    url: EVENT_CONFIG.guidelineUrl,
    description: "ペンライト・飲食・撮影ルール等",
  },
  {
    label: "公式 X（@PokeMikuVOLTAGE）",
    url: EVENT_CONFIG.officialX,
    description: "最新情報はこちら",
  },
  {
    label: "Project VOLTAGE 公式サイト",
    url: "https://www.project-voltage.jp/",
    description: "楽曲・プロジェクト情報",
  },
];
