import React from "react";
import type { Template } from "@workspace/types";
function SearchListItem({ name, image, id }: Template) {
  return (
    <div className="flex w-full h-16 items-center justify-between hover:border rounded-lg px-2 cursor-pointer">
      <img src={image} alt="" className={image=== "next.svg"?"w-10 h-10 rounded-full bg-white border border-black":"w-10 h-10 rounded-full"} />
      <div className="ml-4">
        <h1 className="text-sm font-semibold">{name}</h1>
        <p className="text-xs text-gray-400">Template</p>
      </div>
    </div>
  );
}

export default SearchListItem;
