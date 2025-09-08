import React, { useState, useEffect } from 'react'
import {Input} from '@workspace/ui/components/input'
import {Button} from '@workspace/ui/components/button'
import { FiSearch } from 'react-icons/fi'

interface SearchInputProps {
  onSearch?: (term: string) => void
}

function SearchInput({ onSearch }: SearchInputProps) {
  const [term, setTerm] = useState("")

  // debounce calling onSearch to avoid filtering on every keystroke
  useEffect(() => {
    const id = setTimeout(() => onSearch?.(term), 300)
    return () => clearTimeout(id)
  }, [term, onSearch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value)
  }

  const handleClick = () => {
    // immediate search when clicking the button
    onSearch?.(term)
  }

  return (
    <div className='flex h-24 w-full justify-evenly'>
        <Input value={term} onChange={handleChange} placeholder='Search your project . . .' className='w-4/5'/>
        <Button onClick={handleClick} className='w-1/6' variant='secondary'>
            <FiSearch />
        </Button>
    </div>
  )
}

export default SearchInput
