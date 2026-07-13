import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Plus, Phone, Video, Info, Send, Image as ImageIcon, 
  Smile, Mic, Paperclip, MoreVertical, Reply, CornerDownLeft, 
  FolderOpen, Link as LinkIcon, ShieldAlert, UserPlus, BellOff, X 
} from "lucide-react";
import NexusImage from "./NexusImage";
import LazyList from "./LazyList";
import { Message, User, ChatSession } from "../types";

// Premium avatar URLs from the screenshots
const BOT_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuAmTQ3wTfPH9-22mVzha4FkzU63r8jwdnTWUwmREhEBbKkW2GN0Vw74FPSgVVxwwr4U_nArC6ZmqYaGnmQBhsbDibzYV7hU0xMv4-gnAo4hwi6oHJbU3TH9tg9-jrIw87yQ3f9yL5IhpnR1UuWKz7enPcSr7Ny_FKNb5MuY7VEJhwdf3Kbn0ljjgaiIUQozUS4C-exmErpXqMTxOC_t0woQznZ8IRRq5wW078nnAYxtdwcSMzrjybsOriAAso_K50PZYL2TbZmpZeK_";
const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2rOqwpJ0X-_ADZIqWKW0SfxKxR3beTpohMe5_GJBLmF6LQz9iYdZSSxl3pMK5iSCJtJuKpQnGX_I38W1DalIvKPoUZQ-A98tASJVFrk0sURvOUtL5qhl4PZv4pcVzuXub9lFCtik2DBYjaI0NomahIFvK7mTnOgvGtg-H4uNHSaE8GyBYGjCpTzAzxp4OVeZEAvW2cEeo7os3niKA8I1G-sZAj3CsGUC99sAYSudazHFCnGokLan0mVd1Bp0OTennuiApZ-f3fFhb";
const SARAH_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuC6HEJaqxObeH0x0f896h78R_nw8--j2U0dOnJlen5G6bUduuRxJ1xhPp3UlXX9LXPhfw0Agf7yDuurtzYbdl5MYZ7jWvPvYHanYvn1mbPZMnJWBOh1gufTwu7NGTgJgvnx8s386sEW-EsNRoi2f85rENAgOgCKRI5BwTtumquQRmguRonBgvVmSGEQfFMDV3wD6Uny82hA7JbNii_doF-m63GvQxhMijcpVnOo9VkWRaqcGKL-QQ5F0XIeUavVs1xG5nCboFXpjFeK";
const JORDAN_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXu-I76lzziGAW3a0ac_ctyLVC4IOf2l25OrX6gm2juNOnF98-ijSnwvsjk_jLudHyEbQSuZE0Y4o56m-LwTEQ0YaLxpABRAYaH5XZ-zSIMbkHZzc4Yy6-2A4Ped6IqEXcdq4z9L_QQjkJea2YOzoe5PL3AiYvk0U9_iCYRFpoWi1YARHfIuuML6vsl1twKOhOD6OlNR26SIhlht24CEgE5VcrwwpCXxQmyKxrS-iTeNLcx9Iz6dPYYGY80qhfxPFdDH4N8fhl2-JQXL";
const ELENA_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBbm2tYCzCF9eECp-MpOGdw7iihvv0aOHiVmddwzxoRj7An-tL4pXgZN7R6REQWy0dyrh3Gfz9WrGdVoISbEbW_ZEzwBvgLdXBRRdSCT49kFx1yFIigSEqYQnrt3Do3E0QNMrg6fcCd8Q_k4DZ3JAonKG-QvyA2I8M05-gNymKRC-Vf_fjqCPMKhPhNv9kzhukXXM4nvhJJAIyOL381c1am3Kjtw8sDdt8Cm3BZI17PRY0UNhWV6lEyPEGWpnTkCz4DicATxBA_b4NQ";

const initialUsers: User[] = [
  { id: "1", name: "Sarah", role: "Creative Lead", avatar: SARAH_AVATAR, status: "online" },
  { id: "2", name: "Jordan", role: "Dev-Ops", avatar: JORDAN_AVATAR, status: "online" },
  { id: "3", name: "Elena", role: "Lead Designer", avatar: ELENA_AVATAR, status: "away" },
];

const initialChats: ChatSession[] = [
  { id: "bot", name: "Project Nexus Bot", avatar: BOT_AVATAR, lastMessage: "The deployment is successful! We are live.", time: "Just now", active: true },
  { id: "design", name: "Design Sync", avatar: ELENA_AVATAR, lastMessage: "Sarah: The new icons look amazing...", time: "14:20" },
  { id: "client", name: "Mark (Client)", avatar: JORDAN_AVATAR, lastMessage: "Can we schedule a call for tomorrow?", time: "Yesterday" },
];

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Nexus Assistant",
      content: "Welcome back, Alex. I've finished processing the analytics for the **Nexus Core** deployment. \n\nPerformance is up by 24% and latency has decreased significantly in the EU-West region. Would you like to see the full report?",
      timestamp: "09:12 AM",
      avatar: BOT_AVATAR,
      role: "assistant",
    },
    {
      id: "2",
      sender: "You",
      content: "That's excellent news! Yes, please generate a visualization for the latency improvements. Also, check if there are any outliers in the Tokyo region.",
      timestamp: "09:15 AM",
      avatar: USER_AVATAR,
      role: "user",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState("bot");

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: USER_AVATAR,
      role: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      // Build full conversation payload for server-side Gemini invocation
      const messageHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messageHistory }),
      });

      const data = await res.json();
      const botReply = data.content || "An issue occurred while querying the server.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "Nexus Assistant",
          content: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: BOT_AVATAR,
          role: "assistant",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "Nexus Assistant",
          content: "Sorry, I ran into an error connecting with the servers. Please verify connection configurations.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: BOT_AVATAR,
          role: "assistant",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredChats = initialChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex h-full overflow-hidden" id="nexus-chat-view">
      {/* Left Chat List Sidebar (Width: 80 / 20rem) */}
      <section className="w-80 bg-[#0f0f0f] border-r border-[#222] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#222]">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-[#00f2ff] transition-colors" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] h-10 pl-9 pr-4 rounded-xl border border-[#222] text-sm text-white focus:ring-1 focus:ring-[#00f2ff] focus:border-[#00f2ff] transition-all outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
          {/* Online Users Carousel */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#666]">Online Users</h3>
              <Plus className="w-3.5 h-3.5 text-slate-400 opacity-60 cursor-pointer hover:opacity-100" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {initialUsers.map((user) => (
                <div key={user.id} className="flex flex-col items-center gap-1 cursor-pointer group shrink-0">
                  <div className="relative w-11 h-11">
                    <div className={`w-11 h-11 rounded-full p-[2px] ${user.status === 'online' ? 'border-2 border-green-500' : 'border border-[#222]'}`}>
                      <NexusImage src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    {user.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f]" />
                    )}
                    {user.status === 'away' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-[#0f0f0f]" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-[#00f2ff] transition-colors font-medium">{user.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Chats - Lazy Loaded */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#666] px-1 mb-2">Recent Chats</h3>
            
            <LazyList 
              items={filteredChats}
              initialCount={4}
              increment={4}
              renderItem={(chat) => (
                <div 
                  key={chat.id}
                  onClick={() => chat.id === 'bot' && setActiveChat('bot')}
                  className={`p-3 rounded-xl cursor-pointer border relative overflow-hidden transition-all group ${
                    activeChat === chat.id 
                      ? 'bg-[#161616] border-[#00f2ff]/30 shadow-sm' 
                      : 'border-transparent hover:bg-[#161616]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <NexusImage src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white truncate">{chat.name}</span>
                        <span className={`text-[10px] ${activeChat === chat.id ? 'text-[#00f2ff]' : 'text-slate-500'}`}>{chat.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate leading-relaxed">{chat.lastMessage}</p>
                    </div>
                  </div>
                  {activeChat === chat.id && (
                    <div className="absolute right-0 top-0 h-full w-1 bg-[#00f2ff]" />
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </section>

      {/* Main Chat Content Workspace */}
      <section className="flex-1 flex flex-col bg-[#050505] overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#222] bg-[#0a0a0a]/90 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00f2ff]/10 flex items-center justify-center border border-[#00f2ff]/20 shadow-inner">
              <span className="text-[#00f2ff] text-lg">⚡</span>
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Project Nexus Bot</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse" />
                <span className="text-[10px] text-[#00f2ff] font-medium tracking-wide uppercase">Active Optimization</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-9 h-9 rounded-full hover:bg-[#161616] flex items-center justify-center text-slate-400 hover:text-[#00f2ff] transition-colors cursor-pointer">
              <Phone className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-[#161616] flex items-center justify-center text-slate-400 hover:text-[#00f2ff] transition-colors cursor-pointer">
              <Video className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                showDetails ? 'bg-[#00f2ff]/20 text-[#00f2ff]' : 'hover:bg-[#161616] text-slate-400 hover:text-[#00f2ff]'
              }`}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#050505] relative">
          <div className="absolute inset-0 subtle-grid opacity-20 pointer-events-none" />

          <div className="flex justify-center my-4">
            <span className="px-3 py-1 rounded-full bg-[#0f0f0f] text-[10px] text-[#00f2ff] border border-[#222] uppercase tracking-widest font-bold">Today</span>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-end gap-3 max-w-2xl relative group ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-md border border-[#222]">
                  <NexusImage src={msg.avatar} alt={msg.sender} />
                </div>
                <div className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : ""}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-300">{msg.sender}</span>
                    <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                  </div>
                  <div className={`p-3.5 rounded-2xl relative ${
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-[#00f2ff] to-[#00b0ff] text-black font-semibold rounded-br-none shadow-md shadow-[#00f2ff]/10"
                      : "bg-[#0f0f0f] border border-[#222] text-[#e0e0e0] rounded-bl-none shadow-sm"
                  }`}>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    
                    {/* Floating micro interactions on hover */}
                    <div className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ${
                      msg.role === "user" ? "-left-14" : "-right-14"
                    }`}>
                      <button className="w-6 h-6 rounded-md bg-[#161616] hover:bg-[#222] flex items-center justify-center text-slate-400 hover:text-[#00f2ff] transition-colors cursor-pointer">
                        <Reply className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-6 h-6 rounded-md bg-[#161616] hover:bg-[#222] flex items-center justify-center text-slate-400 hover:text-[#00f2ff] transition-colors cursor-pointer">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-3 bg-[#0f0f0f] border border-[#222] rounded-xl w-fit ml-12"
              >
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-[#00f2ff] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-[11px] text-slate-400 italic">Nexus Assistant is preparing your data...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={threadEndRef} />
        </div>

        {/* Input Footer */}
        <footer className="p-4 bg-gradient-to-t from-[#050505] to-[#050505]/90 border-t border-[#222]">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto bg-[#0f0f0f] border border-[#222] rounded-xl p-1.5 flex items-center gap-2 shadow-2xl relative">
            <button 
              type="button"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#00f2ff] hover:bg-[#161616] transition-colors shrink-0 cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            
            <div className="flex-1">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message Project Nexus Bot..."
                className="w-full bg-transparent border-none text-xs text-[#e0e0e0] placeholder:text-slate-500 focus:ring-0 focus:outline-none py-2"
              />
            </div>

            <div className="flex items-center gap-1 shrink-0 px-1">
              <button 
                type="button"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#00f2ff] hover:bg-[#161616] transition-colors cursor-pointer"
              >
                <Smile className="w-4 h-4" />
              </button>
              <button 
                type="button"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#00f2ff] hover:bg-[#161616] transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button 
                type="submit"
                className="w-10 h-9 rounded-lg bg-[#00f2ff] hover:bg-[#00f2ff]/90 flex items-center justify-center text-black font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#00f2ff]/10 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </form>
          <p className="text-center mt-2.5 text-[10px] text-[#666] font-mono">
            Press <kbd className="px-1.5 py-0.5 rounded border border-[#222] bg-[#0a0a0a]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded border border-[#222] bg-[#0a0a0a]">Shift+Enter</kbd> for new line.
          </p>
        </footer>
      </section>

      {/* Right Sidebar: Details Pane */}
      <AnimatePresence>
        {showDetails && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="bg-[#0f0f0f] border-l border-[#222] overflow-y-auto custom-scrollbar flex flex-col shrink-0 z-10"
          >
            <div className="p-5 border-b border-[#222]">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#00f2ff]">User Details</h3>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3.5 shadow-2xl ring-4 ring-[#00f2ff]/10 border border-[#222]">
                  <NexusImage src={BOT_AVATAR} alt="Nexus Assistant Avatar" />
                </div>
                <h4 className="text-sm font-bold text-white">Nexus Assistant</h4>
                <p className="text-[10px] font-mono text-[#00f2ff] mt-1 uppercase tracking-wider font-semibold">AI-Core V4.2.0</p>
                
                <div className="grid grid-cols-2 gap-2 w-full mt-4">
                  <button className="bg-[#161616] hover:bg-[#00f2ff]/10 hover:text-[#00f2ff] border border-[#222] p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer">
                    <UserPlus className="w-4 h-4 text-[#00f2ff]" />
                    <span className="text-[10px] font-bold">Profile</span>
                  </button>
                  <button className="bg-[#161616] hover:bg-[#00f2ff]/10 hover:text-[#00f2ff] border border-[#222] p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer">
                    <BellOff className="w-4 h-4 text-[#00f2ff]" />
                    <span className="text-[10px] font-bold">Mute</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Media & Actions Panel */}
            <div className="p-5 flex-1 space-y-6">
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-3">Shared Media</h5>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="aspect-square rounded-lg bg-[#161616] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-[#222]">
                    <NexusImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuqQ2Xf8gK2mTGiMhmHR-R4BWSskmOX93AduHxpqAgXZD7z1mVju7pqYhgu6EZ7obeL5ABhDERhYYnhrmqJjE1G10yHyS9pEy3QjQVw8s4xdaWhSFVKuKiwJs810eY8HUkti0QX4p_3PkkZwVcxx3wx5OZ9B7Ug2oVjFPlu4Q2CefRf2alzwlgyRN_AsMEbGWjdkj_RyJy0NxXKVWjcAQj4Hy0iKvWA8pOh8BdyHJaO0rO5lB9oEEx2WpX-ggArLvPksOgp1QaGD0eV" alt="Shared graph" />
                  </div>
                  <div className="aspect-square rounded-lg bg-[#161616] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-[#222]">
                    <NexusImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbOXClRFK603CvCqYdwIAIt2IM-474_mWeg0-EiR1cbVUvG_sEQxEuJx7LYyY6NXk2QLUKgEgcut9ISVjMwRghcikUIzimJbh5yOVlW0inCz9kT1jA0kl92Q77KQsqSQQl-uj6VIiVq65pCuv3uIaBifHNmlfXmIEBjG_srm_qJ5PhxKNDCs7E8x1hb7A3AFuE960Awqx8cZ8514Nu_YD-nBmmHVLHGjZSOYlGOGiMrDlufREUfaxd77NaHYi74hXf9e0lo2y5uFhv" alt="Shared sculpture" />
                  </div>
                  <div className="aspect-square rounded-lg bg-[#161616] overflow-hidden cursor-pointer hover:bg-[#222] transition-all border border-[#222] flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-3">Quick Actions</h5>
                <ul className="space-y-1">
                  <li className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#161616] cursor-pointer group transition-colors">
                    <FolderOpen className="w-4 h-4 text-slate-400 group-hover:text-[#00f2ff] transition-colors" />
                    <span className="text-xs text-slate-300">View Shared Files</span>
                  </li>
                  <li className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#161616] cursor-pointer group transition-colors">
                    <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-[#00f2ff] transition-colors" />
                    <span className="text-xs text-slate-300">Export Chat Links</span>
                  </li>
                  <li className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-500/10 cursor-pointer group transition-colors">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400 font-semibold">Block Assistant</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
