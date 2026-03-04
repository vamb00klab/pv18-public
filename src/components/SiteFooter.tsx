"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SiteFooter() {
  const isTop = usePathname() === "/"

  return (
    <footer className="border-t border-volt-edge mt-auto">
      <div className="max-w-2xl mx-auto px-6 py-5 space-y-3 text-xs text-volt-muted">
        {!isTop && (
          <div className="text-center">
            <Link
              href="/"
              className="hover:text-white/60 transition-colors"
            >
              ← トップへ戻る
            </Link>
          </div>
        )}
        <div className="text-center">
          <Link
            href="/about"
            className="hover:text-white/60 transition-colors underline underline-offset-2"
          >
            このサイトについて
          </Link>
        </div>
        <p className="text-center text-volt-muted/60">非公式ファンサイト — Project VOLTAGE Fan App（PersonaVOLT18）</p>
      </div>
    </footer>
  )
}
