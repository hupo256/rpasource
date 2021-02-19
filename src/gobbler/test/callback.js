export const handleSubmit = (props) => {
  // 点击保存之后的操作
}

export const handleEdit = () => {
  // 点击编辑的操作
}

export const handleCnacel = () => {
  // 点击取消的操作
}

export const handleOpenEdit = (item) => {
  console.log(item)
}

export const handleOpenView = (item) => {
  console.log(item)
}

export const onTableActionClick = (type, row) => {
  // 点击删除的操作
  // console.log(type,row)
}

export const columnCallback = (item) => {
  // 点击列的按钮的操作
  console.log(item)
}

export const showMore = () => {
  // 点击查看更多
}

// table tag
export const getTagData = () => {
  let promise = new Promise(function(resolve, reject) {
    resolve({generalParameters :[
            {
              bizGeneralParamCatId: null,
              generalParamTypeId: "IMCM",
              generalParameterId: "ITY01",
              generalParameterName: 'asdfghjklZxcvbnmqwertyuiop',
              parameterScript: null
            },
            {
              bizGeneralParamCatId: null,
              generalParamTypeId: "IMCM",
              generalParameterId: "IMCM02",
              generalParameterName: "HTTP",
              parameterScript: null
            }
          ],
            tableId: 'authorizationObjectId'
            }
    )
  })
  return [promise]
}

// 滚动加载
export const loadTableData = (item) => {
  console.log(item)
}

// 获取头像url
export const getAvatarData = () => {
  let promise = new Promise(function(resolve, reject) {
    resolve([
            {
              userAvatarUrl:"https://oss.dev.meizhilab.com/BS-USAM/Avatar/202001/1bwxkqwpwlxc/f42f43f1-7583-4129-adf7-42922aca0d61.png!avatar?auth_key=1585016481-e6282463-0-f3ace596a2d34fb60071864cc5bc8b39",
              // userAvatarUrl: ''
              accountId: "ac-y50x34xppts"
            }
            ])
  })
  return promise
}