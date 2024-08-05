import styles from './loading-dots.module.css'

interface LoadingDotsProps {
  color?: string
}

export const LoadingDots = ({ color = '#000' }: LoadingDotsProps) => {
  return (
    <span className={styles.loading}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  )
}

export default LoadingDots
