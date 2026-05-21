# School Booking Enterprise

**Centralized IT asset management for educational institutions.**  
Track, manage, and secure school hardware using dynamic QR codes and a streamlined check-in / check-out system.

![Status](https://img.shields.io/badge/status-live-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Platform](https://img.shields.io/badge/platform-web%20%7C%20PWA-lightgrey)

**Live:** [school-booking.app](https://school-booking.app)

---

## The Problem

Schools lose track of expensive hardware — laptops, projectors, tablets — as equipment moves between classrooms and staff. There's no easy way to know who has what, or when it will be returned.

## The Solution

School Booking Enterprise turns physical inventory into trackable digital assets using QR codes. Stick a label on each device, scan it to check it out to a teacher, scan it again to return it. Done.

---

## Features

### Authentication Portal
- Secure email & password login
- JWT-based session management
- Role-based access: **Admin** and **Super Admin**
- Split-screen dark navy enterprise UI

### Asset Management
- Full inventory table with search and filter
- Add, update, and delete hardware records
- Track status: `Available`, `Checked Out`, `Maintenance`, `Lost`
- Assign assets to teachers or classrooms

### QR Code Engine
- **QR Generator** — instantly creates a unique scannable QR code for every asset. Print and stick it on the device.
- **QR Scanner** — uses the webcam to scan a QR code and pull up the asset profile instantly. Check in or out with one click.

### Godmode — System Settings *(Super Admin only)*
- Manage multiple schools from one account
- Create and manage admin users
- Reset or deactivate accounts
- Hidden from standard Admin users — only appears for Super Admins

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 8 (C#) |
| Database | MongoDB |
| Authentication | JWT Bearer + RBAC |
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS |
| QR Code | qrcode.react + html5-qrcode |
| PWA | vite-plugin-pwa |
| Deployment | VPS + Nginx |

---

## Project Structure

```
SchoolBookingEnterprise/
├── backend/
│   └── SchoolBookingEnterprise.Server/
│       ├── Controllers/        # Auth, Assets, Dashboard, Admin
│       ├── Models/             # User, Asset, School, CheckoutRecord, Alert
│       ├── Services/           # Business logic layer
│       └── Program.cs          # Entry point & DI setup
└── frontend/
    └── src/
        ├── components/
        │   ├── Dashboard/      # OverviewTab, AssetsTab, QRGenerateTab, QRScanTab, SystemSettingsTab
        │   └── Layout/         # Sidebar
        ├── context/            # AuthContext
        ├── pages/              # LoginPage, DashboardPage
        └── services/           # Axios API client
```

---

## Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally

### Backend

```bash
cd backend/SchoolBookingEnterprise.Server
dotnet restore
dotnet run
```

Backend runs on `http://localhost:5200`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/assets` | Admin | Get all assets |
| POST | `/api/assets` | Admin | Add new asset |
| PUT | `/api/assets/{id}` | Admin | Update asset |
| DELETE | `/api/assets/{id}` | Admin | Delete asset |
| POST | `/api/assets/{id}/checkout` | Admin | Check out asset |
| POST | `/api/assets/{id}/checkin` | Admin | Check in asset |
| GET | `/api/assets/qr/{code}` | Admin | Lookup by QR code |
| GET | `/api/dashboard/stats` | Admin | Overview statistics |
| GET | `/api/admin/schools` | SuperAdmin | List all schools |
| POST | `/api/admin/schools` | SuperAdmin | Create school |
| GET | `/api/admin/users` | SuperAdmin | List all users |
| POST | `/api/admin/users` | SuperAdmin | Create user |

---

## Built By

**Laurentiu Niculescu** — Full-stack developer at [Alpha IT Solutions](https://alphaitsolutions.uk), London UK.  
[GitHub](https://github.com/LaurentiuNiculescu) · [meal-match.app](https://meal-match.app) · laurentiun87@gmail.com
