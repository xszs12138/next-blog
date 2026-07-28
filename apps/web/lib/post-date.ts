const postDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Shanghai",
})

export function formatPostDate(date: string) {
  return postDateFormatter.format(new Date(date))
}
