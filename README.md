# ams
# 📅 Appointment Management System (AMS)

AMS is a full-stack web application designed to manage appointments effectively for different institutions or organizations. The system provides secure, responsive, and role-based functionalities to streamline appointment scheduling and management.

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

- **Node.js** (v14+ recommended)
- **MySQL Server** (with access to phpMyAdmin or CLI)
- **Git** (to clone the repository)

---

## 📥 Getting Started

Follow these steps to set up and run the project on your local machine:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/asishkumarv/ams.git
cd AMS

### 2️⃣ Install Dependencies
You will need to install dependencies for all the modules.

For each of the following, run:
cd <module_name>
npm install

Repeat the above for:

admin_client

client

super_admin

server

### 3️⃣ Setup MySQL Database (Using MySQL CLI Only)
Ensure MySQL Server is running on your system.

Open MySQL CLI by running:
mysql -u your_mysql_username -p

*Replace your_mysql_username with your actual MySQL username (commonly root). You’ll be prompted to enter your password.*

