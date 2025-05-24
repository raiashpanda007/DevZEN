function DialogBox({loaderState}: {loaderState: boolean}) {
  if (!loaderState) return null;
  return (
    <div className="absolute h-full w-full bg-opacity-50 backdrop-blur-lg flex flex-col justify-center items-center z-[9999]">DialogBox</div>
  )
}

export default DialogBox