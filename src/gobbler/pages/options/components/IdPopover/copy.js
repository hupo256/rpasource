import React, { useState, useMemo } from 'react';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

/**
 * copy hooks
 * @param {copyEl} element 要拷贝的dom元素
 */
export default function useCopy(getCopyEl) {
  const [IconFlag, setIconFlag] = useState(true);

  const handleCopy = (e) => {
    e.stopPropagation()
    const range = document.createRange();
    window.getSelection().removeAllRanges();
    range.selectNodeContents(getCopyEl());
    window.getSelection().addRange(range);
    const tag = document.execCommand('copy');
    if (tag) {
      setIconFlag(false);
    }
    window.getSelection().removeAllRanges();
  };

  const copyIcon = useMemo(() => {
    return IconFlag ? (
      <CopyOutlined
        onClick={handleCopy}
        style={{ fontSize: '10px', margin: '0' }}
      />
    ) : (
        <CheckOutlined
          style={{ fontSize: '12px', margin: '0', color: '#52C41AFF' }}
        />
      )
  }, [IconFlag])

  return [copyIcon, setIconFlag]
}
