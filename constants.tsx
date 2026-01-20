
import { Service } from './types';

export const INITIAL_CATEGORIES = ['Cilt Bakımı', 'Saç', 'Tırnak', 'Masaj', 'Makyaj'];

export const SERVICES: Service[] = [
  {
    id: '1',
    name: 'HydraFacial Cilt Bakımı',
    description: 'Cildinizi derinlemesine temizleyen, nemlendiren ve canlandıran premium bakım.',
    duration: 60,
    price: 850,
    category: 'Cilt Bakımı',
    image: 'https://picsum.photos/seed/face/400/300'
  },
  {
    id: '2',
    name: 'Profesyonel Saç Kesimi',
    description: 'Yüz hattınıza ve tarzınıza uygun modern saç tasarımı ve şekillendirme.',
    duration: 45,
    price: 450,
    category: 'Saç',
    image: 'https://picsum.photos/seed/hair/400/300'
  },
  {
    id: '3',
    name: 'Jel Tırnak Uygulaması',
    description: 'Dayanıklı, estetik ve uzun süre kalıcı profesyonel jel tırnak tasarımı.',
    duration: 90,
    price: 600,
    category: 'Tırnak',
    image: 'https://picsum.photos/seed/nails/400/300'
  },
  {
    id: '4',
    name: 'Aromaterapi Masajı',
    description: 'Esansiyel yağlar eşliğinde ruhunuzu ve vücudunuzu dinlendiren bütünsel masaj.',
    duration: 60,
    price: 750,
    category: 'Masaj',
    image: 'https://picsum.photos/seed/massage/400/300'
  },
  {
    id: '5',
    name: 'Gelin Makyajı',
    description: 'En özel gününüzde ışıltınızı ön plana çıkaracak suya dayanıklı profesyonel makyaj.',
    duration: 120,
    price: 1500,
    category: 'Makyaj',
    image: 'https://picsum.photos/seed/makeup/400/300'
  }
];

export const generateTimeSlots = (start: number, end: number) => {
  const slots = [];
  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};
