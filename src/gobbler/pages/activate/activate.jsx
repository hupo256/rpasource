import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { useHistory } from 'react-router-dom'
import { generateAvailableData } from '@meizhilab/generaljs'
import { fetchEngineData } from '@meizhilab/generalui'
import { CreateForm } from '@meizhilab/generalview'
import { getUserClients, activateGobblerService } from './api/service'
import constant from '../../../../config/constant'
import styles from './activate.less'

const { appPrefix } = constant

function ActivateService() {
  // 开通成功后，reload页面，添加search参数s=1，表示开通成功。页面刷新为了支持获取apiToken,userToken
  const activateSucFlag = window.location.search.split('&').filter(v => v.indexOf('s=1') > -1)[0]
  const [formData, setFormData] = useState([])
  const [successFlag, setSuccessFlag] = useState(!!activateSucFlag)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(null)
  const [updatedValue, setUpdatedValue] = useState({})
  let history = useHistory()

  const formItem = {
    FormView: {
      dataElm_01: {
        name: '选择数据域',
        domainDataId: 'dataLandscapeId',
        methodParam: 'dataLandscapeId',
        editConfig: {
          editable: true,
          required: true,
        },
      },
    },
  }
  const [viewData] = fetchEngineData(() => formItem) || []

  useEffect(() => {
    setFormData(generateAvailableData(viewData, 'FormView'))
  }, [viewData])

  const handleSubmit = async () => {
    form
      .validateFields()
      .then(async values => {
        setLoading(true)
        // 验证完成userclients 有返回结果再调用开通接口
        const { userClients } = await getUserClients()
        const clientsTypeIds = (userClients || []).map(client => client.clientTypeId)
        // clients为ct1，ct2，ct3可以开通gobbler
        const allowedClientsTypeIds = ['CT01', 'CT02', 'CT03']
        const intersectTypeIds = clientsTypeIds.filter(v => allowedClientsTypeIds.indexOf(v) > -1)
        if (!userClients || !intersectTypeIds.length) {
          setLoading(false)
          return
        }
        let params = Object.assign(values)
        params.dataLandscapeId = params.dataLandscapeId[0]
        const activateRes = await activateGobblerService(params)
        if (activateRes && activateRes?.data?.statusCode !== 500) {
          localStorage.setItem(`${appPrefix}apiToken`, activateRes.apiToken)
          localStorage.setItem(`${appPrefix}userToken`, activateRes.userToken)
          window.location.href = '/rpasource/activation/gobbler?s=1'
        }
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const renderFooter = () => (
    <div className={styles.createPageFooter}>
      <div className={styles.createPageBtn}>
        <div style={{ float: 'right' }}>
          <Button className={styles.createPageCancelBtn} onClick={() => history.push('')}>
            取消
          </Button>
          <Button
            type="primary"
            className={`${styles.createPageSaveBtn} ${!updatedValue?.['dataLandscapeId']?.[0] ? styles.disabledBtn : null}`}
            onClick={updatedValue?.['dataLandscapeId']?.[0] ? handleSubmit : null}
            loading={loading}
          >
            立即开通
          </Button>
        </div>
      </div>
    </div>
  )

  const cards = ['/lightweight', '/intelligent', '/efficient']

  return (
    <>
      <div className={styles.activateBox}>
        {!successFlag ? (
          <>
            <h3 className={styles.pageTitle}>开通Gobbler服务</h3>
            <div className={styles.formBox}>
              <CreateForm
                onRef={originForm => {
                  setForm(originForm)
                }}
                formFields={formData}
                onValuesChange={changedValues => {
                  setUpdatedValue(changedValues)
                }}
              />
              <a href="/das/dataLandscape/create" target="_blank">
                创建域数据
              </a>
            </div>
            <div className={styles.cardBox}>
              {cards.map(card => {
                return <img src={`${rpasourceImgPath}${card}.png`} className={styles.activateImg} key={card} />
              })}
            </div>
          </>
        ) : (
          <div className={styles.activeSuccess}>
            <img src={`${rpasourceImgPath}/activateSuccess.png`} className={styles.activateSucImg} />
            <p className={styles.successText}>Gobbler已开通成功，请先登录</p>
            <div>
              <Button className={styles.mr24} onClick={() => (window.location.href = '/')}>
                稍后配置
              </Button>
              <Button type="primary" onClick={() => (window.location.href = '/rpasource/gobbler/option/captureRepo')}>
                去配置
              </Button>
            </div>
          </div>
        )}
      </div>
      {!successFlag ? renderFooter() : null}
    </>
  )
}

export default ActivateService
