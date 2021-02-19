import React, { useState, useEffect, useContext } from 'react'
import { Select, Button, Table, Input, Modal } from 'antd'
import { ctx } from './context'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { PopoverComponent } from '@meizhilab/generalui'
import UrlSlider from './components/urlSlider'
import { alterCaptureRules, getOptions } from '@src/gobbler/api'
import { ruleColumns } from '@src/gobbler/test/data'
import { changeTopUrl } from './components/changeUrl'
import styles from './options.scss'

const { Option } = Select
const { Search } = Input
const antdSize = 'small'

export default function captureRule(props) {
  const { history } = props
  const { showSlider, setshowSlider } = useContext(ctx)
  const [isEdit, settableIsEdit] = useState(false)
  const [selectedRows, setselectedRows] = useState([])
  const [columns, setcolumns] = useState(ruleColumns)
  const [tableData, settableData] = useState([])
  const [curIndex, setcurIndex] = useState({})
  const [selectArr, setselectArr] = useState([])

  useEffect(() => {
    getOptions().then(res => {
      const { captureRules, captureRepos } = res
      const ruleArr = captureRules.map(rule => {
        // 合成table数据
        const { captureRepoId } = rule
        const repo = captureRepos.filter(re => re.captureRepoId === captureRepoId)[0]
        return { ...rule, ...repo }
      })
      const selArr = captureRepos.map(rule => {
        // 合成下拉seclet数据
        const { captureRepoId, captureRepoName } = rule
        return { captureRepoId, captureRepoName }
      })
      settableData(ruleArr)
      setselectArr(selArr)
    })

    changeTopUrl(history)
  }, [])

  useEffect(() => {
    creactColumns()
  }, [isEdit])

  function creactColumns() {
    const col = {
      key: 'toDel',
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: 80,
      render: (text, record) => <DeleteOutlined onClick={() => delTheRow(record)} />,
    }
    setcolumns(isEdit ? transColumns([...ruleColumns, col]) : ruleColumns)
  }

  function handleChange(e) {
    console.log(e)
  }

  function creatRowSelection() {
    return isEdit
      ? {
          onChange: (keys, rows) => {
            console.log('selectedRows: ', rows)
            setselectedRows(rows)
          },
        }
      : null
  }

  function delTheRow(rec) {
    rec.deleteFlag = true
    rec.delRow = true
    rec.mouserEnter = false
    settableData(tableData.slice())
  }

  function toEditUrl(e, num) {
    console.log(e.target.value)
    setshowSlider(!showSlider)
    setcurIndex(num)
  }

  function selectChange(val, rec) {
    console.log(val)
    const [captureRepoId, captureRepoName] = val.split('_')
    rec.captureRepoId = captureRepoId
    rec.captureRepoName = captureRepoName
    settableData(tableData.slice())
  }

  function transColumns(arr) {
    if (!arr.length) []
    return arr.map(col => {
      const { type } = col
      if (type) {
        switch (type) {
          case 'Input':
            col.render = (text, record, index) => (record.mouserEnter ? <Input size={antdSize} defaultValue={text} onFocus={e => toEditUrl(e, index)} /> : text)
            break
          case 'Select':
            col.render = (text, record) =>
              record.mouserEnter ? (
                <Select size={antdSize} style={{ width: 180 }} defaultValue={text} onChange={val => selectChange(val, record)}>
                  {selectArr.length > 0 &&
                    selectArr.map((item, ind) => {
                      const { captureRepoId, captureRepoName } = item
                      return (
                        <Option value={`${captureRepoId}_${captureRepoName}`} key={ind}>
                          {captureRepoName}
                        </Option>
                      )
                    })}
                </Select>
              ) : (
                text
              )
            break
          case 'Tag':
            col.render = (text, record) => <PopoverComponent item={col} popId={text} />
            break
          default:
            return col
        }
      }
      return col
    })
  }

  function rowEvents(record, index) {
    return isEdit
      ? {
          onMouseEnter: e => {
            const { delRow } = record
            tableData.forEach(rec => (rec.mouserEnter = false))
            !delRow && (record.mouserEnter = true)
            settableData(tableData.slice())
          }, // 鼠标移入行
          onMouseLeave: e => {
            record.mouserEnter = false
            settableData(tableData.slice())
          },
        }
      : null
  }

  function touchUrlData(str) {
    console.log(str)
    setshowSlider(!showSlider)
    if (!str) return
    tableData[curIndex].webUriPattern = str
    tableData[curIndex].mouserEnter = true
    settableData(tableData.slice())
  }

  function cancelEdit() {
    Modal.confirm({
      title: '确认取消',
      icon: <ExclamationCircleOutlined />,
      content: '您修改的内容不被保存',
      okText: '确认',
      cancelText: '取消',
      onOk: refreshTableData,
    })
  }

  function saveCaptureRules() {
    const captureRules = tableData.map(item => {
      const { captureRuleId, deleteFlag = false, webUriPattern, captureRepoId } = item
      return { captureRuleId, deleteFlag, webUriPattern, captureRepoId }
    })
    console.log(captureRules)
    alterCaptureRules({ captureRules }).then(res => {
      console.log(res)
      refreshTableData()
    })
  }

  function refreshTableData() {
    settableIsEdit(!isEdit)
    getOptions().then(res => {
      const { captureRules, captureRepos } = res
      const ruleArr = captureRules.map(rule => {
        // 合成table数据
        const { captureRepoId } = rule
        const repo = captureRepos.filter(re => re.captureRepoId === captureRepoId)[0]
        return { ...rule, ...repo }
      })
      settableData(ruleArr)
    })
  }

  function onInputSearch(value) {
    console.log(value)
  }

  return (
    <div className={styles.tableBox}>
      <div className={styles.titleBox}>
        <h3>
          <span>采集网站</span>
          {!isEdit ? (
            <Button type="primary" icon={<EditOutlined />} size={antdSize} onClick={() => settableIsEdit(!isEdit)}>
              编辑
            </Button>
          ) : (
            <span>
              <Button size={antdSize} onClick={cancelEdit}>
                取消
              </Button>
              <Button type="primary" size={antdSize} onClick={saveCaptureRules}>
                保存
              </Button>
            </span>
          )}
        </h3>
        <div className={styles.oprationBox}>
          <span>
            {isEdit && selectedRows.length > 0 && (
              <Button icon={<DeleteOutlined />} size={antdSize}>
                删除
              </Button>
            )}
          </span>

          <Search placeholder="筛选" onSearch={onInputSearch} size={antdSize} style={{ width: 200 }} />
        </div>
      </div>

      <Table
        dataSource={tableData}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
        rowClassName={record => {
          return record.delRow ? 'delRow' : ''
        }}
        rowSelection={creatRowSelection()}
        rowKey={record => record['captureRuleId']}
        size="middle"
        onRow={rowEvents}
      />
      {showSlider && <UrlSlider touchUrlData={touchUrlData} />}
    </div>
  )
}
