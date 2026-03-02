import { describe, it, expect } from "vitest"
import { selectQuestions } from "./selectQuestions"
import type { Question, QuestionConfig } from "@/types/quiz"

// ── ヘルパー: ミニマルな Question 生成 ──

function makeQ(id: string, category?: "daily" | "world"): Question {
  return {
    id,
    text: `Question ${id}`,
    options: [
      { id: `${id}a`, text: "A", scoreMap: {} },
      { id: `${id}b`, text: "B", scoreMap: {} },
      { id: `${id}c`, text: "C", scoreMap: {} },
    ],
    category,
  }
}

const DAILY_QS: Question[] = Array.from({ length: 12 }, (_, i) =>
  makeQ(`d${String(i + 1).padStart(2, "0")}`, "daily")
)
const WORLD_QS: Question[] = Array.from({ length: 10 }, (_, i) =>
  makeQ(`w${String(i + 1).padStart(2, "0")}`, "world")
)
const ALL_QS = [...DAILY_QS, ...WORLD_QS]

const CONFIG: QuestionConfig = { daily: 8, world: 7 }

// ── テスト ──

describe("selectQuestions", () => {
  it("config なしの場合は元の配列をそのまま返す", () => {
    const qs = [makeQ("q1"), makeQ("q2")]
    const result = selectQuestions(qs, undefined)
    expect(result).toBe(qs)
  })

  it("config 指定時に正しい件数を返す", () => {
    const result = selectQuestions(ALL_QS, CONFIG)
    expect(result).toHaveLength(CONFIG.daily + CONFIG.world)
  })

  it("daily が先頭、world が後続の順で並ぶ", () => {
    const result = selectQuestions(ALL_QS, CONFIG)
    const dailyPart = result.slice(0, CONFIG.daily)
    const worldPart = result.slice(CONFIG.daily)

    expect(dailyPart.every((q) => q.category === "daily")).toBe(true)
    expect(worldPart.every((q) => q.category === "world")).toBe(true)
  })

  it("同じ question が重複しない", () => {
    const result = selectQuestions(ALL_QS, CONFIG)
    const ids = result.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("各 question の options がシャッフルされている（元と異なる並び順が 50 回中に 1 回以上出る）", () => {
    const original = ALL_QS[0].options.map((o) => o.id)
    let diffFound = false
    for (let i = 0; i < 50; i++) {
      const result = selectQuestions(ALL_QS, CONFIG)
      const q = result.find((q) => q.id === ALL_QS[0].id)
      if (q) {
        const shuffledIds = q.options.map((o) => o.id)
        if (shuffledIds.join(",") !== original.join(",")) {
          diffFound = true
          break
        }
      }
    }
    expect(diffFound).toBe(true)
  })

  it("options の要素数は変わらない（シャッフル後も全選択肢を保持）", () => {
    const result = selectQuestions(ALL_QS, CONFIG)
    for (const q of result) {
      expect(q.options).toHaveLength(3)
    }
  })

  it("プールが config の指定数より少ない場合はプール全量を返す", () => {
    const smallPool = [makeQ("s1", "daily"), makeQ("s2", "daily")]
    const result = selectQuestions(smallPool, { daily: 5, world: 0 })
    expect(result).toHaveLength(2)
  })

  it("シャッフルによりランダム性がある（50 回実行で異なる順列が出現する）", () => {
    const orders = new Set<string>()
    for (let i = 0; i < 50; i++) {
      const result = selectQuestions(ALL_QS, CONFIG)
      orders.add(result.map((q) => q.id).join(","))
    }
    expect(orders.size).toBeGreaterThan(1)
  })
})
