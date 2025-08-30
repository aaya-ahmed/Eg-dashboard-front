import Image from 'next/image'
import '../../../styles/_global.scss'
import style from '@styles/auth/auth-layout.module.scss'
import logo from '@public/logo.png';
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
          <main>
            <div className={style['main-container']}>
              <div className={style['auth-container']}>
                <div className={style['auth-background']}>
                  <Image src={logo} className={style['logo']} alt="auth-logo" />
                </div>
                {children}
              </div>
            </div>
          </main>
    </>
  )
}
