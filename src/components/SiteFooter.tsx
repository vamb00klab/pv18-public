import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="border-t border-volt-edge mt-auto">
      <div className="max-w-2xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-volt-muted">
        <span>非公式ファンサイト — Project VOLTAGE Fan App（PersonaVOLT18）</span>
        <Link
          href="/about"
          className="hover:text-white/60 transition-colors underline underline-offset-2"
        >
          このサイトについて
        </Link>
      </div>
    </footer>
  )
}
