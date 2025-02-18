import React from 'react'
import Resizable from '@/components/home/Resizable'
function layout({children}:{children:React.ReactNode}) {
  return (
    <Resizable children={children}/>
  )
}

export default layout