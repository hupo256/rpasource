export function changeTopUrl(history) {
  window.addEventListener('message', e => {
    if (!e.data || e.data.type) return
    console.log(e.data)
    const { url } = JSON.parse(e.data)
    if (url) {
      // console.log(url)
      const optHash = url.split('#')[1]
      if (optHash) {
        //  有hash则同步至iframe
        history.push(`/option/${optHash}`)
      }
    }
  })

  senMsgtoTop()
}

function senMsgtoTop() {
  const pagekey = window.location.href.split('/').pop()
  window.parent.postMessage(JSON.stringify({ pagekey }), '*')
}
