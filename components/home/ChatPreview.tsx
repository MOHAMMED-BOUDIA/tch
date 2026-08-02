import { MessageSquare, Search, Send, Circle } from "lucide-react";

const CHANNELS = [
  { name: "general", active: true, unread: 3 },
  { name: "design", active: false, unread: 0 },
  { name: "engineering", active: false, unread: 5 },
  { name: "random", active: false, unread: 0 },
];

const MESSAGES = [
  { name: "Alex", text: "Hey team, the new graph visualization is looking great!", time: "10:32 AM", own: false },
  { name: "Jordan", text: "Agreed! The animations are smooth now.", time: "10:33 AM", own: false },
  { name: "You", text: "I'll push the latest changes to staging.", time: "10:35 AM", own: true },
  { name: "Elena", text: "Reviewed. LGTM! 🚀", time: "10:36 AM", own: false },
];

export default function ChatPreview() {
  return (
    <div className="w-full max-w-[760px] mx-auto bg-canvas rounded-sm border border-hairline overflow-hidden product-shadow">
      <div className="flex h-[360px]">
        <div className="w-48 bg-canvas-parchment border-r border-hairline flex flex-col">
          <div className="p-3 border-b border-hairline">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-ink-muted-48" />
              <input
                readOnly
                className="w-full bg-canvas h-8 pl-7 pr-3 rounded-pill text-[11px] text-ink outline-none placeholder:text-ink-muted-48 border border-hairline"
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="flex-1 p-2 space-y-0.5">
            <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-ink-muted-48">Channels</div>
            {CHANNELS.map((ch) => (
              <div
                key={ch.name}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xs text-[11px] cursor-default ${
                  ch.active ? "bg-primary/10 text-primary font-semibold" : "text-ink-muted-48 hover:text-ink"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span># {ch.name}</span>
                </div>
                {ch.unread > 0 && (
                  <span className="bg-primary text-white rounded-full min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold px-1">
                    {ch.unread}
                  </span>
                )}
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-hairline px-2 text-[9px] font-bold uppercase tracking-widest text-ink-muted-48">
              Direct Messages
            </div>
            {["Alex", "Jordan", "Elena"].map((name) => (
              <div key={name} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xs text-[11px] text-ink-muted-48 hover:text-ink cursor-default">
                <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                {name}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2.5 border-b border-hairline flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-ink"># general</span>
              <span className="text-[10px] text-green-500 flex items-center gap-1">
                <Circle className="w-1.5 h-1.5 fill-green-500" /> Online
              </span>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-hidden">
            {MESSAGES.map((msg, i) => (
              <div key={i} className={`flex ${msg.own ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-sm text-[11px] leading-relaxed ${
                    msg.own
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-canvas-parchment text-ink rounded-bl-sm"
                  }`}
                >
                  {!msg.own && (
                    <div className="text-[9px] font-semibold text-primary mb-0.5">{msg.name}</div>
                  )}
                  {msg.text}
                  <div className={`text-[9px] mt-1 ${msg.own ? "text-white/60" : "text-ink-muted-48"}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-hairline">
            <div className="flex items-center gap-2 bg-canvas-parchment rounded-pill px-3.5 py-2 border border-hairline">
              <input
                readOnly
                className="flex-1 bg-transparent text-[11px] text-ink outline-none placeholder:text-ink-muted-48"
                placeholder="Message #general..."
              />
              <Send className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
