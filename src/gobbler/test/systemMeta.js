/* eslint-disable */
export default {
  searchFormView: {
    dataElm_01: {
      name: '搜索',
      hasPersonal: true,
      domainDataId: 'a1',
      methodParam: 'queryText',
      useConfigName: false,
      displayMode: 'Visible', // 不填和为Visible表示可见, None: 隐藏不占位; Hidden: 隐藏占位.
      queryParam: 'q',
    },
    dataElm_02: {
      name: '系统消息ID',
      domainDataId: 'a2',
      methodParam: 'systemMessageId',
      queryParam: 'id',
      useConfigName: true,
      editConfig: {
        editable: true,
        required: false,
        defaultValue: '',
        displayMode: 'Visible', // 不填和为Visible表示可见, None: 隐藏不占位; Hidden: 隐藏占位.
      },
    },
    dataElm_03: {
      name: '状态码',
      domainDataId: 'a3',
      methodParam: 'statusCode',
      queryParam: 'x1',
      editConfig: {
        editable: true,
        required: false,
        defaultValue: '',
        displayMode: 'Visible', // 不填和为Visible表示可见, None: 隐藏不占位; Hidden: 隐藏占位.
      },
    },
    dataElm_04: {
      name: '接口方法ID',
      domainDataId: 'a4',
      methodParam: 'interfaceMethodId',
      queryParam: 'x2',
      editConfig: {
        editable: true,
        required: false,
        defaultValue: '',
        displayMode: 'Visible', // 不填和为Visible表示可见, None: 隐藏不占位; Hidden: 隐藏占位.
      },
    },
  },
  tableView: {
    dataElm_05: {
      name: '系统消息ID',
      domainDataId: 'a2',
      methodParam: 'systemMessageId',
      queryParam: 'id',
      required: false,
      width: 150,
    },
    dataElm_06: {
      name: '状态码Key',
      domainDataId: 'a5',
      methodParam: 'statusCodeKey',
      width: 150,
    },
    dataElm_07: {
      name: '接口Key',
      domainDataId: 'a6',
      methodParam: 'interfaceKey',
      idNameParam: 'interfaceName',
      width: 150,
      type: 'Tag',
    },
    dataElm_08: {
      name: '接口名称',
      domainDataId: 'a7',
      methodParam: 'interfaceName',
      width: 150,
    },
    dataElm_09: {
      name: '功能模块ID',
      domainDataId: 'a8',
      methodParam: 'functionModuleId',
      width: 150,
    },
    dataElm_10: {
      name: '功能模块名称',
      domainDataId: 'a9',
      methodParam: 'functionModuleName',
      width: 150,
    },
    dataElm_11: {
      name: '消息标题',
      domainDataId: 'a10',
      methodParam: 'messageTitle',
      width: 150,
    },
    dataElm_12: {
      name: '创建时间',
      domainDataId: 'a11',
      methodParam: 'creationTime',
      width: 250,
    },
  },
}
