import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import request from '@src/service'

const { Option } = Select
export default function typeIdSelect(props) {
  const { data, value } = props
  const [selectData, setSelectData] = useState([])

  const getSearchOptionData = () => {
    let payload = data.domainDataView.searchHelpScript.generalParamConfig
    console.log(payload)
    request('generalservice/generalParameter/query', { method: 'POST', data: payload }).then(res => {
      setSelectData(res.generalParameters)
    })
  }

  useEffect(() => {
    getSearchOptionData()
    let isUnmount = false
    if (!isUnmount) getSearchOptionData()
    return () => (isUnmount = true) //最好return一个isUnmount
  }, [value])

  return (
    <Select size="small" style={{ width: '100%' }} value={value} disabled={data.editConfig?.disabled}>
      {selectData.length > 0 &&
        selectData.map(value => {
          const { generalParameterId, generalParameterName } = value
          return (
            <Option key={generalParameterId} value={generalParameterId}>
              {generalParameterName}
            </Option>
          )
        })}
    </Select>
  )
}
