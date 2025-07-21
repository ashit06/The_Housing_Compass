# 🧭 The Housing Compass

<p align="center">
  <img src="https://i.imgur.com/your-logo-image-url.png" alt="The Housing Compass Logo" width="150"/>
</p>

<h3 align="center">A full-stack web platform for intelligent real estate investment.</h3>

<p align="center">
  <strong><a href="https://the-housing-compass.vercel.app">View Live Demo »</a></strong>
</p>

---

## 📍 Overview

**The Housing Compass** is an advanced, full-stack web platform designed to provide data-driven insights and AI-powered analysis to home buyers and real estate professionals in the Noida, India market. It combines a powerful Django REST API backend with a dynamic React frontend to deliver a seamless and intuitive user experience.

---

## ✨ Features

* **Secure User Authentication**: Robust user registration and login system powered by **Firebase Authentication**.
* **Dynamic Property Listings**: Browse, search, and view detailed information for real estate listings.
* **Advanced Filtering & Sorting**: Filter properties by price range and number of bedrooms, and sort results by price or recency.
* **AI-Powered Chatbot**: An integrated chatbot, powered by the **Google Gemini API**, capable of answering user questions about properties and site features.
* **Interactive Property Details**: Each listing features an image gallery, an interactive map, and a price history chart.
* **Investment Insights**: A unique feature for logged-in users that provides a detailed analysis of a property's investment potential.
* **Responsive Design**: A clean, modern, and fully responsive UI that looks great on any device.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), React Router, Chart.js, CSS3 |
| **Backend** | Django, Django REST Framework |
| **Database** | PostgreSQL (Production), SQLite3 (Development) |
| **Authentication** | Firebase Authentication |
| **AI Integration** | Google Gemini API |
| **Deployment** | **Vercel** (Frontend), **Render** (Backend & Database) |

---

## 🏗️ Architecture

<img width="2048" height="2048" alt="Gemini_Generated_Image_oxk05koxk05koxk0" src="https://github.com/user-attachments/assets/7674c072-bdb5-45f5-b14c-9d7ef82f0ae7" />

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Python 3.8+
* Node.js 16+
* Git

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/the-housing-compass.git](https://github.com/your-username/the-housing-compass.git)
    cd the-housing-compass
    ```

2.  **Setup the Backend (Django):**
    * Navigate to the backend directory:
        ```sh
        cd backend
        ```
    * Create and activate a virtual environment:
        ```sh
        python3 -m venv venv
        source venv/bin/activate
        ```
    * Install the required packages:
        ```sh
        pip install -r requirements.txt
        ```
    * Apply the database migrations:
        ```sh
        python3 manage.py migrate
        ```
    * (Optional) Populate the database with sample data:
        ```sh
        python3 manage.py populate_listings
        ```
    * Run the server:
        ```sh
        python3 manage.py runserver
        ```
    * The backend API will be available at `http://127.0.0.1:8000`.

3.  **Setup the Frontend (React):**
    * Open a new terminal window.
    * Navigate to the frontend directory:
        ```sh
        cd frontend/lynapp-react
        ```
    * Install NPM packages:
        ```sh
        npm install
        ```
    * Run the development server:
        ```sh
        npm run dev
        ```
    * The frontend will be available at `http://localhost:5173`.

---

## 🚀 Deployment

This application is deployed using a two-part strategy:

* **Backend (Render)**: The Django application and PostgreSQL database are hosted on Render. The app is deployed as a Web Service, and migrations are run automatically on deploy using a `build.sh` script.
* **Frontend (Vercel)**: The React application is hosted on Vercel, connected directly to the GitHub repository for continuous deployment.

Environment variables (such as `DATABASE_URL` and `GEMINI_API_KEY`) are managed securely through the Render dashboard.

