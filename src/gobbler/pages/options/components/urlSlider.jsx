import React, { useState, useEffect } from 'react'
import { Button, Slider } from 'antd'
import styles from '../options.scss'

const rangeArr = ['域名', '路径']
let urlData = null

export default function UrlSlider({ touchUrlData }) {
  const [urlObj, seturlObj] = useState(touchUrl()) //url对象
  const [urlText, seturlText] = useState('') //url对象
  const [uriErr, seturiErr] = useState(false)

  useEffect(() => {}, [])

  function touchUrl(url) {
    const hostname = 'www.aabb.chool.com'
    const pathname = '/rpasource/gobbler/option/#/captureRule'
    const hostLen = 0
    const pathLen = 0
    return { hostname, pathname, hostLen, pathLen }
  }

  // 渲染出显示的url
  // 考虑到需要反复滑动，所以源url里的信息不能更改
  function touchUrlStr() {
    const { hostname, pathname, hostLen, pathLen } = urlObj
    let hostnameStr = '',
      pathnameStr = ''
    //计算域名
    const hostArr = hostname.split('.')
    const hostStr = hostArr.slice(hostLen).join('.')
    hostnameStr = hostLen ? `*.${hostStr}` : hostname

    // 计算路径
    const pathArr = pathname.slice(1).split('/')
    const curNum = pathArr.length - pathLen
    const arrStr = pathArr.slice(0, curNum).join('/')
    pathnameStr = pathLen ? `/${arrStr}/*` : pathname
    curNum === 0 && (pathnameStr = '/*') // 滑到最大时范围也最大

    urlData = { hostname: hostnameStr, pathname: pathnameStr }
    return hostnameStr + pathnameStr
  }

  // 计算出滑块的最大值
  function getLenForRange(num) {
    const { hostname, pathname } = urlObj
    const hostKey = hostname.includes('.com.cn') ? '.com.cn' : '.com'
    const hostStr = hostname.split(hostKey)[0]
    const key = num === 0 ? '.' : '/'
    const str = num === 0 ? hostStr : pathname
    const len = str.split(key).length
    return len - 1
  }

  // 响应ragne的变化，更新显示的值
  function rangeChange(val = 0, num) {
    const pName = num === 0 ? 'hostLen' : 'pathLen'
    seturlObj({ ...urlObj, [pName]: val })
  }

  // 刷新所要标注的域名
  function updateUrlObj() {
    const { hostname, pathname } = urlData
    touchUrlData(hostname + pathname)
  }

  return (
    <div className={styles.popupbox}>
      <div className={styles.urlSliderBox}>
        <h3>Gobbler采集页面范围</h3>
        <p>Gobbler会采集以下规则配置中的数据：</p>
        <p className={`${styles.errorMsg} ${uriErr ? styles.fadein : ''}`}>地址重复，无法保存</p>
        <p className={styles.urlText}>{touchUrlStr()}</p>
        <ul className={styles.sliderbox}>
          {rangeArr.map((range, index) => {
            const mx = getLenForRange(index)
            return (
              <li key={index}>
                <b>{range}</b>
                <Slider defaultValue={0} defaultValue="0" step="1" max={mx} onChange={val => rangeChange(val, index)} />
              </li>
            )
          })}
        </ul>
        <p className={styles.f12}>您可以滑动以更改Gobbler采集的页面范围</p>
        <div className={styles.btnBox}>
          <Button size="small" onClick={() => touchUrlData()}>
            取消
          </Button>
          <Button type="primary" size="small" onClick={updateUrlObj}>
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}
