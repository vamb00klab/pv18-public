import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import RecommendPage from './page'

// テスト間で DOM をリセット
afterEach(cleanup)

// --- Next.js モック ---
// recommend/page.tsx は useRouter を使わない（step state で制御）。
// PageHeader が next/image・next/link を使うためモックが必要。

vi.mock('next/image', () => ({
  default: (props: { src: string; alt: string; width?: number; height?: number }) => (
    <img src={props.src} alt={props.alt} width={props.width} height={props.height} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

// --- テスト ---

describe('RecommendPage', () => {
  it('初期表示: Q1（感情選択）がレンダリングされる（スナップショット）', () => {
    const { container } = render(<RecommendPage />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Q1: 感情選択肢が 6 件描画される', () => {
    render(<RecommendPage />)
    // FEEL_OPTIONS: 感動・泣ける / 懐かしい / かわいい / かっこいい / チル・癒し / 疾走感・ノリ
    const feelButtons = screen.getAllByRole('button', {
      name: /感動|泣ける|懐かしい|かわいい|かっこいい|チル|癒し|疾走/,
    })
    expect(feelButtons.length).toBeGreaterThanOrEqual(6)
  })

  it('Q1: ステップ進捗にステップ番号（1〜5）が表示される', () => {
    render(<RecommendPage />)
    // pill インジケーターに各ステップ番号が表示される
    ;[1, 2, 3, 4, 5].forEach((n) => screen.getByText(String(n)))
  })

  it('Q1: 未選択時は「次へ」ボタンが disabled', () => {
    render(<RecommendPage />)
    // Q1 の次へボタンは feels 未選択（0件）のとき disabled
    const nextBtn = screen.getByRole('button', { name: /次へ/ })
    expect(nextBtn.hasAttribute('disabled')).toBe(true)
  })
})
