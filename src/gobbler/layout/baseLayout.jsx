import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MenuComponent, FooterComponent } from '@meizhilab/generalui'
import Header from './header'
import menu from '../config/menu.js'
import { imgBaseURL } from '../config/resources'
import styles from './baseLayout.scss'

export default function baseLayout({ children }) {
  const [bool, setbool] = useState(false)
  useEffect(() => {
    setbool(true)
  }, [])

  function callback(path, name) {
    return <Link to={path}>{name}</Link>
  }

  const showFootReg = /(\/create|\/activation\/gobbler)$/
  const hideMenuReg = /\/activation\/gobbler$/
  return (
    <div className={styles.normal}>
      <Header />
      <div className={styles.content}>
        {!hideMenuReg.test(location.pathname) && <MenuComponent data={menu} method={callback} path={window.location.pathname.replace('/rpasource/', '')} />}
        <div className={styles.page}>
          <div className={styles.pageContent}>
            <div style={{ minHeight: 'calc(100vh - 221px)', backgroundColor: '#fff', padding: '0 3em' }} className={showFootReg.test(location.pathname) ? styles.hideFooter : ''}>
              {bool && children}
            </div>
            {!showFootReg.test(location.pathname) && <FooterComponent leftImg={`${imgBaseURL}copyright.png`} rightImg={`${imgBaseURL}aliyun.png`} />}
          </div>
        </div>
      </div>
    </div>
  )
}
