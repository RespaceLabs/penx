import logo from '../../../assets/logo.png'
import styles from './login.module.css'

interface LoginProps {
  loginCallback(): void
}

export function Login(props: LoginProps) {
  const onLogin = () => {
    props.loginCallback()
  }

  return (
    <div className={styles.container}>
      <div className={styles.welcome} style={{ marginTop: '20px' }}>
        <img src={logo} width={100} alt="penx icon" />
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
