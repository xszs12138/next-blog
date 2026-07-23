"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { PlayIcon } from "lucide-react"

type BilibiliVideoProps = {
  bvid: string
  title?: string
}

type VideoInfo = {
  pic: string
  title: string
  duration: string
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function BilibiliVideo({ bvid, title }: BilibiliVideoProps) {
  const [loaded, setLoaded] = useState(false)
  const [info, setInfo] = useState<VideoInfo | null>(null)

  useEffect(() => {
    fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setInfo({
            pic: json.data.pic,
            title: json.data.title,
            duration: formatDuration(json.data.duration),
          })
        }
      })
      .catch(() => {})
  }, [bvid])

  const displayTitle = title ?? info?.title

  return (
    <div className="not-prose group/bili my-8">
      {/* Title */}
      {displayTitle && (
        <h3 className="mb-3 text-center text-base font-medium">
          {displayTitle}
        </h3>
      )}
      {/* Video container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-md transition-shadow hover:shadow-lg">
        {loaded ? (
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=1&danmaku=1`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full"
            title={displayTitle ?? "Bilibili 视频"}
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* Thumbnail or gradient */}
            {info?.pic ? (
              <Image
                src={info.pic}
                alt={displayTitle ?? ""}
                fill
                unoptimized
                className="absolute inset-0 object-cover brightness-50 transition-transform duration-500 group-hover/bili:scale-105"
                sizes="(max-width: 768px) 100vw, 48rem"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-fuchsia-500 to-blue-500" />
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Play button */}
            <div className="relative z-10 flex size-16 items-center justify-center rounded-full bg-white/25 shadow-lg ring-1 ring-white/40 backdrop-blur transition-all group-hover/bili:scale-110 group-hover/bili:bg-white/35">
              <div className="absolute inset-0 animate-ping rounded-full bg-white/10 [animation-duration:2s]" />
              <PlayIcon className="ml-1 size-7 text-white drop-shadow-lg" />
            </div>

            {/* Bilibili badge */}
            <div className="relative z-10 mt-5 flex items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 backdrop-blur">
              <svg viewBox="0 0 24 24" className="size-4" fill="#FB7299">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 01-.373-.906c0-.356.124-.659.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.2.213l.447.587.433-.587c.066-.071.13-.142.2-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
              </svg>
              <span className="text-sm font-medium text-white">
                {info?.duration ?? "Bilibili"}
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
