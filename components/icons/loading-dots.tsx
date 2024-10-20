import { cn } from '@/lib/utils'
import styles from './loading-dots.module.css'

interface LoadingDotsProps {
  color?: string
  className?: string
}

export const LoadingDots = ({
  color = '#000',
  className,
}: LoadingDotsProps) => {
  return (
    <span className={styles.loading}>
      <span
        // style={{ backgroundColor: color }}
        className={cn('bg-background', className)}
      />
      <span
        // style={{ backgroundColor: color }}
        className={cn('bg-background', className)}
      />
      <span
        // style={{ backgroundColor: color }}
        className={cn('bg-background', className)}
      />
    </span>
  )
}

export default LoadingDots
