
import React, { useState, useMemo } from 'react';
import { Appointment, Service, SiteSettings } from '../types';
import { generateTimeSlots } from '../constants';

interface AdminDashboardProps {
  appointments: Appointment[];
  services: Service[];
  categories: string[];
  siteSettings: SiteSettings;
  onCancel: (id: string) => void;
  onAddManual: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateService: (service: Service) => void;
  onAddService: (service: Omit<Service, 'id'>) => void;
  onDeleteService: (id: string) => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
  onClearAppointments: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  appointments, 
  services, 
  categories,
  siteSettings,
  onCancel, 
  onAddManual, 
  onUpdateService, 
  onAddService, 
  onDeleteService,
  onAddCategory,
  onDeleteCategory,
  onUpdateSettings,
  onClearAppointments
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'services' | 'categories' | 'settings'>('appointments');
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    serviceId: services[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: ''
  });

  const [newServiceData, setnewServiceData] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    category: categories[0] || '',
    image: ''
  });

  const timeSlots = useMemo(() => generateTimeSlots(siteSettings.startHour, siteSettings.endHour), [siteSettings.startHour, siteSettings.endHour]);

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Bilinmeyen Hizmet';

  const busySlots = useMemo(() => {
    return appointments
      .filter(app => app.date === formData.date && app.status !== 'cancelled')
      .map(app => app.time);
  }, [formData.date, appointments]);

  const stats = {
    total: appointments.length,
    today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
    pending: appointments.filter(a => a.status === 'confirmed').length
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) return;
    onAddManual({
      ...formData,
      status: 'confirmed'
    });
    setShowAddAppModal(false);
    setFormData({ ...formData, customerName: '', customerPhone: '', time: '' });
  };

  const exportToExcel = () => {
    if (appointments.length === 0) {
      alert("İndirilecek randevu bulunmuyor.");
      return;
    }

    // CSV Headers
    const headers = ["Müşteri Adı", "Telefon", "Hizmet", "Tarih", "Saat", "Durum"];
    const csvRows = appointments.map(app => [
      app.customerName,
      app.customerPhone,
      getServiceName(app.serviceId),
      app.date,
      app.time,
      app.status === 'confirmed' ? 'Onaylandı' : 'İptal Edildi'
    ].map(field => `"${field}"`).join(","));

    const csvContent = "\uFEFF" + [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lumina_randevular_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAll = () => {
    if (confirm("Tüm randevu listesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
      onClearAppointments();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif text-slate-800">Yönetim Paneli</h1>
          <p className="text-slate-500">Salon operasyonlarınızı tek noktadan yönetin</p>
        </div>
        <div className="flex flex-wrap gap-2">
           {activeTab === 'appointments' && (
             <>
              <button 
                onClick={() => setShowAddAppModal(true)}
                className="bg-rose-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors"
              >
                + Randevu Ekle
              </button>
              <button 
                onClick={exportToExcel}
                className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors"
              >
                Excel İndir
              </button>
              <button 
                onClick={handleClearAll}
                className="bg-white text-rose-500 border border-rose-100 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-rose-50 transition-colors"
              >
                Listeyi Temizle
              </button>
             </>
           )}
           {activeTab === 'services' && (
             <button 
              onClick={() => setShowAddServiceModal(true)}
              className="bg-rose-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors"
            >
              + Hizmet Ekle
            </button>
           )}
          <button 
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-colors"
            onClick={() => window.print()}
          >
            Yazdır
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-sm font-medium mb-1">Toplam Randevu</div>
          <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-sm font-medium mb-1">Bugünkü Randevular</div>
          <div className="text-3xl font-bold text-rose-500">{stats.today}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-sm font-medium mb-1">Aktif Randevular</div>
          <div className="text-3xl font-bold text-emerald-500">{stats.pending}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('appointments')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'appointments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Randevular
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'services' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Hizmetler
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Kategoriler
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Site Ayarları
        </button>
      </div>

      {/* Settings View */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Ana Sayfa Ayarları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Banner Başlığı</label>
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none h-24 resize-none text-slate-800"
                    value={siteSettings.bannerTitle}
                    onChange={(e) => onUpdateSettings({...siteSettings, bannerTitle: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Banner Alt Yazısı</label>
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none h-24 resize-none text-slate-800"
                    value={siteSettings.bannerSubtitle}
                    onChange={(e) => onUpdateSettings({...siteSettings, bannerSubtitle: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Banner Görsel URL</label>
                  <input 
                    type="text"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-800"
                    value={siteSettings.bannerImage}
                    onChange={(e) => onUpdateSettings({...siteSettings, bannerImage: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">İşletme Logosu (URL)</label>
                  <input 
                    type="text"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-800"
                    value={siteSettings.logoUrl}
                    onChange={(e) => onUpdateSettings({...siteSettings, logoUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Randevu Onay Ayarları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Onay Mesajı</label>
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none h-32 resize-none text-slate-800"
                    value={siteSettings.successMessage}
                    onChange={(e) => onUpdateSettings({...siteSettings, successMessage: e.target.value})}
                    placeholder="Randevu tamamlandığında müşteriye gösterilecek mesaj..."
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">İletişim Numarası</label>
                  <input 
                    type="text"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-800 font-bold"
                    value={siteSettings.contactPhone}
                    onChange={(e) => onUpdateSettings({...siteSettings, contactPhone: e.target.value})}
                    placeholder="0212 555 00 00"
                  />
                  <p className="mt-2 text-xs text-slate-400 italic">Müşterilerin hızlıca arama yapabileceği numara.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">İşletme Saatleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Açılış Saati</label>
                <input 
                  type="number" 
                  min="0" max="23"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-800 font-bold"
                  value={siteSettings.startHour}
                  onChange={(e) => onUpdateSettings({...siteSettings, startHour: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Kapanış Saati</label>
                <input 
                  type="number" 
                  min="0" max="23"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-800 font-bold"
                  value={siteSettings.endHour}
                  onChange={(e) => onUpdateSettings({...siteSettings, endHour: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Appointments View */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Randevu Listesi</h2>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Toplam {appointments.length} kayıt</div>
          </div>
          <div className="overflow-x-auto">
            {appointments.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-8 py-5 font-bold">Müşteri</th>
                    <th className="px-8 py-5 font-bold">Hizmet</th>
                    <th className="px-8 py-5 font-bold">Tarih / Saat</th>
                    <th className="px-8 py-5 font-bold">Hatırlatıcı</th>
                    <th className="px-8 py-5 font-bold">Durum</th>
                    <th className="px-8 py-5 font-bold">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {appointments.sort((a,b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time)).map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-800">{app.customerName}</div>
                        <div className="text-xs text-slate-400 font-medium">{app.customerPhone}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{getServiceName(app.serviceId)}</span>
                      </td>
                      <td className="px-8 py-5 text-sm">
                        <div className="text-slate-800 font-medium">{app.date}</div>
                        <div className="text-rose-500 font-bold">{app.time}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-xs font-bold ${app.reminderSent ? 'text-emerald-500' : 'text-slate-300'}`}>
                          {app.reminderSent ? '✓ Gönderildi' : 'Bekliyor'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                          app.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {app.status === 'confirmed' ? 'Onaylandı' : 'İptal Edildi'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {app.status === 'confirmed' && (
                          <button 
                            onClick={() => { if(confirm('Bu randevuyu iptal etmek istediğinize emin misiniz?')) onCancel(app.id); }}
                            className="text-rose-400 hover:text-rose-600 text-sm font-bold transition-colors"
                          >
                            İptal Et
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center">
                <div className="text-4xl mb-4">📅</div>
                <div className="text-slate-500 font-medium">Henüz kayıtlı randevu bulunmuyor.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Add Appointment Modal */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-rose-500 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Yeni Manuel Randevu</h3>
              <button onClick={() => setShowAddAppModal(false)} className="text-white hover:opacity-70 text-xl">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Müşteri Adı</label>
                  <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Telefon</label>
                  <input required type="tel" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Hizmet</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.serviceId} onChange={(e) => setFormData({...formData, serviceId: e.target.value})}>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tarih</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Saat</label>
                  <select required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                    <option value="">Seçin</option>
                    {timeSlots.map(t => <option key={t} value={t} disabled={busySlots.includes(t)}>{t} {busySlots.includes(t) ? '(Dolu)' : ''}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 uppercase text-sm tracking-widest">Randevu Ekle</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
