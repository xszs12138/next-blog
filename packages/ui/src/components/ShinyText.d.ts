declare const ShinyText: (props: {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
  color?: string
  shineColor?: string
  spread?: number
  yoyo?: boolean
  pauseOnHover?: boolean
  direction?: "left" | "right"
  delay?: number
}) => JSX.Element

export default ShinyText
