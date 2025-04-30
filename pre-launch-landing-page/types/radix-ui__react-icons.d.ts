declare module '@radix-ui/react-icons' {
  import { ComponentProps } from 'react'
  
  interface IconProps extends ComponentProps<'svg'> {
    className?: string
  }
  
  export const UpdateIcon: React.FC<IconProps>
} 