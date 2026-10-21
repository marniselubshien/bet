import styles from "./loading-screen.module.css"

export function LoadingScreen() {
  return (
    <div className={styles.screen} role="status" aria-label="Loading 7X PASA" aria-live="polite" aria-busy="true">
      <div className={styles.mark} aria-hidden="true">
        <span className={styles.logo}><span>7X</span>PASA<span className={styles.dot}>.</span></span>
        <svg className={styles.orbit} viewBox="0 0 180 100" fill="none">
          <path className={styles.sweep} d="M 19 65 A 72 29 -15 1 0 159 31" pathLength="100" />
          <circle className={styles.spark} cx="18" cy="67" r="1.5" />
        </svg>
      </div>
    </div>
  )
}
