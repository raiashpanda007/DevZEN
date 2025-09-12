import React from "react";
import type { Template } from "@workspace/types";
interface SearchListItemProps {
  Template: Template;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<Template| undefined>>;
}
function SearchListItem({ Template, setSelectedTemplate }: SearchListItemProps) {
  function handleSelectTemplate() {
    setSelectedTemplate(Template);
  }
  return (
    <div className="flex w-full h-16 items-center justify-between hover:border rounded-lg px-2 cursor-pointer" onClick={handleSelectTemplate}>
      <img
        src={Template.image && (Template.image.startsWith('/') ? Template.image : `/${Template.image}`)}
        alt=""
        className={
          Template.image === "next.svg"
            ? "w-10 h-10 rounded-full bg-white border border-black"
            : "w-10 h-10 rounded-full"
        }
      />
      <div className="w-5/6 ">
        <h1 className="text-sm font-semibold">{Template.name}</h1>
        <p className="text-xs text-gray-400">Template</p>
      </div>
    </div>
  );
}

export default SearchListItem;
