import { generateTableColumns } from '@meizhilab/generaljs'

export const showColumn = {
  tableView: {
    dataElm_09: {
      name: '集团',
      domainDataId: 'clientName',
      methodParam: 'clientName',
      queryParam: 'id',
      width: 170,
      editConfig: {
        editable: true,
        required: false,
        defaultValue: '',
        displayMode: 'Visible', // 不填和为Visible表示可见, None: 隐藏不占位; Hidden: 隐藏占位.
      },
    },
    dataElm_10: {
      name: '集团类型',
      domainDataId: 'clientTypeId',
      methodParam: 'clientTypeId',
      width: 100,
      editConfig: {
        editable: true,
        required: false,
        defaultValue: '',
        disabled: true,
        displayMode: 'Visible', // 不填和为Visible表示可见, None: 隐藏不占位; Hidden: 隐藏占位.
      },
    },
    dataElm_13: {
      name: '源数据单元',
      domainDataId: 'sourceDataUnitName',
      methodParam: 'sourceDataUnitName',
      width: 180,
      editConfig: {
        editable: true,
        required: false,
        defaultValue: '',
        displayMode: 'Visible', // 不填和为Visible表示可见, None: 隐藏不占位; Hidden: 隐藏占位.
      },
    },
    dataElm_14: {
      name: '别名',
      domainDataId: 'captureRepoName',
      methodParam: 'captureRepoName',
      editable: true,
      width: 220,
      editConfig: {
        editable: true,
        required: false,
        defaultValue: '',
        displayMode: 'Visible', // 不填和为Visible表示可见, None: 隐藏不占位; Hidden: 隐藏占位.
      },
      domainDataView: {
        businessFormatId: null,
        dataFormatId: 'WWEE',
      },
    },
  },
}

export const ruleColumn = {
  tableView: {
    dataElm_09: {
      name: '采集网站',
      domainDataId: 'a9',
      methodParam: 'webUriPattern',
      idNameParam: 'interfaceId',
      queryParam: 'id',
      type: 'Input',
      width: 320,
    },
    dataElm_14: {
      name: '存储位置',
      domainDataId: 'a13',
      methodParam: 'captureRepoName',
      type: 'Select',
      width: 200,
    },
  },
}

export const ActivateData = {
  FormView: {
    dataElm_15: {
      name: '选择数据域',
      domainDataId: 'dataLandscapeId',
      methodParam: 'dataLandscapeId',
      queryParam: 'id',
      width: 120,
      editConfig: {
        editable: true,
        required: true,
        defaultValue: '',
        displayMode: 'Visible', // 不填和为Visible表示可见, None: 隐藏不占位; Hidden: 隐藏占位.
      },
    },
  },
}

export const showColumns = generateTableColumns(showColumn)
export const ruleColumns = generateTableColumns(ruleColumn)
