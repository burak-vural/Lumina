<img width="1339" height="737" alt="Image" src="https://github.com/user-attachments/assets/a50c1e57-fb92-4ad7-8803-87d958f122d9" />

<div align="center">
<h1>✨ Lumina - Beauty & Wellness Booking Platform</h1>
<p><strong>AI-Powered Beauty Salon Appointment Booking System</strong></p>
</div>

---

## 📋 About Lumina

**Lumina** is a modern, full-featured beauty and wellness salon booking platform built with React and TypeScript. It seamlessly combines appointment scheduling, service management, and AI-powered beauty consultation through Google Gemini AI integration.

The platform enables customers to:
- 🎯 Browse and book beauty services
- 💬 Get personalized beauty advice from an AI assistant
- 📅 Manage their appointments
- 🎨 Receive customized beauty recommendations

And enables salon administrators to:
- 🛠️ Manage services and pricing
- 📊 Handle bookings and appointments
- 🎪 Customize branding and business settings
- 🔔 Send appointment reminders to customers

---

<img width="1357" height="732" alt="Image" src="https://github.com/user-attachments/assets/e5c7dee8-d06d-4565-b7fe-55a9d14e5d58" />

## ✨ Key Features

### 👥 Customer Features
- **Service Browsing**: Browse categorized beauty services with descriptions, pricing, and duration
- **Smart Booking**: Interactive booking wizard with date/time selection and availability checking
- **AI Beauty Assistant**: Get personalized beauty advice and recommendations powered by Google Gemini
- **Skin Analysis**: Get AI-powered skin analysis and care recommendations
- **Appointment Tracking**: View and manage your upcoming appointments
- **Notifications**: Receive appointment reminders and updates

### 🔧 Admin Features
- **Admin Dashboard**: Complete control over services, appointments, and settings
- **Service Management**: Add, edit, and organize services by category with pricing
- **Appointment Management**: View all bookings, confirm/cancel appointments
- **Customization**: 
  - Edit banner titles and images
  - Customize business hours (9 AM - 7 PM default)
  - Set contact phone number
  - Personalize success messages
- **Brand Management**: Upload custom logo and branding

### 🤖 AI Features
- **Beauty Consultation**: Get expert beauty advice from AI assistant
- **Skin Analysis**: Upload and analyze skin type and conditions
- **Service Recommendations**: AI suggests relevant services based on your needs

---

## 🏢 Service Categories

Lumina supports multiple service categories:
- **Cilt Bakımı** (Skincare) - HydraFacial and premium facial treatments
- **Saç** (Hair) - Professional haircuts and styling
- **Tırnak** (Nails) - Gel nails and nail care services
- **Masaj** (Massage) - Relaxation and therapeutic treatments
- **Makyaj** (Makeup) - Professional makeup application

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Generative AI (Gemini)
- **Styling**: CSS with modern responsive design
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: LocalStorage for data persistence

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd lumina
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Key:**
   - Create a `.env.local` file in the root directory
   - Add your Google Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
lumina/
├── components/
│   ├── AdminDashboard.tsx       # Admin control panel
│   ├── AdminLogin.tsx           # Admin authentication
│   ├── AiAssistant.tsx          # AI beauty consultation interface
│   ├── BookingWizard.tsx        # Appointment booking flow
│   ├── BookingSuccess.tsx       # Confirmation page
│   ├── Header.tsx               # Navigation header
│   └── ServiceCard.tsx          # Service display component
├── services/
│   ├── geminiService.ts         # Google Gemini AI integration
│   └── notificationService.ts   # Notification system
├── App.tsx                      # Main application component
├── types.ts                     # TypeScript interfaces
├── constants.tsx               # Default services and categories
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── index.tsx                   # Application entry point
```

---

## 🔐 Admin Access

The admin dashboard can be accessed through the admin login interface. Default admin credentials are managed in the application state.

**Admin Features:**
- Service CRUD operations
- Appointment management
- Business settings configuration
- Customer notification management

---

## 📱 User Flows

### Customer Booking Flow
1. Browse services on home page
2. Click on desired service
3. Use booking wizard to select date and time
4. Enter contact information
5. Confirm appointment
6. Receive confirmation message

### AI Assistant Flow
1. Click on AI Assistant button
2. Ask beauty-related questions
3. Get personalized recommendations
4. Request skin analysis (optional with image)
5. Receive AI-powered advice

### Admin Management Flow
1. Log in to admin dashboard
2. Manage services, appointments, and settings
3. View booking calendar
4. Send notifications to customers
5. Customize business information

---

## 🌍 Localization

The application is currently in **Turkish** with support for:
- Turkish service names and descriptions
- Turkish UI labels and messages
- Turkish business context (phone numbers, hours, etc.)

---

## 📞 Support & Contact

For business inquiries, customers can reach out using:
- **Default Contact Number**: 0212 555 00 00
- **Customizable**: Business phone can be updated in admin settings

---

## 📄 License

This project is part of the Lumina Beauty & Wellness platform. All rights reserved.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

<div align="center">
<p><strong>Lumina - Transform Your Beauty Experience with AI ✨</strong></p>
</div>
