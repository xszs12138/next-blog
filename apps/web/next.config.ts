import createMDX from "@next/mdx"
import { createRequire } from "node:module"
import type { NextConfig } from "next"

const require = createRequire(import.meta.url)

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bu.dusays.com",
      },
      {
        protocol: "https",
        hostname: "**.hdslb.com",
      },
    ],
  },
}

const withMDX = createMDX({
  options: {
    // Turbopack loader options must be serializable. Absolute paths also avoid
    // resolving plugins from the loader's internal working directory.
    remarkPlugins: [
      require.resolve("remark-frontmatter"),
      require.resolve("remark-gfm"),
    ],
    rehypePlugins: [
      require.resolve("rehype-slug"),
      require.resolve("rehype-highlight"),
    ],
  },
})

export default withMDX(nextConfig)
