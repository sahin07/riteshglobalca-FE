'use client'
import { useState, useRef, useEffect } from 'react'
import chatReplies from '@/data/chat-replies.json'

type Message = {
  sender: 'bot' | 'user'
  text: string
  time: string
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hi! Welcome to Ritesh Arora & Associates.\nHow can we help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickReplies = [
    "Services & Pricing",
    "Book a Free Consultation",
    "GST / Filing Help",
    "Talk to a CA / Live Agent",
    "Leave a Message"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleQuickReply = (reply: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { sender: 'user', text: reply, time }])

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = (chatReplies as Record<string, string>)[reply] || chatReplies["Leave a Message"]
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 600)
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { sender: 'user', text: inputValue, time }])
    setInputValue('')

    // Simulate generic bot response for custom input
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: chatReplies["Leave a Message"],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 600)
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi, I would like to know more about your services.')
    window.open(`https://wa.me/919888466739?text=${message}`, '_blank')
  }

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-3">
        {/* WhatsApp Button */}
        {!isOpen && (
          <button
            onClick={handleWhatsApp}
            className="group relative w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] grid place-items-center hover:bg-[#1ebe57] hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </button>
        )}

        {/* Chat Toggle Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative w-14 h-14 rounded-full bg-[#F19020] text-white shadow-[0_8px_24px_rgba(241,144,32,0.45)] grid place-items-center hover:bg-[#e07d1e] hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F19020]"
            aria-label="Open live chat"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              <circle cx="9" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
              <circle cx="12" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
              <circle cx="15" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </button>
        )}
      </div>

      {/* Chat Popup Box */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[350px] max-w-[calc(100vw-2rem)] bg-[#f8f9fa] rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[min(550px,calc(100dvh-2rem))] sm:h-[550px] animate-fade-in-up">

          {/* Header */}
          <div className="bg-[#F19020] px-4 py-4 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 grid place-items-center text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                  <circle cx="9" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg">Live Chat</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close Chat"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat History & Quick Replies */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-3 max-w-[85%] rounded-2xl whitespace-pre-wrap text-[15px] ${msg.sender === 'user'
                      ? 'bg-[#0b293d] text-white rounded-br-sm'
                      : 'bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100'
                    }`}
                >
                  {msg.text}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {/* Quick Replies (Only show if last message is from bot) */}
            {messages[messages.length - 1].sender === 'bot' && (
              <div className="mt-2 flex flex-col items-start gap-2 animate-fade-in">
                <p className="text-[13px] font-medium text-[#0b293d] mb-1">Quick Replies</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply)}
                      className="px-4 py-2 bg-white border border-[#0b293d] text-[#0b293d] rounded-full text-[13px] hover:bg-[#0b293d] hover:text-white transition-colors text-left"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="How can I help you today?"
                className="w-full pl-4 pr-12 py-3 rounded-full border border-slate-300 focus:outline-none focus:border-[#F19020] text-[14px]"
              />
              <button
                onClick={handleSend}
                className="absolute right-1 top-1 w-10 h-10 rounded-full bg-[#F19020] grid place-items-center text-white hover:bg-[#e07d1e] transition-colors"
                aria-label="Send"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  )
}
