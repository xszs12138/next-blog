"use client"

import { Fragment } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

const ROUTE_LABELS: Record<string, string> = {
  "/": "Home",
  "/blog": "Blog",
}

export function SiteHeader() {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)

  // Hide on home page
  if (pathname === "/") return null

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
        {/* Avatar */}
        <Link href="/" className="shrink-0">
          <Image
            src="https://bu.dusays.com/2026/02/15/69918a5bbfefa.webp"
            alt="Avatar"
            width={32}
            height={32}
            unoptimized
            className="size-8 rounded-full object-cover ring-1 ring-border"
          />
        </Link>

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`
              const isLast = index === segments.length - 1
              const label = ROUTE_LABELS[href] ?? decodeURIComponent(segment)

              return (
                <Fragment key={href}>
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
