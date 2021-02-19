import React from 'react'
// import request from '../../../request'
import { getDomainDataView } from '@src/gobbler/api'
// 引擎渲染工具方法
import { collectIds, minixViewToMeta } from '@meizhilab/generaljs'

/**
 * RenderingEngine 连接引擎
 * 功能: 统一调度通用方法,获取数据元素配置信息,传递给容器组件
 */

/**
 * @param Wrap 组件
 * @param schemaData 配置文件的数据
 * @param isTest 是否是测试状态,如果为true,则不调用接口获取页面数据源
 */
export default function RenderingEngine(Wrap, schemaData, isTest) {
  return class HOC extends React.Component {
    state = {
      isLoading: true,
      mixinMetaView: schemaData,
    }

    componentDidMount() {
      // 1.收集domainId集合
      let ids = collectIds(schemaData)
      // 2.获取并合并meta,使用request替换
      if (!isTest && ids && ids.length) {
        // 如果不是本地测试,则调用接口
        // request(`metabase/domainData/view`, { method: 'POST', data: { domainDataIds: ids } }).then(res => {
        getDomainDataView({ domainDataIds: ids }).then(res => {
          this.setState({
            isLoading: false,
            mixinMetaView: minixViewToMeta(this.state.mixinMetaView, res.domainDataViews),
          })
        })
      } else {
        this.setState({
          isLoading: false,
        })
      }
    }

    render() {
      return !this.state.isLoading ? <Wrap viewData={this.state.mixinMetaView} {...this.props} /> : null
    }
  }
}
