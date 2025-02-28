import React from 'react'
import {Input} from '@workspace/ui/components/input'
import {Button} from '@workspace/ui/components/button'
import { FiSearch } from 'react-icons/fi'
function SearchInput() {
  return (
    <div className='flex h-24 w-full justify-evenly'>
        <Input placeholder='Search your project . . .' className='w-4/5'/>
        <Button className='w-1/6' variant='secondary'>
            <FiSearch />
        </Button>
    </div>
  )
}

export default SearchInput