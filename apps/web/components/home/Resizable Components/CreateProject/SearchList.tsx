"use client"
import React from 'react'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import SearchListItem from './SearchListItem'
import { Template } from '@workspace/types'


interface SearchListProps {
  templates: Template[]
  setSelectedTemplates: React.Dispatch<React.SetStateAction<Template | undefined>>
}
function SearchList({ templates, setSelectedTemplates }: SearchListProps) {
  return (
    <>
        
      {templates && templates.length < 1 ? (
        <div className='h-10'></div>
      ) : (
        <ScrollArea className="w-full h-72 rounded-md">
          <div className="p-2">
            {templates.map((template) => (
              <SearchListItem key={template.id} Template={template} setSelectedTemplate={setSelectedTemplates} />
            ))}
          </div>
        </ScrollArea>
      )}
    </>
  )
}

export default SearchList
