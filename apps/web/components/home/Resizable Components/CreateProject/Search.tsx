"use client"
import { useState,useEffect } from 'react'
import { Input } from '@workspace/ui/components/input'
import { FaSearch } from 'react-icons/fa'
import SearchList from './SearchList'
import { useDebounce } from 'react-use'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../../store/store'
import { Template } from '@workspace/types'

function SearchItems(searchTerm: string, templates:Template[]) {
    return templates.filter((template) => template.name.toLowerCase().includes(searchTerm.toLowerCase()))

}
function Search() {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Template[]>([]);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 750, [searchTerm]);
    const templates = useSelector((state: RootState) => state.templates)
    useEffect(() => {
        if (debouncedSearchTerm.trim() === "") {
          setSearchResults([]); // Show nothing if input is empty
        } else {
          setSearchResults(SearchItems(debouncedSearchTerm, templates));
        }
      }, [debouncedSearchTerm, templates]);
      

  return (
    <div className='h-96 relative'>
        <Input placeholder="Template" className="w-full " onChange={(e) => setSearchTerm(e.target.value)} />
        <FaSearch className="absolute top-3 right-3 text-gray-400" />
        <SearchList templates={searchResults}/>
    </div>
  )
}

export default Search