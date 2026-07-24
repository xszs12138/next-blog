declare module '*.glb' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module 'meshline' {
  import * as THREE from 'three'

  export type PointsRepresentation =
    | THREE.BufferGeometry
    | Float32Array
    | THREE.Vector3[]
    | THREE.Vector2[]
    | [number, number, number][]
    | [number, number][]
    | number[]

  export class MeshLineGeometry extends THREE.BufferGeometry {
    setPoints(points: PointsRepresentation, wcb?: (p: number) => unknown): void
  }

  export class MeshLineMaterial extends THREE.ShaderMaterial {
    lineWidth: number
    map: THREE.Texture
    useMap: number
    resolution: THREE.Vector2 | [number, number]
    color: THREE.Color | string | number
    sizeAttenuation: number
    dashArray: number
    dashOffset: number
    dashRatio: number
    useDash: number
    visibility: number
    repeat: THREE.Vector2 | [number, number]
    constructor(parameters?: Record<string, unknown>)
  }
}
