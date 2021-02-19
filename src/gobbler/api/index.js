import request from '@src/service'
const baseURL = '/rpasource/gobbler'

// [业务集团] 开通 Gobbler 服务
export function activateGobblerService(params) {
  return request(`${baseURL}/activate`, {
    method: 'POST',
    data: { ...params },
  })
}

// [业务集团] 创建一组 Gobbler 所需的存储池
export function createGobblerStorage(params) {
  return request(`${baseURL}/storage`, {
    method: 'POST',
    data: { ...params },
  })
}

// 获取可用于 Gobbler 的源数据单元
export function getSourceDataUnits() {
  return request(`${baseURL}/sourceDataUnit`, {
    method: 'GET',
  })
}

// 设置网页抓取仓库
export function setCaptureRepo(params) {
  return request(`${baseURL}/option/captureRepo`, {
    method: 'PUT',
    data: { ...params },
  })
}

// 增删改网页抓取规则
export function alterCaptureRules(params) {
  return request(`${baseURL}/option/captureRule`, {
    method: 'PUT',
    data: { ...params },
  })
}

// 获取可用于 Gobbler 的源数据单元
export function getOptions(params) {
  return request(`${baseURL}/option`, {
    method: 'GET',
    params: params,
  })
}

// 设置页面的排除规则, 用于排除特定的页面节点以不被抓取
export function setExclusionRule(data, params) {
  return request(`${baseURL}/exclusion/rule`, {
    method: 'PUT',
    data: { ...data },
    params: params,
  })
}

// 删除一条排除规则
export function deleteExclusionRule(params) {
  return request(`${baseURL}/exclusion/rule`, {
    method: 'DELETE',
    params: params,
  })
}

// 获取domain信息
export function getDomainDataView(params) {
  return request(`/metabase/domainData/view`, {
    method: 'POST',
    data: { ...params },
  })
}

// 获取generalParameter信息
export function getGeneralParameter(params) {
  return request(`/generalservice/generalParameter/query`, {
    method: 'POST',
    data: { ...params },
  })
}

export default baseURL
