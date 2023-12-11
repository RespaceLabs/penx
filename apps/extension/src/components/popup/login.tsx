import { IconLogo } from '@penx/icons'

import { trpc } from '~/common/trpc'

import styles from './login.module.css'

interface LoginProps {
  loginCallback(): void
}

export function Login(props: LoginProps) {
  const onLogin = () => {
    window.open(process.env.PLASMO_PUBLIC_BASE_URL)
  }

  return (
    <div className={styles.container}>
      <div className={styles.welcome} style={{ marginTop: '20px' }}>
        <IconLogo size={100} />
        <h1>Welcome</h1>
      </div>
      <div className={styles.btnContainer}>
        <button className={styles.loginBtn} onClick={onLogin}>
          Login to penx
        </button>
      </div>
    </div>
  )
}
