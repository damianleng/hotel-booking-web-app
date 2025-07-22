# 🏨 Aurora Hotel – Full Stack Hotel Booking Web App

A modern hotel booking system designed for **real-time room availability**, **contactless check-in**, and secure payment processing. Built with Angular, Express.js, MongoDB, and deployed with full CI/CD.

> ✅ **Live Demo**: [aurora-hotel.vercel.app](https://aurora-hotel-pioril1uf-damianlengdys-projects.vercel.app/home)  
> 📚 **User Manual**, **Technical Documentation**, and **Final Report** included.

---

## 🚀 Key Features

- 🛏️ Real-time room availability and booking
- 🔐 Contactless check-in/check-out with digital key
- 💳 Secure Stripe payment integration
- 👨‍👩‍👧‍👦 Role-based access: Guest, Staff, Cleaner
- 📬 Email notification system
- ⚙️ Auto status updates via scheduled cron jobs

---

## 🧱 Tech Stack

- **Frontend**: Angular 14.2.1
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Payments**: Stripe
- **Email Services**: Nodemailer
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Others**: RESTful APIs, Cron Jobs

---

## 📄 Recruiter-Friendly Documents

This project is accompanied by three formal engineering documents that demonstrate professional planning, system design, and testing methodology:

| 📁 Document                 | Description                                                                 | Link                                                                                          |
| --------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **User Manual**             | Step-by-step instructions for using the system as Guest, Staff, and Cleaner | [📖 View](https://drive.google.com/file/d/1S1K0Uhid-ftRL8tC-wIneYmMFnq37lVE/view?usp=sharing) |
| **Technical Documentation** | Use case diagrams, sequence diagrams, DB schema, ERD, and domain models     | [📘 View](https://drive.google.com/file/d/10RnaZnCbYPUKtrqjOWxwNcD-oqFtM6kJ/view?usp=sharing) |
| **Final Report**            | Agile sprints, testing strategy, project scope, limitations, and lessons    | [📗 View](https://drive.google.com/file/d/1mAWjWpN4fDVyrxsWvQPLKIDk6NkBiMWX/view?usp=sharing) |

---

## 🧪 Running the Application Locally

### 1. Prerequisites

- Node.js v16.x
- npm
- Angular CLI v14.2.1

### 2. Frontend Setup (Angular)
```bash
git clone https://github.com/damianleng/hotel-booking-web-app.git
cd hotel-booking-web-app/client
npm install
ng serve
```

### 3. Backend Setup (Express)
```bash
cd ../server
cp config.env.example config.env  # create .env file with MongoDB, Stripe, etc.
npm install
node server.js
```

Make sure MongoDB Atlas is configured and your IP is whitelisted.

---

## 🌍 Environment Variables

You need to add the following env variables in `server/config.env`:

```env
DATABASE=your_mongo_connection_string
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_app_password
```

---

## 🔗 Live Demo & API

- 🌐 Frontend (Angular): [aurora-hotel.vercel.app](https://aurora-hotel-pioril1uf-damianlengdys-projects.vercel.app/home)
- 🌐 Backend (Express): `https://aurora-backend-hsrg.onrender.com/api`

---

## 🤝 Authors

- **Dydamian Leng** – Full Stack Developer  
- Team members: Serey Vath Chhay, Puthika Hok, Sophakotra Son

---

## 📌 Recruiter Notes

> If you're evaluating candidates for software engineering internships, this project demonstrates:
- MVC architecture
- REST API design
- Full CI/CD deployment on cloud platforms
- Stripe + MongoDB + Angular integration
- Team collaboration using Agile methodology
- Complete system modeling (UML, ERD, Use Cases)

This is not just a student project — it's an **industry-grade system** that meets real-world design standards.