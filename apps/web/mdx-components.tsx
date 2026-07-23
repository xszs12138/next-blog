import type { MDXComponents } from "mdx/types"
import Image from "next/image"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="mt-10 mb-4 text-3xl font-bold tracking-tight"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="mt-8 mb-3 text-2xl font-semibold tracking-tight"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="mt-6 mb-2 text-xl font-semibold"
        {...props}
      />
    ),
    h4: (props) => (
      <h4 className="mt-5 mb-2 text-lg font-medium" {...props} />
    ),
    p: (props) => <p className="mb-4 leading-7" {...props} />,
    ul: (props) => (
      <ul className="mb-4 list-disc pl-6 space-y-1" {...props} />
    ),
    ol: (props) => (
      <ol className="mb-4 list-decimal pl-6 space-y-1" {...props} />
    ),
    li: (props) => <li className="leading-7" {...props} />,
    a: (props) => (
      <a
        className="font-medium underline underline-offset-4 transition-colors hover:text-primary"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="mb-4 border-l-2 border-border pl-4 italic text-muted-foreground"
        {...props}
      />
    ),
    hr: (props) => <hr className="my-8 border-border" {...props} />,
    pre: (props) => (
      <pre
        className="mb-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm"
        {...props}
      />
    ),
    code: (props) => (
      <code
        className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
        {...props}
      />
    ),
    table: (props) => (
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm" {...props} />
      </div>
    ),
    th: (props) => (
      <th
        className="border border-border px-4 py-2 text-left font-medium"
        {...props}
      />
    ),
    td: (props) => (
      <td className="border border-border px-4 py-2" {...props} />
    ),
    img: (props) => (
      <Image
        className="my-6 rounded-lg border border-border"
        alt={props.alt ?? ""}
        src={props.src ?? ""}
        width={720}
        height={400}
        {...props}
      />
    ),
    ...components,
  }
}
