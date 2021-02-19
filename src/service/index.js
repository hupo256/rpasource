import axios from 'axios'
import { CloseCircleFilled, CheckCircleFilled, ExclamationCircleFilled, QuestionCircleFilled } from '@ant-design/icons'
import { Modal, notification } from 'antd'
import { uuid, unparams } from '@meizhilab/generaljs'
import constant from '../../config/constant'
const { appPrefix } = constant
const isDev = process.env.RPA_ENV === 'development'

const close = () => {}
const baseURL = localStorage.getItem(`${appPrefix}nearApiDomain`) || 'https://api-dev.meizhilab.com'

// 打开通知
const openNotification = config => {
  const emptyFn = () => {
    // 空函数
  }

  const key = `open${Date.now()}`
  const btn = (
    <QuestionCircleFilled
      onClick={() => (config.onDetailClick ? config.onDetailClick(key) : emptyFn)}
      style={{
        position: 'absolute',
        right: 48,
        top: 20,
        color: 'rgba(0, 0, 0, 0.45)',
        fontSize: 14,
        cursor: 'pointer',
      }}
    />
  )

  const iconType = {
    0: <CloseCircleFilled style={{ color: '#CF1322', fontSize: '21px' }} />,
    1: <CheckCircleFilled style={{ color: '#389E0D', fontSize: '21px' }} />,
    2: <ExclamationCircleFilled style={{ color: '#faad14', fontSize: '21px' }} />,
  }
  notification.open({
    message: (
      <div
        style={{
          fontSize: '16px',
          color: '#1E1F21',
          marginLeft: '-10px',
          marginTop: '2px',
          userSelect: 'none',
        }}
      >
        {config.title || '温馨提示'}
      </div>
    ),
    description: (
      <div style={{ marginLeft: '-12px' }}>
        <div style={{ color: '#999', fontSize: '14px' }}>{config.desc || '操作成功啦'}</div>
      </div>
    ),
    icon: iconType[config.type],
    duration: 60,
    btn: !config.hideDetail ? btn : null,
    key,
    // closeIcon: <CloseOutlined />,
    // onClose: config.onDetailClick || emptyFn,
    onClose: close,
    top: 58,
  })
}

// 休息弹窗
const restModal = () =>
  Modal.info({
    title: null,
    icon: null,
    mask: false,
    centered: true,
    autoFocusButton: null,
    width: 500,
    okType: 'default',
    okText: '关闭',
    content: (
      <div>
        <div style={{ textAlign: 'center' }}>
          <img src={isDev ? 'https://lab-oss-dev02.oss-cn-shanghai.aliyuncs.com/dr/portal/images/rest.png' : 'https://lab-oss-dev02.oss-cn-shanghai.aliyuncs.com/dr/portal/images/rest.png'} />
        </div>
        <p style={{ textAlign: 'center', paddingTop: '18px', fontSize: '16px', color: '#000' }}>休息一下~</p>
      </div>
    ),
    onOk() {},
  })

// 存储上一次请求url
let prevReqData = {}

// 统一存储限流请求
const limitIP = {}

// 不需要token的接口白名单
const whiteList = ['usam/user/checkExistence', 'usam/session/user', 'usam/verificationCode']

// 统一处理限流规则
const handleLimitIP = async (uid, cb) => {
  if (limitIP[uid]) {
    if (limitIP[uid] <= 10) {
      limitIP[uid]++
      try {
        return await cb()
      } catch (err) {}
    } else {
      restModal()
    }
  } else {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    limitIP[uid] = 1
    try {
      return await cb()
    } catch (err) {}
  }
}

// postRenewTokenFailed
function postRenewTokenFailed() {
  const { pathname, search } = location
  localStorage.setItem(`${appPrefix}userToken`, '')
  localStorage.setItem(`${appPrefix}apiToken`, '')

  if (pathname.indexOf('/usam/signin') < 0 && pathname.indexOf('/usam/signup') < 0) {
    location.href = `/usam/signin?m=MCC02&redirect=${decodeURIComponent(pathname + search)}`
  }
}

// 添加如果在storage中能获取api地址, 则使用获取到的api地址, 否则使用默认的额api地址
const request = axios.create({ baseURL })
request.defaults.withCredentials = true

// 添加请求拦截器
request.interceptors.request.use(
  function(options) {
    // 调用api之前判断用户token并进行相应处理
    let apiToken = localStorage.getItem(`${appPrefix}apiToken`)
    let userToken = localStorage.getItem(`${appPrefix}userToken`)

    if (userToken && !apiToken && options.url.indexOf('usam/token') < 0) {
      return request('usam/token', { method: 'GET' })
    }

    if (!userToken) {
      postRenewTokenFailed()
    }

    // 在发送请求之前做些什么
    let headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Ca-Stage': 'TEST',
      'X-Ca-Nonce': uuid(),
      'X-Ca-Timestamp': Date.now(),
    }

    !isDev && (headers = { ...headers, 'X-Account-Id': 'ac-24pn9mbz7k00' })

    if (whiteList.indexOf(options.url) < 0) {
      headers = { ...headers, 'X-Api-Token': localStorage.getItem(`${appPrefix}apiToken`) }
    }

    if (whiteList.indexOf(options.url) > 0 && options.method === 'delete') {
      headers = { ...headers, 'X-Api-Token': localStorage.getItem(`${appPrefix}apiToken`) }
    }

    if (options.url !== 'usam/token') {
      prevReqData = {
        url: options.url,
        options,
      }
    } else {
      headers['X-User-Token'] = localStorage.getItem(`${appPrefix}userToken`)
    }

    return {
      ...options,
      headers,
    }
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
request.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    // 使用header里的uuid来实现存储interfaceId信息
    return new Promise((resolve, reject) => {
      let { statusCode, systemMessage, responseMessage } = response.data

      //statusCode = 200
      if (statusCode === 200) {
        // 如果是renewToken调用成功, 则更新token, 页面续订完成
        if (response.config.url.indexOf('usam/token') > -1) {
          localStorage.setItem(`${appPrefix}apiToken`, responseMessage.apiToken)
          localStorage.setItem(`${appPrefix}userToken`, responseMessage.userToken)
          localStorage.setItem(`${appPrefix}sessionExpiry`, responseMessage.sessionExpiry)

          //如果是登录页面,则返回至USAM逻辑
          if (window.location.href.indexOf('/usam/signin') > -1) {
            resolve(responseMessage)
            return
          }

          history.go(0)
        }

        //systemMessage = null
        if (!systemMessage) {
          resolve(responseMessage)
          return
        }

        //systemMessage != null
        if (systemMessage) {
          // 如果是登录相关接口,则将错误信息提示权转移给业务代码
          if (whiteList.indexOf(prevReqData.url) > -1) {
            resolve(systemMessage)
            return
          }

          //specialDisplayModeId = SDPT01
          if (systemMessage.specialDisplayModeId === 'SDPT01') {
            let key = response.headers['X-Ca-Nonce']
            openNotification({
              title: systemMessage.messageTitle,
              desc: systemMessage.messageAbstract,
              type: 2,
              onDetailClick: () => {
                request('generalservice/systemMessage/show', {
                  method: 'POST',
                  data: {
                    systemMessageId: prevReqData.url.split('systemMessageId=')[1],
                  },
                })
              },
            })
            return
          }

          //systemMessage != null 的其它情况
          let key = response.headers['X-Ca-Nonce']
          openNotification({
            title: systemMessage.messageTitle,
            desc: systemMessage.messageAbstract,
            type: 1,
            onDetailClick: () => {
              request('generalservice/systemMessage/show', {
                method: 'POST',
                data: {
                  systemMessageId: prevReqData.url.split('systemMessageId=')[1],
                },
              })
            },
          })
          resolve(responseMessage)
          return
        }
      }

      //statusCode = 401
      if (statusCode === 401) {
        postRenewTokenFailed()
        return
      }

      //statusCode 为其它情况
      //from renewToken()
      if (response.config.url.indexOf('usam/token') > -1) {
        postRenewTokenFailed()
        return
      }

      //systemMessage = null
      if (!systemMessage) {
        let key = response.headers['X-Ca-Nonce']
        systemMessage = {
          messageTitle: '错误',
          messageAbstract: '系统错误',
        }

        openNotification({
          title: systemMessage.messageTitle,
          desc: systemMessage.messageAbstract,
          type: 0,
          hideDetail: true,
        })
        return
      }

      //systemMessage != null
      if (systemMessage) {
        //specialDisplayModeId = SDPT51
        if (systemMessage.specialDisplayModeId === 'SDPT51') {
          resolve(response.data)
          return
        }

        //systemMessage != null 的其它情况
        openNotification({
          title: systemMessage.messageTitle,
          desc: systemMessage.messageAbstract,
          type: 0,
          onDetailClick: () => {
            request('generalservice/systemMessage/show', {
              method: 'POST',
              data: {
                systemMessageId: prevReqData.url.split('systemMessageId=')[1],
              },
            })
          },
        })
        return
      }
    })
  },
  async function(error) {
    // 对响应错误做点什么
    const { response } = error

    if (!response) {
      const { href, pathname, search } = location
      if (href.indexOf('/usam/signin') < 0) {
        location.href = `/usam/signin?m=MCC02&redirect=${decodeURIComponent(pathname + search)}`
      }
      return
    }

    //from renewToken()
    if (response.config.url.indexOf('usam/token') > -1) {
      postRenewTokenFailed()
      return
    }

    let uid = response.config.headers['X-ca-nonce']
    //HTTP 状态码 = 429
    if (response.status === 429) {
      if (response.headers['x-ca-error-message'] === 'FC-ACC') {
        // 当前账号过于频繁地操作 (可能为非自然人在操控账号), 因此前端弹窗: 休息一下
        restModal()
        return
      }

      if (response.headers['x-ca-error-message'] === 'FC-IP') {
        // 当前 IP 过于频繁地操作, 前端等待 1 秒钟后重新提交该请求, 重复提交 10 次失败后弹窗: 休息一下
        try {
          let data = await handleLimitIP(uid, () => request(response.config))
          return Promise.reject({ response: data })
        } catch (err) {}
        return
      }

      // 其它情况下触发流控, 前端等待 1 秒钟后重新提交该请求, 重复提交 10 次失败后弹窗: 休息一下
      try {
        let data = await handleLimitIP(uid, () => request(response.config))
        return Promise.reject({ response: data })
      } catch (err) {}
      return
    }

    //HTTP 状态码 = 403
    if (response.status === 403) {
      if (response.headers['x-ca-error-code'].indexOf('A403J') > -1) {
        // Token 已过期, 应 RenewToken 或者重新登录
        try {
          let res = await request('usam/token', { method: 'GET' })
          if (res && Object.keys(res).length > 0) {
            let data = await request(prevReqData.url, prevReqData.options)
            return Promise.reject({ response: data })
          }
        } catch (err) {
          // console.log(err)
        }
        return
      }

      if (response.headers['x-ca-error-code'].indexOf('Throttled') > -1 || response.headers['x-ca-error-message'].indexOf('Throttled') > -1) {
        // 其它情况下触发流控, 前端等待 1 秒钟后重新提交该请求, 重复提交 10 次失败后弹窗: 休息一下
        try {
          let data = await handleLimitIP(uid, () => request(response.config))
          return Promise.reject({ response: data })
        } catch (err) {}
        return
      }
    }
  },
)

// 缓存白名单, 后续需要缓存的都在这里维护
const cacheWhiteList = ['usam/user', 'generalservice/generalParameter', 'metabase/entity/detailViewUri']

// 请求代理
const proxyRequest = async (url, options) => {
  if (options.method === 'GET' && window.db) {
    const isCache = cacheWhiteList.some(v => url.indexOf(v) > -1)
    if (isCache) {
      let paramStr = unparams(options.params)
      let urlPath = url.indexOf('?') > -1 ? url : `${url}${paramStr ? `?${unparams(options.params)}` : ''}`
      try {
        let data = await window.db.get(tableName, `/${urlPath}`)
        if (data.data) {
          return data.data.cache
        } else {
          return await request({ url, method: 'GET', ...options })
        }
      } catch (err) {
        return await request({ url, method: 'GET', ...options })
      }
    } else {
      return await request({ url, method: 'GET', ...options })
    }
  } else {
    return await request({ url, method: 'GET', ...options })
  }
}

const apiProxy = (url, options) => {
  return new Promise(resolve => {
    proxyRequest(url, options)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        if (err.response) {
          resolve(err.response)
        }
      })
  })
}

export default apiProxy
