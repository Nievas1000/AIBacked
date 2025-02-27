# Medical Clinic Chatbot API

This is a **secure and scalable backend** built with **Node.js** and **Express**, designed for a **SaaS platform for medical clinics**. The API integrates with **Supabase (PostgreSQL)** and supports **authentication via JWT stored in cookies**.

## 🚀 Features
- **User Authentication**
  - Secure login and registration for clinic admins
  - Password hashing with `bcryptjs`
  - JWT authentication via HTTP-only cookies

- **Chatbot & Messaging System**
  - Conversations and messages stored for tracking and analytics
  - Real-time chatbot interactions

- **Security Best Practices**
  - Helmet for secure HTTP headers
  - CORS configuration for frontend-backend integration
  - Proper error handling middleware

## 🛠️ Technologies Used
- **Node.js** + **Express.js**
- **Supabase (PostgreSQL)**
- **JWT for Authentication**
- **Zod for Input Validation**
- **Helmet & CORS for Security**
- **Morgan for Logging**
- **Cookie-based Authentication**

## 📌 Getting Started

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/your-username/medical-chatbot-api.git
cd medical-chatbot-api
