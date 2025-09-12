"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { FaSearch } from "react-icons/fa";
import SearchList from "./SearchList";
import { useDebounce } from "react-use";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { Template } from "@workspace/types";

function SearchItems(searchTerm: string, templates: Template[]) {
  return templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
interface SearchProps {
  selectedTemplate?: Template;
  setSelectedTemplate: React.Dispatch<
    React.SetStateAction<Template | undefined>
  >;
}

function Search({ selectedTemplate, setSelectedTemplate }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Template[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchResultVisbility, setSearchResultVisibility] = useState(false);
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 750, [searchTerm]);
  const templates = useSelector((state: RootState) => state.templates);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setSearchResults([]); // Show nothing if input is empty
    } else {
      setSearchResults(SearchItems(debouncedSearchTerm, templates));
    }
  }, [debouncedSearchTerm, templates]);

  return (
    <div className=" relative">
      <Label className="mt-2">Select template</Label>
      <Input
        placeholder="Add template name (node, react, next, turborepo ... )"
        className="w-full"
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSearchResultVisibility(true); // Show dropdown when typing
        }}
        value={selectedTemplate ? selectedTemplate.name : searchTerm} // Keeps selectedTemplate.name after selection
        onFocus={() => setSearchResultVisibility(true)} // Show search results when input is focused
      />
      <FaSearch className="absolute top-8 right-3 text-gray-400" />
      {searchResultVisbility && searchResults.length > 0 && (
        <SearchList
          templates={searchResults}
          setSelectedTemplates={(template) => {
            setSelectedTemplate(template);
            if (template) {
              setSearchTerm(template.name); // Fill input box with selected template name
            }
            setSearchResultVisibility(false); // Hide dropdown after selection
          }}
        />
      )}

      <div>
        {selectedTemplate && (
          <div className="mt-4 ">
            <Label>Selected template</Label>
            <div className="flex items-center space-x-3 border p-5 rounded-xl border-white">
              <img
                src={
                  selectedTemplate.image &&
                  (selectedTemplate.image.startsWith("/")
                    ? selectedTemplate.image
                    : `/${selectedTemplate.image}`)
                }
                alt=""
                className={
                  selectedTemplate.image === "next.svg"
                    ? "w-10 h-10 rounded-full bg-white border border-black"
                    : "w-10 h-10 rounded-full"
                }
              />
              <div>
                <p className="font-semibold">{selectedTemplate.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
