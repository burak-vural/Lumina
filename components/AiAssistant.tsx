
import React, { useState, useRef, useEffect } from 'react';
import { getBeautyAdvice, analyzeSkin } from '../services/geminiService';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Merhaba! Ben Lumina Güzellik Asistanı. Size nasıl yardımcı olabilirim? Cilt bakımı veya hizmetlerimiz hakkında soru sorabilirsiniz.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    
    const response = await getBeautyAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: response || 'Bir sorun oluştu.' }]);
    setIsTyping(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setMessages(prev => [...prev, { role: 'user', text: '📷 Bir cilt fotoğrafı gönderdi.' }]);
      setIsTyping(true);
      const advice = await analyzeSkin(base64);
      setMessages(prev => [...prev, { role: 'ai', text: advice || 'Analiz başarısız.' }]);
      setIsTyping(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center mr-2">✨</div>
              <span className="font-bold">Güzellik Asistanı</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-rose-400">✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-rose-500 text-white rounded-br-none' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center space-x-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Cilt Analizi İçin Fotoğraf Yükle"
              >
                📸
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Bir şeyler sorun..."
                className="flex-grow p-3 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-rose-200"
              />
              <button 
                onClick={handleSend}
                className="bg-rose-500 text-white p-3 rounded-xl hover:bg-rose-600 transition-colors"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-rose-500 text-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform active:scale-95 border-4 border-white"
        >
          ✨
        </button>
      )}
    </div>
  );
};

export default AiAssistant;
