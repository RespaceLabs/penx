import { HTMLAttributes, HTMLProps } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number
  innerSize?: number
  innerColor?: string
  outlineColor?: string
  dashed?: boolean
  className?: string
}

export function Bullet({
  size = 16,
  innerSize = 6,
  innerColor = 'gray500',
  outlineColor,
  dashed = false,
  ...rest
}: Props) {
  return (
    <div
      className="bulletIcon w-4 h-4 bg-foreground/20 flex justify-center items-center rounded-full cursor-pointer"
      {...rest}
    >
      <div className="w-[6px] h-[6px] bg-foreground/60 rounded-full transition-all hover:scale-130" />
    </div>
  )
}
