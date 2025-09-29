export interface MessageProps {
  id: string;
  type: "Send" | "Recieve";
  content: string;
  createdAt: Date;
}

const date = new Date("2025-09-15");

function Message({
  id = "one",
  type = "Send",
  content = "This",
  createdAt = date,
}: MessageProps) {
  const justify = type === "Send" ? "justify-end" : "justify-start";

  const formatTime = (d?: Date | string) => {
    if (!d) return "";
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (d?: Date | string) => {
    if (!d) return "";
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
  };

  const bubbleClasses =
    type === "Send"
      ? "bg-gradient-to-br from-[#967BD9] to-[#6d46c3] text-white ring-1 ring-white/10 shadow-md"
      : "bg-white text-gray-900 border border-gray-200 shadow-sm";

  return (
    <div className={`w-full flex ${justify} mb-3 px-3`}>
      <div
        className={`${bubbleClasses} rounded-2xl px-5 py-3 max-w-[65%] break-words whitespace-pre-wrap transform transition-all duration-150 hover:shadow-lg`}
        role="article"
        aria-label={`message-${id}`}
      >
        <p className="m-0 text-sm leading-6 font-medium">{content}</p>

        <div
          className={`mt-2 text-[11px] opacity-80 flex items-center gap-2 ${
            type === "Send" ? "justify-end" : "justify-start"
          }`}
        >
          <span className="opacity-70">{formatDate(createdAt)}</span>
          <span className="opacity-60">{formatTime(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default Message;
