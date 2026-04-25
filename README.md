# 🌸 Veda Bloom

Veda Bloom is a **full-stack menstrual health tracking web application** that helps users monitor their cycle, log daily symptoms, and receive predictions for upcoming periods, ovulation, and fertile windows.

The application combines a **React frontend**, **Firebase authentication & database**, and a **Spring Boot prediction API** to deliver an intelligent cycle tracking experience.

---

# 🚀 Live Demo

Frontend
https://veda-bloom.vercel.app

Backend API
https://veda-bloom-api.onrender.com

---

# 📌 Overview

Veda Bloom enables users to:

* Track menstrual cycle dates through an interactive calendar
* Log daily symptoms and mood
* Receive predictions for upcoming periods
* Estimate ovulation and fertile window
* Maintain a history of cycle data
* Download their personal cycle data as a **PDF report**

The prediction engine uses a **Java backend API** that calculates cycle events based on user-provided cycle length and last recorded period date.

---

# ✨ Features

## 🔐 Authentication

* Secure login using **Google Sign-In via Firebase Authentication**
* User-specific data stored securely in Firestore

---

## 📅 Cycle Tracking & Prediction

* Interactive **calendar interface** to track menstrual cycles
* Automatic **next period prediction**
* **Ovulation estimation**
* **Fertile window calculation**
* Predictions generated using a Java-based backend prediction engine

---

## 📝 Symptom & Mood Input

* Log daily symptoms such as cramps, fatigue, headaches, etc.
* Track emotional mood states
* Entries stored per date for personalized cycle tracking
* Data automatically synced with Firebase Firestore

---

## 📊 History Tracking

* View previously logged cycle data
* Track past symptoms and moods
* Analyze personal cycle patterns over time

---

## 📄 PDF Data Export

* Users can download their complete cycle history as a **PDF report**
* Generated directly from the **History tab**
* Allows users to keep personal health records or share them with healthcare professionals

---

## ☁️ Cloud Deployment

* Frontend deployed on **Vercel**
* Backend API deployed on **Render**
* Authentication and database handled using **Firebase**

---

# 🏗 System Architecture

```
User
  │
  ▼
React Frontend (Vercel)
  │
  │ REST API Request
  ▼
Spring Boot Backend (Render)
  │
  │ Read / Write
  ▼
Firebase Firestore Database
  │
  ▼
Prediction Results returned to Frontend
```

---

# 🧠 Prediction Logic

The backend prediction system calculates cycle events using the following logic:

```
nextPeriodDate = lastPeriodDate + cycleLength

ovulationDate = nextPeriodDate - 14 days

fertileWindowStart = ovulationDate - 5 days
```

This logic is implemented in the **Spring Boot prediction API**.

---

# 🖥 Application Screenshots

## Home Page
<img width="1440" height="900" alt="homepage" src="https://github.com/user-attachments/assets/478ac2d1-0020-412b-a4c2-3f358b216c68" />


## Cycle Calendar & Prediction Results
<img width="1440" height="900" alt="Screenshot 2026-03-07 at 21 39 49" src="https://github.com/user-attachments/assets/d1d8b9ec-c7f0-4fb8-a816-a0fbaf86ad1b" />


## Symptom & Mood Logging
<img width="1440" height="900" alt="Screenshot 2026-03-07 at 21 39 43" src="https://github.com/user-attachments/assets/ff77343e-3d7c-462a-9e23-643e60573472" />


## FAQs

<img width="1440" height="900" alt="Screenshot 2026-03-07 at 21 32 19 1" src="https://github.com/user-attachments/assets/289609ff-74d1-4719-a6e0-1cec5aa6dfc3" />


## History & PDF Export

<img width="1440" height="900" alt="Screenshot 2026-03-07 at 21 33 22" src="https://github.com/user-attachments/assets/e613d764-a1dc-4ea5-be6a-e0f80f1f78b4" />


---

# 🛠 Tech Stack

## Frontend

* React
* React Router
* Tailwind CSS
* React Calendar
* jsPDF (for generating PDF reports)

## Backend

* Spring Boot
* Java
* REST API

## Authentication

* Firebase Authentication
* Google OAuth

## Database

* Firebase Firestore

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# 📂 Project Structure

```
src
 ├── components
 │    ├── Navbar.js
 │    └── SymptomModal.js
 │
 ├── pages
 │    ├── Home.js
 │    ├── Login.js
 │    ├── Dashboard.js
 │    ├── History.js
 │    └── OnboardingQuiz.js
 │
 ├── firebaseConfig.js
 ├── App.js
 └── index.js
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root:

```
REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_MESSAGING_SENDER_ID=
REACT_APP_APP_ID=
REACT_APP_MEASUREMENT_ID=
REACT_APP_API_URL=https://veda-bloom-api.onrender.com
```

---

# ⚡ Installation & Setup

Clone the repository

```
git clone https://github.com/AaryaRai01/Veda-Bloom.git
```

Navigate into the project

```
cd Veda-Bloom
```

Install dependencies

```
npm install
```

Run the development server

```
npm start
```

The application will run at

```
http://localhost:3000
```

---

# 🔗 Backend Repository

The backend API responsible for prediction logic is available here:

https://github.com/AaryaRai01/Veda-Bloom-api

---

# 🔒 Security

* Firebase authentication for secure login
* Firestore database rules for access control
* CORS configuration for backend API
* Environment variables used for sensitive configuration

---

# 📈 Future Improvements

* Machine learning-based cycle prediction
* Personalized health insights
* Notification reminders for upcoming cycles
* Mobile application support
* Advanced analytics and data visualization

---

# 👨‍💻 Author

Aarya Rai

GitHub
https://github.com/AaryaRai01

Gaurika Malviya

Github
https://github.com/GaurikaMalviya

---

# 📄 License

This project is licensed under the MIT License.

