"use client"
import React from 'react'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import SearchListItem from './SearchListItem'
import { Template } from '@workspace/types'

function SearchList({ templates }: { templates: Template[] }) {
  return (
    <>
        {templates.length}
      {templates && templates.length < 1 ? (
        <div></div>
      ) : (
        <ScrollArea className="w-full h-72 border border-gray-300 rounded-md">
          <div className="p-2">
            {templates.map((template) => (
              <SearchListItem key={template.id} {...template} />
            ))}
          </div>
        </ScrollArea>
      )}
    </>
  )
}

export default SearchList
