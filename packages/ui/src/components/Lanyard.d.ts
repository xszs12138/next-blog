declare const Lanyard: (props: {
  position?: number[]
  gravity?: number[]
  fov?: number
  transparent?: boolean
  frontImage?: string | null
  backImage?: string | null
  imageFit?: string
  lanyardImage?: string | null
  lanyardWidth?: number
}) => JSX.Element

export default Lanyard
