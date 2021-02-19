import React, { useState, useEffect } from 'react'
import { imgBaseURL } from '../config/resources'
import styles from './baseLayout.scss'

export default function TopComponent({ history }) {
  useEffect(() => {
    // touchUrl()
  }, [])

  return (
    <div className={styles.headerWrap}>
      <div className={styles.logobox}>
        <img src={`${imgBaseURL}ico.png`} alt="" />
        <span>Gravision</span>
      </div>

      <div className={styles.userInfor}>用户名</div>
    </div>
  )
}
