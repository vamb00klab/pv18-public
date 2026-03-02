import Link from "next/link";

const GRADIENT = "linear-gradient(135deg, #fee023, #43d9bf)";

interface GradientLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/** Gradient-filled link button (volt-yellow → volt-cyan). Black text on gradient background. */
export function GradientLink({ href, children, className = "" }: GradientLinkProps) {
  return (
    <Link
      href={href}
      className={`block w-full btn-primary text-black text-center transition-opacity hover:opacity-90 ${className}`}
      style={{ background: GRADIENT }}
    >
      {children}
    </Link>
  );
}

/** Gradient-filled button (volt-yellow → volt-cyan). Black text on gradient background. */
export function GradientButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      {...rest}
      className={`w-full btn-primary text-black text-center transition-opacity hover:opacity-90 ${className}`}
      style={{ background: GRADIENT }}
    >
      {children}
    </button>
  );
}

/** Gradient-bordered link button. 1px gradient outline with dark interior. */
export function GradientBorderLink({ href, children, className = "" }: GradientLinkProps) {
  return (
    <div className="p-px rounded-xl w-full" style={{ background: GRADIENT }}>
      <Link
        href={href}
        className={`flex items-center justify-center gap-1.5 btn-primary bg-volt-surface hover:bg-[#1a1a1a] text-white transition-colors ${className}`}
      >
        {children}
      </Link>
    </div>
  );
}
