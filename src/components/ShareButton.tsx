"use client";

import { useCallback, useState } from "react";
import { buildResultShareText } from "@/lib/shareConfig";

interface Props {
  typeLabel: string;
  resultUrl: string;
}

/**
 * ShareButton — generates an X (Twitter) share link and a copy-URL button.
 */
export function ShareButton({ typeLabel, resultUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const shareText = buildResultShareText(typeLabel);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(resultUrl)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(resultUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt("以下のURLをコピーしてください", resultUrl);
    }
  }, [resultUrl]);

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 btn-primary bg-volt-surface text-white border border-volt-cyan/50 hover:bg-volt-edge transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
        X でシェア
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className={`flex items-center gap-2 btn-primary transition-colors ${
          copied
            ? "bg-volt-cyan/20 text-volt-cyan border border-volt-cyan/30"
            : "bg-volt-surface text-white/80 border border-volt-cyan/50 hover:bg-volt-edge"
        }`}
      >
        <span aria-live="polite">
          {copied ? "✓ コピーしました！" : "URLをコピー"}
        </span>
      </button>
    </div>
  );
}
