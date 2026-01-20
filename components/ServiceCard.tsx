
import React from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
      <div className="relative h-48 overflow-hidden bg-slate-50 flex items-center justify-center p-8">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-full border-4 border-white shadow-sm group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-rose-600 shadow-sm uppercase tracking-tighter">
          {service.category}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors">{service.name}</h3>
        <p className="text-slate-500 text-sm mb-4 flex-grow">{service.description}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div>
            <span className="block text-xs text-slate-400 font-medium">Süre</span>
            <span className="text-slate-700 font-semibold">{service.duration} dk</span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-slate-400 font-medium">Fiyat</span>
            <span className="text-rose-600 font-bold text-lg">{service.price} TL</span>
          </div>
        </div>
        <button 
          onClick={() => onSelect(service)}
          className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition-colors transform active:scale-95 shadow-lg shadow-slate-200"
        >
          Randevu Oluştur
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
