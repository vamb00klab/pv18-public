import Link from "next/link"
import Image from "next/image"

type PageHeaderProps = {
  subLabel: React.ReactNode
}

/**
 * 全ページ共通ヘッダー
 * ロゴ（LP リンク付き）+ サブテキスト + スパークバーを統一レイアウトで表示
 */
export default function PageHeader({ subLabel }: PageHeaderProps) {
  return (
    <div className="text-center space-y-3">
      <div className="flex justify-center">
        <Link href="/">
          <Image
            src="/logos/pv18_logo_header_w400.png"
            alt="PersonaVOLT18"
            width={200}
            height={42}
            priority
          />
        </Link>
      </div>
      <p className="text-xs tracking-widest text-volt-muted">
        {subLabel}
      </p>
      <div
        className="volt-spark-bar mx-auto"
        style={{
          height: "1px",
          width: "80%",
          maxWidth: "300px",
          background: "linear-gradient(to right, transparent, #fee023 8%, #43d9bf 92%, transparent)",
        }}
      />
    </div>
  )
}
