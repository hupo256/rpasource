import React, { useState, useEffect, forwardRef, memo } from 'react'
import { Popover, Skeleton } from 'antd'
import useCopy from './copy'
import './index.less'
import request from '@src/service'
import { IconFont } from '@meizhilab/generalui'
/**
 * PopoverComponent
 *    这是一个纯展示组件, 所有的属性都是从外部传递, 唯一需要的就是执行getTagData函数时, 需要把value传出去
 */

/**
 *
 * @param {item} 展示的内容
 * @param {popId} 展示数据ID
 * @param {popName} 展示数据name
 * @param {entityTypeId} 实体ID -- entityTypeId
 * @param {searchHelp} 是否是搜索帮助
 */

export default forwardRef((props, ref) => {
  const { item, searchHelp, entityTypeId, popId, popName } = props

  const [copyIcon, setIconFlag] = useCopy(() => document.getElementById(popId))
  const [tagData, setTagData] = useState({})
  const [entityName, setEntityName] = useState('')
  // const [searchHelpName, setSearchHelpName] = useState('')

  const handleHoverChange = visiable => {
    if (visiable) {
      setIconFlag(visiable)
    }
  }

  const getTagData = () => {
    return request(`generalservice/generalParameter?generalParameterId=${popId}`, { method: 'GET' }).then(res => {
      res && setTagData(res)
    })
  }

  useEffect(() => {
    if (item?.domainDataView?.searchHelpScript?.searchHelpTypeId === 'SHT02') {
      getTagData(item)
    } else if (item?.domainDataView?.searchHelpScript?.searchHelpTypeId === 'SHT03' && item?.domainDataView?.searchHelpScript?.entityConfig) {
      request(`generalservice/generalParameter?generalParameterId=${item.domainDataView.searchHelpScript.entityConfig.entityTypeId}`, { method: 'GET' }).then(res => {
        res && setEntityName(res.generalParameterName)
      })
    } else if (searchHelp) {
      request(`generalservice/generalParameter?generalParameterId=${entityTypeId}`, { method: 'GET' }).then(res => {
        res && setEntityName(res.generalParameterName)
      })
    }
  }, [popId])

  return (
    <span className="showPop">
      <Popover
        trigger="hover"
        placement="bottom"
        overlayStyle={{ zIndex: '10002' }}
        onVisibleChange={handleHoverChange}
        ref={ref}
        content={
          <div className="popBox">
            <div style={{ margin: 0 }}>
              <div className="popoverEntity">
                <span className="entityName">{entityName ? entityName : '通用参数'}</span>
              </div>
              <IconFont type="iconchakan" style={{ fontSize: '14px', color: '#2F54EBFF' }} />
            </div>
            <div id={popId && popId} className="popoverData">
              {popId && popId}
            </div>
            {copyIcon}
            <div className="popoverValue">
              {Object.keys(tagData).length === 0 ? (popName ? popName : popId) : tagData.generalParameterName ? tagData.generalParameterName : tagData.generalParameterId}
            </div>
          </div>
        }
      >
        {item?.domainDataView?.searchHelpScript?.searchHelpTypeId === 'SHT02' ? (
          // 调取接口数据
          Object.keys(tagData).length !== 0 ? (
            <span className="popover">{tagData.generalParameterName ? tagData.generalParameterName : tagData.generalParameterId}</span>
          ) : (
            <Skeleton loading={true} active paragraph={{ rows: 1 }} title={false}></Skeleton>
          )
        ) : (
          // 本地获取
          <span className="popover">{popName ? popName : popId}</span>
        )}
      </Popover>
    </span>
  )
})
