interface MessageProps {
  id?: string;
  type?: "Send" | "Recieve";
  content?: string;
  createdAt?: Date;
}

const date = new Date("2025-09-15");

function Message({
  id = "one",
  type = "Send",
  content = "This",
  createdAt = date,
}: Partial<MessageProps>) {
  const bgColor = type === "Send" ? "#967BD9" : "#E5E7EB";
  const justify = type === "Send" ? "justify-end" : "justify-start";
  const textColor = type === "Send" ? "text-white" : "text-black";

  return (
    <div className={`w-full flex ${justify} mb-2`}>
      <div
        style={{ backgroundColor: bgColor }}
        className={`${textColor} rounded-2xl px-4 py-2 max-w-[70%] break-words whitespace-pre-wrap`}
      >
        <p className="m-0">{content}</p>
      </div>
    </div>
  );
}

export default Message;
