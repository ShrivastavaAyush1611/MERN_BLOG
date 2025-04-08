import React from 'react'
import loadingIcons from '@/assets/images/loading.svg'
function Loading() {
  return (
    <div className='w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center'>
    <img src={loadingIcons} width={100}/>
    </div>
  )
}

export default Loading