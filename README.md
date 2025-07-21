# ams
# 📅 Appointment Management System (AMS)

AMS is a full-stack web application designed to manage appointments effectively for different institutions or organizations. The system provides secure, responsive, and role-based functionalities to streamline appointment scheduling and management.

*Scroll down for sample screen shots*
## 🚀 Tech Stack

- **Frontend**: React.js, Material UI
- **Backend**: Node.js, Express.js
- **Database**: MySQL

---

## 📁 Project Structure

The project consists of **4 modules**:

1. **admin_client** – For administrators to manage appointments.
2. **client** – For general users to book appointments.
3. **super_admin** – For top-level admins to manage roles and monitor activities.
4. **server** – Backend APIs and database interactions.

---

## ⚙️ System Requirements

Before setting up the project, make sure your system has the following installed:

- **Node.js** (v18+ recommended)
- **MySQL Server** (with access to CLI)
- **Git** (to clone the repository)

---

## 📥 Getting Started

Follow these steps to set up and run the project on your local machine:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/asishkumarv/ams.git
cd AMS
```


### 2️⃣ Install Dependencies
You will need to install dependencies for all the modules.

For each of the following, run:
```
cd <module_name>
npm install
```

Repeat the above for:

admin_client

client

super_admin

server

### 3️⃣ Setup MySQL Database (Using MySQL CLI Only)
Ensure MySQL Server is running on your system.

Open MySQL CLI by running:
```
mysql -u your_mysql_username -p
```
*Replace your_mysql_username with your actual MySQL username (commonly root). You’ll be prompted to enter your password.*

Create the database and tables using the provided schema file.

First, exit MySQL prompt if you're inside (exit;), then in your terminal:
```
mysql -u your_mysql_username -p < path/to/ams_schema.sql
```
Example (if the file is in the root of the repo):
```
mysql -u root -p < ./ams_schema.sql
```
Check if database is created:

You can log in again and verify:
```
mysql -u root -p

```
Then inside MySQL prompt:
```
SHOW DATABASES;
USE ams;
SHOW TABLES;
```
Update DB credentials in the project:

In server/index.js , replace with your MySQL CLI credentials:
```
module.exports = {
  host: "localhost",
  user: "root",
  password: "your_mysql_password",
  database: "ams"
};
```

▶️ Running the Application
You must start the server first, then run any client module.

1. Start the Server
 ```
cd server
npm start
 ```
2. Start Client Modules
You can run the modules individually. Navigate to the respective folder and run:
```
cd admin_client
npm start
```
```
cd client
npm start

```

```
cd super_admin
npm start
```
Each module runs on a different port (usually 3000, 3001, etc.) and communicates with the backend server.

*run each module in different terminals*

## 🔒 Authentication & Roles
JWT-based authentication for secure login sessions

Role-based access control across:

Admin

Client

Super Admin

## 📦 Features
Responsive UI with Material UI

Real-time validation and booking feedback

Secure login and registration system

Role-based dashboards

Modular folder structure for scalability

MySQL database integration

## 🛠️ Developer Notes
Update .env files if you use environmental variables.

Make sure ports in frontend and backend configs do not conflict.

Ensure CORS settings are properly handled in the backend (server/index.js).

🖼️ Sample Screenshots
🧑‍💼 Admin Dashboard

👤 Client Appointment Booking

🧑‍🔧 Super Admin Panel

## 📧 Contact
Asish Kumar Varanasi
📧 asishkumarv@gmail.com
🔗 github.com/asishkumarv/
