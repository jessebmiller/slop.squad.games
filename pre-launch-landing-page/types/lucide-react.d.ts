declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react'

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string
    color?: string
    strokeWidth?: number | string
  }

  export const ArrowDown: ComponentType<IconProps>
  export const Github: ComponentType<IconProps>
  export const Zap: ComponentType<IconProps>
} 