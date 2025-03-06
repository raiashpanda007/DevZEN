"use client"
import { useSelector,  } from 'react-redux'
import Loader from './Loader'
import { RootState } from '@/store/store'

function LoaderScreen() {
    const loader = useSelector((state:RootState) => state.loader.isLoading)
  return (
    <>
      {loader ? (
        <div className='absolute top-24 w-full h-[calc(100%-96px)]  bg-opacity-50 backdrop-blur-lg flex flex-col justify-center items-center z-[9999]'>
          <Loader />
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default LoaderScreen