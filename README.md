# 🚀 **SkillSpring Backend – Powering the Learning Platform**  

## 📖 **Overview**  

The **SkillSpring Backend** is a robust and scalable server built using **Node.js** and **Express.js**. It provides secure authentication, course management, payment processing, and database management for the **SkillSpring** online learning platform.  

---

## 🌐 **Live API**  

🔗 **Backend Live Server:** [SkillSpring API](https://skill-spring-server.vercel.app/)  
🔗 **Fronend Repository:** [SkillSpring Frontend](https://github.com/younus-always/SkillSpring_Front-end)  

---

## 📌 **Installation Guide**  

Follow these steps to set up and run the **SkillSpring backend** locally.  

### 🔹 **Step 1: Clone the Repository**  

```sh
git clone https://github.com/younus-always/SkillSpring_Back-end.git
cd SkillSpring_Back-end
```

### 🔹 **Step 2: Install Dependencies**  

```sh
npm install
```

3️⃣ **Generate a Secure JWT Secret Token**  
Before configuring the backend, generate a **secure JWT secret key** for authentication:  

### 🔐 **Step 3: Generating a Secure JWT Secret Token**  

1. Open your **Terminal/Command Prompt**  
   - On **Windows**: Press `Win + R`, type `cmd`, and hit **Enter**  
   - On **Mac/Linux**: Open the **Terminal**  

2. Start a **Node.js session** by running:  
   ```sh
   node
   ```

3. Inside the Node.js shell, enter:  
   ```js
   require('crypto').randomBytes(64).toString('hex')
   ```

4. You will receive a randomly generated **64-byte token**, like this:
   `4a7101d3522423428d50e175a29ee4c1109561dcb6316534bea416b5c7c4faea
   7f27ac89aa876dc64a802c7adc922364ca3eaf4c5491a4e7496cd54455c6903f` 

   **Copy and store token in .env file securely.**

### 🔹 **Step 4: Configure Environment Variables**  

Create a `.env` file in the root directory and add the following:  

```ini
DB_USER=your_database_user
DB_PASS=your_database_password

# JWT Secret Token
SECRET_ACCESS_TOKEN=your_secure_jwt_secret_key

# Stripe Secret Key
SECRET_KEY=your_stripe_secret_key
```



### 🔹 **Step 5: Start the Server**  

```sh
npm start
```
By default, the server runs on **`http://localhost:4000/`**  

To run in **development mode** with automatic restarts:  
```sh
npm run dev
```

---

## ✨ **Backend Features**  

✅ **Express.js** for API management  
✅ **MongoDB** as the database  
✅ **JWT authentication** for secure user sessions  
✅ **Stripe payment integration** for transactions  
✅ **CORS & Cookie Parser** for secure API communication  
✅ **Cloud-based Hosting** for fast response times  

---

## 🚀 **Deployment Guide (Vercel)**  

To deploy the **SkillSpring backend** to **Vercel**, follow these steps:  

### ✅ **Step 1: Install Vercel CLI**  

```sh
npm install -g vercel
```

### ✅ **Step 2: Login to Vercel**  

```sh
vercel login
```

### ✅ **Step 3: Initialize the Project**  

```sh
vercel
```
- **Set up and deploy "skillspring-server"?** → `Yes`  
- **Select your Vercel account**  
- **Link to an existing project?** → `No`  
- **Project name?** → `skillspring-server`  
- **Framework / Build System?** → `Other`  
- **Override default settings?** → `No`  

### ✅ **Step 4: Set Up Environment Variables**  

```sh
vercel env add DB_USER your_database_user
vercel env add DB_PASS your_database_password
vercel env add SECRET_ACCESS_TOKEN your_jwt_secret_key
vercel env add SECRET_KEY your_stripe_secret_key
```

To confirm the environment variables are added:  
```sh
vercel env ls
```

### ✅ **Step 5: Deploy the Server**  

```sh
vercel --prod
```
---

## 🛠 **Troubleshooting**  

🔹 **Server Not Starting?** Ensure MongoDB credentials are correct in `.env`.  
🔹 **Deployment Issues?** Run:  
```sh
vercel --force
vercel logs skill-spring-server
```
🔹 **CORS Issues?** Ensure proper CORS configuration in `index.js`.  

---

## 👥 **Contributors**  

💡 **Md. Younus Islam** – [GitHub Profile](https://github.com/younus-always)  
🎉 Contributions are welcome! Fork the repo, create issues, and submit PRs.  
 

---

## 🌟 **Final Thoughts**  

🚀 **SkillSpring Backend powers an interactive learning experience!**  

From authentication to payments, this backend ensures smooth, secure, and scalable operations.  

💙 **Thank you for contributing to SkillSpring!**  

**Happy coding!** 🚀😊  
