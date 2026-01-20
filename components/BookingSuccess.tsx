
import React, { useState, useEffect } from 'react';

interface BookingSuccessProps {
  message: string;
  phone: string;
  onRedirect: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ message, phone, onRedirect }) => {
  const [countdown, setCountdown] = useState(10); // 5 saniyeden 10 saniyeye çıkarıldı

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      onRedirect();
    }

    return () => clearInterval(timer);
  }, [countdown, onRedirect]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 sm:p-12 bg-white rounded-[40px] shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Harika!</h2>
      
      <p className="text-slate-600 text-lg mb-8 leading-relaxed">
        {message}
      </p>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">İletişim Hattımız</span>
        <a href={`tel:${phone}`} className="text-2xl font-bold text-rose-500 hover:text-rose-600 transition-colors">
          {phone}
        </a>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-slate-400 text-sm mb-4">
          <span className="font-bold text-slate-900">{countdown}</span> saniye içinde ana sayfaya yönlendiriliyorsunuz...
        </div>
        
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-rose-500 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 10) * 100}%` }} // Bölü 10 olarak güncellendi
          ></div>
        </div>

        <button 
          onClick={onRedirect}
          className="mt-8 text-rose-500 font-bold hover:underline text-sm"
        >
          Beklemek istemiyorum, hemen dön
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
