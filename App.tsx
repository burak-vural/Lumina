
import React, { useState, useEffect } from 'react';
import { ViewState, Service, Appointment, SiteSettings } from './types';
import { SERVICES as INITIAL_SERVICES, INITIAL_CATEGORIES } from './constants';
import Header from './components/Header';
import ServiceCard from './components/ServiceCard';
import BookingWizard from './components/BookingWizard';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AiAssistant from './components/AiAssistant';
import BookingSuccess from './components/BookingSuccess';
import { notificationService } from './services/notificationService';

const DEFAULT_SETTINGS: SiteSettings = {
  bannerTitle: 'Güzelliğinizi Lumina ile Keşfedin',
  bannerSubtitle: 'Profesyonel ellerde kendinizi şımartın. Modern teknikler ve premium ürünlerle en iyi versiyonunuza dönüşün.',
  bannerImage: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop',
  logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Lumina&backgroundColor=f43f5e',
  startHour: 9,
  endHour: 19,
  successMessage: 'Randevunuz başarıyla oluşturuldu! Dilerseniz aşağıdaki numaramızdan bizimle iletişime geçebilirsiniz. Sağlıklı günler dileriz.',
  contactPhone: '0212 555 00 00'
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('lumina_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
    return DEFAULT_SETTINGS;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('lumina_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('lumina_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('lumina_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  // Background Reminder Checker
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      let hasUpdates = false;
      const updatedAppointments = appointments.map(app => {
        if (app.status !== 'confirmed' || app.reminderSent) return app;

        const [hours, minutes] = app.time.split(':').map(Number);
        const appDate = new Date(app.date);
        appDate.setHours(hours, minutes, 0, 0);

        const diffInMinutes = (appDate.getTime() - now.getTime()) / (1000 * 60);

        // Randevuya 60 dakika (1 saat) kala bildirim gönder
        if (diffInMinutes > 0 && diffInMinutes <= 60) {
          const serviceName = services.find(s => s.id === app.serviceId)?.name || 'Hizmetiniz';
          notificationService.sendNotification(
            'Lumina Randevu Hatırlatması',
            `Sayın ${app.customerName}, "${serviceName}" randevunuza 1 saat kaldı. Sizi bekliyoruz!`,
            siteSettings.logoUrl
          );
          hasUpdates = true;
          return { ...app, reminderSent: true };
        }
        return app;
      });

      if (hasUpdates) {
        setAppointments(updatedAppointments);
      }
    };

    const interval = setInterval(checkReminders, 30000); // Her 30 saniyede bir kontrol et
    checkReminders(); // İlk yüklemede de kontrol et
    return () => clearInterval(interval);
  }, [appointments, services, siteSettings.logoUrl]);

  useEffect(() => {
    localStorage.setItem('lumina_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('lumina_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('lumina_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('lumina_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
  };

  const handleBookingComplete = (data: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      reminderSent: false
    };
    setAppointments(prev => [...prev, newAppointment]);
    setView('success');
  };

  const handleAddManual = (data: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      reminderSent: false
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const handleClearAppointments = () => {
    setAppointments([]);
  };

  const handleUpdateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const handleAddService = (newServiceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...newServiceData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setServices(prev => [...prev, newService]);
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const handleDeleteCategory = (category: string) => {
    const isUsed = services.some(s => s.category === category);
    if (isUsed) {
      alert('Bu kategoriye ait hizmetler olduğu için silemezsiniz. Önce ilgili hizmetleri güncelleyin veya silin.');
      return;
    }
    setCategories(prev => prev.filter(c => c !== category));
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setView('booking');
  };

  const handleAdminLogin = (password: string) => {
    setIsAdminAuth(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentView={view} onNavigate={(v) => { setView(v); if (v !== 'booking') setSelectedService(null); }} />
      
      {/* Notification Banner */}
      {notificationPermission === 'default' && view === 'home' && (
        <div className="bg-slate-900 text-white p-3 text-center text-sm animate-in slide-in-from-top duration-500">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
            <span className="font-medium">🔔 Randevu hatırlatmalarını kaçırmamak için bildirimleri açın!</span>
            <button 
              onClick={handleRequestPermission}
              className="bg-rose-500 hover:bg-rose-600 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            >
              Bildirimleri Etkinleştir
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {view === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative h-[450px] rounded-[40px] overflow-hidden bg-slate-900 text-white flex items-center px-6 sm:px-12">
              <div className="relative z-10 max-w-xl">
                <h1 className="text-4xl sm:text-5xl font-serif mb-6 leading-tight whitespace-pre-wrap">{siteSettings.bannerTitle}</h1>
                <p className="text-slate-300 mb-8 text-lg">{siteSettings.bannerSubtitle}</p>
                <button 
                  onClick={() => setView('booking')}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-rose-900/40 transform hover:-translate-y-1"
                >
                  Hemen Randevu Al
                </button>
              </div>
              <img 
                src={siteSettings.bannerImage} 
                className="absolute inset-0 w-full h-full object-cover opacity-60" 
                alt="Spa"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
            </section>

            {/* Services Grid */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Hizmetlerimiz</h2>
                  <p className="text-slate-500">İhtiyacınıza uygun profesyonel çözümler</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(service => (
                  <ServiceCard 
                    key={service.id} 
                    service={{...service, image: siteSettings.logoUrl}} 
                    onSelect={handleSelectService} 
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'booking' && (
          <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-serif text-center mb-10 text-slate-800">Randevu Oluştur</h1>
            <BookingWizard 
              initialService={selectedService} 
              existingAppointments={appointments}
              onComplete={handleBookingComplete} 
              services={services}
              siteSettings={siteSettings}
            />
          </div>
        )}

        {view === 'success' && (
          <BookingSuccess 
            message={siteSettings.successMessage} 
            phone={siteSettings.contactPhone} 
            onRedirect={() => setView('home')} 
          />
        )}

        {view === 'admin' && (
          <>
            {!isAdminAuth ? (
              <AdminLogin onLogin={handleAdminLogin} />
            ) : (
              <AdminDashboard 
                appointments={appointments} 
                services={services}
                categories={categories}
                siteSettings={siteSettings}
                onCancel={handleCancelAppointment} 
                onAddManual={handleAddManual}
                onUpdateService={handleUpdateService}
                onAddService={handleAddService}
                onDeleteService={handleDeleteService}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateSettings={setSiteSettings}
                onClearAppointments={handleClearAppointments}
              />
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img 
            src={siteSettings.logoUrl} 
            className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-slate-100 shadow-sm" 
            alt="Logo"
          />
          <div className="text-2xl font-serif font-bold text-rose-500 italic mb-4">Lumina</div>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Güzellik ve sağlık dolu yarınlar için yanınızdayız.
          </p>
          <div className="text-xs text-slate-400 border-t border-slate-50 pt-8">
            © 2024 Lumina Beauty & Wellness. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>

      <AiAssistant />
    </div>
  );
};

export default App;
