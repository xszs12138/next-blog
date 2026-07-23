import Link from "next/link"
import Image from "next/image"

const PRESETS: Record<string, { icon: string; label: string }> = {
  nextjs: {
    icon: "https://nextjs.org/favicon.ico",
    label: "Next.js",
  },
  react: {
    icon: "https://react.dev/favicon.ico",
    label: "React",
  },
  github: {
    icon: "https://github.githubassets.com/favicons/favicon.svg",
    label: "GitHub",
  },
  typescript: {
    icon: "https://www.typescriptlang.org/favicon-32x32.png",
    label: "TypeScript",
  },
  tailwindcss: {
    icon: "https://tailwindcss.com/favicons/favicon.ico",
    label: "Tailwind CSS",
  },
  turborepo: {
    icon: "https://turbo.build/images/favicon-dark/favicon.ico",
    label: "Turborepo",
  },
  vercel: {
    icon: "https://vercel.com/favicon.ico",
    label: "Vercel",
  },
  shadcn: {
    icon: "https://ui.shadcn.com/favicon.ico",
    label: "shadcn/ui",
  },
  pnpm: {
    icon: "https://pnpm.io/img/favicon.png",
    label: "pnpm",
  },
}

type IconLinkProps = {
  href: string
  /** Preset icon key or custom icon URL */
  icon?: string
  children?: React.ReactNode
}

export function IconLink({ href, icon, children }: IconLinkProps) {
  const preset = icon ? PRESETS[icon] : undefined
  const iconSrc = preset?.icon ?? icon
  const label = children ?? preset?.label ?? href
  const isExternal = href.startsWith("http")

  const content = (
    <span className="inline-flex items-center gap-2 rounded-sm border border-border/60 bg-muted/30 px-2 py-1 text-sm font-medium transition-colors hover:bg-muted/60">
      {iconSrc && (
        <Image
          src={iconSrc}
          alt=""
          width={16}
          height={16}
          unoptimized
          className="size-4 shrink-0 rounded-sm"
        />
      )}
      <span>{label}</span>
    </span>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="not-prose inline-block">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className="not-prose inline-block">
      {content}
    </Link>
  )
}
