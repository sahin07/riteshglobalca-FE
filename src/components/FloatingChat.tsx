'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
        {/* WhatsApp Button */}
        {!isOpen && (
          <button
            onClick={handleWhatsApp}
            className="w-14 h-14 rounded-full shadow-lg grid place-items-center hover:scale-105 transition-transform bg-white overflow-hidden"
            aria-label="WhatsApp"
          >
            <Image src="/images/chatbot/logos_whatsapp-icon.png" alt="WhatsApp" width={32} height={32} />
          </button>
        )}

        {/* Chat Toggle Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-[#f28e2b] text-white shadow-lg flex flex-col items-center justify-center hover:bg-[#e07d1e] transition-colors"
            aria-label="Open Chat"
          >
            <div className="w-8 h-8 relative">
              <Image src="/images/chatbot/Property 1=Default.png" alt="Chat Bot" fill className="object-contain" />
            </div>
            <span className="text-[10px] font-medium mt-1">Chat</span>
          </button>
        )}
      </div>

      {/* Chat Popup Box */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] bg-[#f8f9fa] rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[550px] animate-fade-in-up">

          {/* Header */}
          <div className="bg-[#f28e2b] px-4 py-4 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative bg-white/20 rounded-full p-1">
                <Image src="/images/chatbot/Property 1=Default.png" alt="Bot Logo" fill className="object-contain p-1" />
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
                className="w-full pl-4 pr-12 py-3 rounded-full border border-slate-300 focus:outline-none focus:border-[#f28e2b] text-[14px]"
              />
              <button
                onClick={handleSend}
                className="absolute right-1 top-1 w-10 h-10 rounded-full bg-[#f28e2b] grid place-items-center hover:bg-[#e07d1e] transition-colors"
                aria-label="Send"
              >
                <div className="w-5 h-5 relative">
                  <Image src="/images/chatbot/Vector (1).png" alt="Send" fill className="object-contain" />
                </div>
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  )
}
