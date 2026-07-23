import { ScaleIcon } from "lucide-react"

type LicenseNoticeProps = {
  type?: "cc-by-nc-sa" | "cc-by" | "all-rights"
  author?: string
}

const LICENSES = {
  "cc-by-nc-sa": {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh",
    summary: "署名-非商业性使用-相同方式共享",
    description: "您可以自由地共享和改编本作品，但须署名作者、不得用于商业目的，且需以相同方式共享。",
  },
  "cc-by": {
    name: "CC BY 4.0",
    url: "https://creativecommons.org/licenses/by/4.0/deed.zh",
    summary: "署名",
    description: "您可以自由地共享和改编本作品，但须署名作者。",
  },
  "all-rights": {
    name: "All Rights Reserved",
    url: "",
    summary: "保留所有权利",
    description: "未经作者许可，禁止转载、复制或用于任何商业用途。",
  },
}

export function LicenseNotice({ type = "cc-by-nc-sa", author }: LicenseNoticeProps) {
  const license = LICENSES[type]

  return (
    <div className="not-prose my-8 rounded-xl border border-border bg-muted/50 p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <ScaleIcon className="size-4 text-primary" />
        </div>
        <div className="min-w-0 space-y-2">
          {/* Title */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={license.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:underline"
            >
              {license.name}
            </a>
            <span className="rounded bg-muted-foreground/15 px-2 py-0.5 text-xs text-muted-foreground">
              {license.summary}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {license.description}
          </p>

          {/* Author */}
          {author && (
            <p className="text-xs text-muted-foreground">
              作者：{author}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
