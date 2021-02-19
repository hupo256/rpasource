import React, { useState, useEffect } from 'react'
import { Select, Button, Table, Input, Dropdown, Menu, Form } from 'antd'
import { PlusOutlined, DashOutlined, EditOutlined, UserOutlined } from '@ant-design/icons'
import { getSourceDataUnits, setCaptureRepo, getOptions } from '@src/gobbler/api'
import { generateTableColumns } from '@meizhilab/generaljs'
import { showColumn } from '@src/gobbler/test/data'
import { changeTopUrl } from './components/changeUrl'
import RenderingEngine from './components/RenderingEngine'
import SelectComponent from './components/typeIdSelect'
import PopoverComponent from './components/IdPopover'
import styles from './options.scss'

const { Option } = Select
const { Search } = Input
const { Item } = Form
const antdSize = 'small'

function CaptureRepo(props) {
  const { viewData, history } = props
  const [sourceDataUnits, setsourceDataUnits] = useState([])
  const [tableData, settableData] = useState([])
  const [columns, setcolumns] = useState()
  const [isEdit, setisEdit] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    getSourceDataUnits().then(res => {
      const { sourceDataUnits } = res
      setsourceDataUnits(sourceDataUnits)
      touchColumns(sourceDataUnits) // clomums

      getOptions().then(res => {
        const { captureRepos } = res
        touchTableData(captureRepos, sourceDataUnits)
      })
    })

    changeTopUrl(history)
  }, [])

  useEffect(() => {
    touchColumns(sourceDataUnits) // clomums
  }, [tableData])

  function touchTableData(Repos, Units) {
    const dataList = Repos.map(repo => {
      const { sourceDataUnitId } = repo
      for (let i = 0, k = Units.length; i < k; i++) {
        const unit = Units[i]
        if (sourceDataUnitId === unit.sourceDataUnitId) {
          return {
            ...repo,
            ...unit,
          }
        }
      }
    }).filter(item => item)
    dataList.length === 1 && (dataList[0].defaultFlag = true)
    settableData(dataList)
  }

  function touchSelectOpts(Units) {
    let clientNames = []
    let sourceDataUnitNames = []
    Units.forEach(nuit => {
      const { clientName, clientTypeId, sourceDataUnitId, sourceDataUnitName } = nuit
      clientNames.push(`${clientName}_${clientTypeId}`)
      sourceDataUnitNames.push({ name: sourceDataUnitName, value: `${sourceDataUnitName}_${sourceDataUnitId}` })
    })
    // 去重后再组装
    clientNames = [...new Set(clientNames)].map(role => {
      const [name, value] = role.split('_')
      return { name, value: `${name}_${value}` }
    })
    return { clientNames, sourceDataUnitNames }
  }

  function addNewCaptureRepo() {
    const newRepo = {
      captureRepoId: '',
      clientName: '',
      clientTypeId: '',
      captureRepoName: '',
      sourceDataUnitId: '',
      sourceDataUnitName: '',
      defaultFlag: !tableData.length,
      doEdit: true,
    }
    settableData([newRepo, ...tableData])
  }

  function touchColumns(Units) {
    const defaultColumns = generateTableColumns(viewData)
    const selectOpts = touchSelectOpts(Units)
    const colArr = defaultColumns.map(col => {
      const { methodParam } = col
      col.render = (text, record, index) => {
        let formDom = null
        if (record.doEdit) {
          formDom = (
            <Item name={methodParam} rules={[{ required: methodParam === 'captureRepoName', message: '此为必填项' }]}>
              {creatFormItem(record, col, selectOpts)}
            </Item>
          )
        } else {
          if (methodParam === 'clientTypeId') {
            return (formDom = (
              <div className={styles.popDel}>
                <PopoverComponent item={col} popId={record[methodParam]} popName={record[methodParam]} />
              </div>
            ))
          }
          if (methodParam === 'captureRepoName' && record.defaultFlag)
            return (formDom = (
              <span className={styles.defaultFlag}>
                {text}
                <i>默认</i>
              </span>
            ))
          formDom = text
        }
        return formDom
      }
      return { ...col, ellipsis: true }
    })
    setcolumns([...colArr, creatLastColum()])
  }

  function creatFormItem(rec, col, selectOpts) {
    const { methodParam } = col
    const curVal = rec[methodParam]
    const options = methodParam === 'clientName' ? selectOpts.clientNames : selectOpts.sourceDataUnitNames
    // 别名
    if (methodParam === 'captureRepoName') {
      return <Input size={antdSize} value={curVal} />
    }
    // 集团类型
    if (methodParam === 'clientTypeId') {
      return <SelectComponent data={col} value={curVal} />
    }
    // 集团名、源数据单元
    return (
      <Select style={{ width: '100%' }} size={antdSize} value={curVal} onChange={e => selectChange(e, methodParam, rec)}>
        {options.length > 0 &&
          options.map((opt, ind) => {
            const { name, value } = opt
            return (
              <Option key={ind} value={value}>
                {name}
              </Option>
            )
          })}
      </Select>
    )
  }

  function selectChange(val, key, record) {
    const [name, value] = val.split('_')
    const idKey = key === 'clientName' ? 'clientTypeId' : 'sourceDataUnitId'
    record[key] = name
    record[idKey] = value
    form.setFieldsValue({ [idKey]: value })
  }

  function creatLastColum() {
    return {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 76,
      render: (text, record, index) => {
        let tdDom = null
        if (record.doEdit) {
          tdDom = (
            <div className={styles.opraterBox}>
              <span onClick={() => saveRepo(record)}>确认</span>
              <span onClick={() => toCancel(record)}>取消</span>
            </div>
          )
        } else {
          tdDom = (
            <>
              <EditOutlined onClick={() => toEditRepo(record)} type="iconbianji" />
              <Dropdown placement="bottomCenter" overlay={() => menu(record, index)} className={styles.dropdownBox}>
                <DashOutlined />
              </Dropdown>
            </>
          )
        }
        return tdDom
      },
    }
  }

  function toEditRepo(rec) {
    if (isEdit) return form.validateFields()
    rec.doEdit = true
    setisEdit(true)
    settableData(tableData.slice())
  }

  function toCancel(rec) {
    rec.doEdit = false
    setisEdit(false)
    settableData(tableData.slice())
  }

  function menu(rec, ind) {
    return (
      <Menu>
        <Menu.Item onClick={() => setToDefault(rec)}>
          <UserOutlined /> 设为默认
        </Menu.Item>
      </Menu>
    )
  }

  function setToDefault(rec) {
    if (isEdit) return form.validateFields()
    tableData.forEach(d => (d.defaultFlag = false))
    rec.defaultFlag = true
    settableData(tableData.slice())
    const { sourceDataUnitId, captureRepoName } = rec
    const param = { sourceDataUnitId, captureRepoName, defaultFlag: true }
    setCaptureRepo(param)
  }

  function saveRepo(rec) {
    form.validateFields().then(value => {
      const { captureRepoName, sourceDataUnitName } = value
      const [, sourceDataUnitId] = sourceDataUnitName.split('_')
      let param = { sourceDataUnitId, captureRepoName, defaultFlag: !!rec.defaultFlag }
      if (tableData.length === 1) {
        param = { ...param, defaultFlag: true }
        rec.defaultFlag = true
      }
      rec.doEdit = false
      rec.captureRepoName = captureRepoName
      settableData(tableData.slice())
      setCaptureRepo(param)
      setisEdit(false)
    })
  }

  function rowEvents(record, index) {
    return {
      onMouseEnter: e => {
        tableData.forEach(rec => (rec.mouserEnter = false))
        record.mouserEnter = true
        settableData(tableData.slice())
      }, // 鼠标移入行
      onMouseLeave: e => {
        record.mouserEnter = false
        settableData(tableData.slice())
      },
    }
  }

  function onSearch(e) {
    console.log(e)
  }

  function touchRowClasss(rec) {
    let cls = ''
    rec.delRow && (cls = 'delRow')
    rec.mouserEnter && (cls = 'mouserEnter')
    return cls
  }

  return (
    <div className={styles.tableBox}>
      <div className={styles.titleBox}>
        <h3>存储配置</h3>
        <div className={styles.oprationBox}>
          <Button type="primary" icon={<PlusOutlined />} size={antdSize} onClick={addNewCaptureRepo}>
            添加配置
          </Button>

          <Search placeholder="筛选" onSearch={onSearch} style={{ width: 200 }} size={antdSize} />
        </div>

        <Form form={form} initialValues={tableData}>
          <Table columns={columns} dataSource={tableData} pagination={{ hideOnSinglePage: true }} rowKey={record => record['captureRepoId'] || Math.random() * 100000} size="middle" />
        </Form>
      </div>
    </div>
  )
}

export default RenderingEngine(CaptureRepo, showColumn)
