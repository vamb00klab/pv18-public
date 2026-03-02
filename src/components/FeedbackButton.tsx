'use client'

import { useState, useRef, useEffect } from 'react'

const ENDPOINT = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT ?? ''
const IS_DEV = process.env.NODE_ENV === 'development'

const CATEGORIES = [
  { value: 'bug',     label: 'バグ報告' },
  { value: 'request', label: '機能リクエスト' },
  { value: 'data',    label: 'データ・表記の誤り' },
  { value: 'other',   label: 'その他' },
] as const

type Category = typeof CATEGORIES[number]['value']
type Status = 'idle' | 'submitting' | 'success' | 'error'
type FloatState = 'minimal' | 'labeled'

function parseEnv() {
  const ua = navigator.userAgent
  const isTablet  = /iPad/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))
  const isMobile  = !isTablet && (/Mobi|Android|iPhone|iPod/i.test(ua) || window.innerWidth < 768)
  const device    = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

  let os = 'Unknown'
  if      (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS'
  else if (/Android/i.test(ua))          os = 'Android'
  else if (/Windows/i.test(ua))          os = 'Windows'
  else if (/Mac OS X/i.test(ua))         os = 'macOS'
  else if (/Linux/i.test(ua))            os = 'Linux'

  let browser = 'Unknown'
  if      (/SamsungBrowser/i.test(ua)) browser = 'Samsung'
  else if (/Edg\//i.test(ua))          browser = 'Edge'
  else if (/Firefox/i.test(ua))        browser = 'Firefox'
  else if (/Chrome/i.test(ua))         browser = 'Chrome'
  else if (/Safari/i.test(ua))         browser = 'Safari'

  return { device, os, browser, ua }
}

export default function FeedbackButton() {
  const [isOpen, setIsOpen]         = useState(false)
  const [floatState, setFloatState] = useState<FloatState>('minimal')
  const [category, setCategory]     = useState<Category>('bug')
  const [content, setContent]       = useState('')
  const [status, setStatus]         = useState<Status>('idle')
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  if (!ENDPOINT && !IS_DEV) return null

  const canSubmit = content.trim().length >= 10 && status === 'idle'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('submitting')
    // dev モードでエンドポイント未設定の場合はモック送信
    if (!ENDPOINT) {
      await new Promise(r => setTimeout(r, 800))
      setStatus('success')
      return
    }
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ category, content, page: window.location.pathname, ...parseEnv() }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  function handleFloatClick() {
    if (floatState === 'minimal') {
      setFloatState('labeled')
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current)
      revertTimerRef.current = setTimeout(() => setFloatState('minimal'), 3500)
    } else {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current)
      setFloatState('minimal')
      setIsOpen(true)
    }
  }

  function handleClose() {
    setIsOpen(false)
    closeTimerRef.current = setTimeout(() => { setStatus('idle'); setContent(''); setCategory('bug') }, 300)
  }

  function handleCloseRequest() {
    if (content.trim().length > 0 && status !== 'success') {
      if (!window.confirm('入力内容が消えますが、閉じますか？')) return
    }
    handleClose()
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target !== e.currentTarget) return
    // 入力中はバックドロップクリックで閉じない
    if (content.trim().length > 0 && status !== 'success') return
    handleClose()
  }

  return (
    <>
      {/* フロートボタン */}
      <button
        onClick={handleFloatClick}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: '#43d9bf',
          color: '#0e0c00',
          padding: floatState === 'minimal' ? '10px' : '10px 16px',
        }}
        aria-label="フィードバックを送る"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {floatState === 'labeled' && (
          <span className="flex flex-col items-start leading-none">
            <span className="text-xs font-bold">{IS_DEV && !ENDPOINT ? '[DEV] ' : ''}フィードバック</span>
            <span className="text-[10px] font-normal opacity-70 mt-0.5">もう一度で開く →</span>
          </span>
        )}
      </button>

      {/* バックドロップ + モーダル */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end p-5 sm:items-center sm:justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={handleBackdropClick}
        >
          <div
            className="w-full max-w-sm rounded-2xl shadow-2xl"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
          >
            {/* ヘッダー */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid #2a2a2a' }}
            >
              <span className="text-sm font-bold text-white">フィードバック</span>
              <button
                onClick={handleCloseRequest}
                className="text-lg leading-none text-white/40 hover:text-white/80 transition-colors"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            {/* コンテンツ */}
            {status === 'success' ? (
              <div className="px-5 py-10 text-center space-y-2">
                <p className="text-2xl">✓</p>
                <p className="text-sm font-bold text-white">送信しました</p>
                <p className="text-xs text-white/50">ご意見ありがとうございます。</p>
                <button
                  onClick={handleClose}
                  className="mt-4 text-xs text-volt-cyan hover:underline"
                >
                  閉じる
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                {/* カテゴリ */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider">カテゴリ</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map(({ value, label }) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-xs transition-colors"
                        style={{
                          backgroundColor: category === value ? '#43d9bf22' : '#ffffff08',
                          border: `1px solid ${category === value ? '#43d9bf' : '#2a2a2a'}`,
                          color: category === value ? '#43d9bf' : '#ffffff99',
                        }}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={value}
                          checked={category === value}
                          onChange={() => setCategory(value)}
                          className="sr-only"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* テキストエリア */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider">内容</p>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={5000}
                    rows={4}
                    placeholder="詳しく教えてください（10文字以上）..."
                    className="w-full resize-none rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-hidden transition-colors"
                    style={{
                      backgroundColor: '#ffffff08',
                      border: '1px solid #2a2a2a',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#43d9bf' }}
                    onBlur={(e) => { e.target.style.borderColor = '#2a2a2a' }}
                  />
                  <p className="text-right text-xs text-white/30">
                    {content.length} / 5,000
                  </p>
                </div>

                {/* エラー */}
                {status === 'error' && (
                  <p className="text-xs text-red-400">送信に失敗しました。もう一度お試しください。</p>
                )}

                {/* 送信ボタン */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full rounded-lg py-2.5 text-sm font-bold transition-opacity"
                  style={{
                    backgroundColor: canSubmit ? '#43d9bf' : '#43d9bf33',
                    color: '#0e0c00',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                  }}
                >
                  {status === 'submitting' ? '送信中...' : '送信する'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
