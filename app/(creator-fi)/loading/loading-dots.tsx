import { cn } from '@/lib/utils'
import styles from './loading-dots.module.css'

interface LoadingDotsProps {
  color?: string
  className?: string
}

export const LoadingDots = ({ color = 'white', className }: LoadingDotsProps) => {
  return (
    <span className={cn(styles.loading)}>
      <span className="bg-white dark:bg-zinc-700" />
      <span className="bg-white dark:bg-zinc-700" />
      <span className="bg-white dark:bg-zinc-700" />
    </span>
  )
}

export default LoadingDots
