import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react'
import { QuizFlow } from './QuizFlow'
import type { Question } from '@/types/quiz'

// テスト間で DOM をリセット
afterEach(cleanup)

// --- Next.js モック ---

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

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

vi.mock('@/lib/answerSession', () => ({
  answerSession: { save: vi.fn() },
}))

// --- テスト用データ ---
// 2問構成: 選択肢クリックで自動進行（次へボタンなし）

const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'テスト用の1問目です',
    options: [
      { id: 'q1a', text: '選択肢Ａ', scoreMap: {} },
      { id: 'q1b', text: '選択肢Ｂ', scoreMap: {} },
      { id: 'q1c', text: '選択肢Ｃ', scoreMap: {} },
    ],
  },
  {
    id: 'q2',
    text: 'テスト用の2問目です',
    options: [
      { id: 'q2a', text: '選択肢Ｘ', scoreMap: {} },
      { id: 'q2b', text: '選択肢Ｙ', scoreMap: {} },
    ],
  },
]

// --- テスト ---

describe('QuizFlow', () => {
  it('初期レンダリング: 1問目・進捗バー・選択肢が描画される（スナップショット）', () => {
    const { container } = render(<QuizFlow questions={MOCK_QUESTIONS} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('進捗バーに正しい ARIA 属性が付与される', () => {
    render(<QuizFlow questions={MOCK_QUESTIONS} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.getAttribute('aria-valuenow')).toBe('1')
    expect(bar.getAttribute('aria-valuemin')).toBe('1')
    expect(bar.getAttribute('aria-valuemax')).toBe(String(MOCK_QUESTIONS.length))
  })

  it('選択肢が radiogroup として描画され、件数が一致する', () => {
    render(<QuizFlow questions={MOCK_QUESTIONS} />)
    screen.getByRole('radiogroup') // 存在しなければ throw
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(MOCK_QUESTIONS[0].options.length)
  })

  it('進捗テキストに「質問 1 / N」が含まれる', () => {
    render(<QuizFlow questions={MOCK_QUESTIONS} />)
    screen.getByText(/質問 1/)
  })

  it('1問目では「戻る」ボタンが表示されない', () => {
    render(<QuizFlow questions={MOCK_QUESTIONS} />)
    expect(screen.queryByText('← 戻る')).toBeNull()
  })

  it('2問目では「戻る」ボタンが表示され、クリックすると1問目に戻る', () => {
    vi.useFakeTimers()
    try {
      render(<QuizFlow questions={MOCK_QUESTIONS} />)

      // 1問目で選択肢をクリック → 300ms後に2問目へ
      fireEvent.click(screen.getByText('選択肢Ａ'))
      act(() => { vi.advanceTimersByTime(300) })

      // 2問目に進んでいることを確認
      screen.getByText(/質問 2/)
      expect(screen.getByText('← 戻る')).toBeDefined()

      // 戻るをクリック → 150ms後に1問目に戻る
      fireEvent.click(screen.getByText('← 戻る'))
      act(() => { vi.advanceTimersByTime(150) })
      screen.getByText(/質問 1/)
      expect(screen.queryByText('← 戻る')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })
})
