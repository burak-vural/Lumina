
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Service, Appointment, SiteSettings } from '../types';
import { generateTimeSlots } from '../constants';

interface BookingWizardProps {
  initialService?: Service | null;
  existingAppointments: Appointment[];
  services: Service[];
  siteSettings: SiteSettings;
  onComplete: (appointment: Omit<Appointment, 'id'>) => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ initialService, existingAppointments, services, siteSettings, onComplete }) => {
  const [step, setStep] = useState(initialService ? 2 : 1);
  const [selectedService, setSelectedService] = useState<Service | null>(initialService || null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  
  // Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeSlots = useMemo(() => generateTimeSlots(siteSettings.startHour, siteSettings.endHour), [siteSettings.startHour, siteSettings.endHour]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm]);

  const busySlots = useMemo(() => {
    return existingAppointments
      .filter(app => app.date === selectedDate && app.status !== 'cancelled')
      .map(app => app.time);
  }, [selectedDate, existingAppointments]);

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsDropdownOpen(false);
    setSearchTerm('');
    handleNext();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !customerInfo.name || !customerInfo.phone) return;
    
    onComplete({
      serviceId: selectedService.id,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed'
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100">
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${step >= s ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {s}
            </div>
            <span className={`text-xs font-semibold ${step >= s ? 'text-rose-500' : 'text-slate-400'}`}>
              {s === 1 ? 'Hizmet Seç' : s === 2 ? 'Tarih & Saat' : 'Bilgiler'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">İstediğiniz Hizmeti Seçin</h2>
            <p className="text-slate-600 text-sm mt-1">Sizin için en uygun bakımı belirleyelim</p>
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Hizmet Listesi</label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between p-4 bg-white border-2 rounded-2xl transition-all text-left ${
                isDropdownOpen ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-100 hover:border-rose-200 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-500">✨</div>
                <div>
                  <div className={`font-bold ${selectedService ? 'text-slate-900' : 'text-slate-500'}`}>
                    {selectedService ? selectedService.name : 'Bir hizmet seçmek için tıklayın...'}
                  </div>
                  {selectedService && (
                    <div className="text-xs text-rose-600 font-bold">{selectedService.duration} dk • {selectedService.price} TL</div>
                  )}
                </div>
              </div>
              <div className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                ▼
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-slate-100 sticky top-0 bg-white">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Hizmetlerde ara..."
                    className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-rose-200 placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar bg-white">
                  {filteredServices.length > 0 ? (
                    filteredServices.map(service => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className="w-full p-4 hover:bg-rose-50 flex items-center justify-between transition-colors border-b border-slate-50 last:border-none group"
                      >
                        <div className="text-left">
                          <div className="font-bold text-slate-900 group-hover:text-rose-700">{service.name}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{service.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-rose-600">{service.price} TL</div>
                          <div className="text-[10px] text-slate-500 font-bold">{service.duration} dk</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500 text-sm italic">Hizmet bulunamadı.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Öne Çıkanlar</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm text-slate-700 font-semibold">
                <span className="text-rose-500 text-lg">✓</span> <span>Uzman Estetisyenler</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-700 font-semibold">
                <span className="text-rose-500 text-lg">✓</span> <span>Hijyenik Ortam</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-700 font-semibold">
                <span className="text-rose-500 text-lg">✓</span> <span>Premium Markalar</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-700 font-semibold">
                <span className="text-rose-500 text-lg">✓</span> <span>Güler Yüzlü Hizmet</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Randevu Zamanı</h2>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Randevu Tarihi</label>
            <input 
              type="date" 
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-4 bg-white rounded-xl border-2 border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none shadow-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Müsait Saatler</label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(time => {
                const isBusy = busySlots.includes(time);
                return (
                  <button
                    key={time}
                    disabled={isBusy}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      isBusy ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' :
                      selectedTime === time ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200' :
                      'bg-white border-slate-200 text-slate-700 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex space-x-4 pt-4">
            <button onClick={handlePrev} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Geri</button>
            <button 
              onClick={handleNext} 
              disabled={!selectedTime}
              className="flex-1 py-4 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 disabled:opacity-50 transition-all active:scale-95"
            >
              Devam Et
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">İletişim Bilgileri</h2>
          <div className="bg-rose-50 p-5 rounded-2xl border-2 border-rose-100 mb-6 shadow-sm">
            <div className="text-sm font-extrabold text-rose-800 mb-1">{selectedService?.name}</div>
            <div className="text-xs text-rose-700 font-bold uppercase tracking-wider">{selectedDate} • {selectedTime}</div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Adınız ve Soyadınız</label>
            <input 
              required
              type="text" 
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              className="w-full p-4 bg-white rounded-xl border-2 border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none shadow-sm placeholder:text-slate-400"
              placeholder="Örn: Ayşe Yılmaz"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Telefon Numaranız</label>
            <input 
              required
              type="tel" 
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              className="w-full p-4 bg-white rounded-xl border-2 border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none shadow-sm placeholder:text-slate-400"
              placeholder="05xx xxx xx xx"
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={handlePrev} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Geri</button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-300 transition-all active:scale-95 hover:bg-slate-800"
            >
              Randevuyu Onayla
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookingWizard;
