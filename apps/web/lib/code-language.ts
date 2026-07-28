export const CODE_LANGUAGE_OPTIONS = {
  typescript: { label: "TypeScript", comment: "//" },
  javascript: { label: "JavaScript", comment: "//" },
  css: { label: "CSS", comment: "/*" },
  html: { label: "HTML", comment: "<!--" },
  python: { label: "Python", comment: "#" },
  bash: { label: "Shell", comment: "#" },
  markdown: { label: "Markdown", comment: "<!--" },
} as const

export type CodeLanguage = keyof typeof CODE_LANGUAGE_OPTIONS
