import React, { createContext, useState } from 'react'

export const ctx = createContext({})
export function Provider({ children }) {
  const [showSlider, setshowSlider] = useState(false)

  const value = {
    showSlider,
    setshowSlider,
  }

  return <ctx.Provider value={value}>{children}</ctx.Provider>
}
