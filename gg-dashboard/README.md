### 🔐 User Login and Signup with Authentication & Authorization
A modern Next.js 14+ dashboard with complete authentication system, featuring Supabase integration, Google Cloud OAuth, real-time notifications, and Docker deployment.

🚀 Live Demo
[Add your live demo link here]

✨ Features
🔐 Authentication & Authorization
Supabase Email/Password Auth - Secure user registration and login

Google Cloud OAuth 2.0 - Seamless social authentication

Protected Routes - Role-based access control

Session Management - Persistent user sessions

🧑‍💼 Dashboard & UI
Modern Dashboard Layout - Sidebar navigation with topbar

Responsive Design - Mobile-first Tailwind CSS design

Profile Management - User profile dropdown with settings

Real-time Updates - Live data and state management

🔔 Notifications System
Smart Notification Bell - Click to view recent notifications

Double-click Navigation - Opens full notifications page

Notification Status - Track completed and pending actions

Real-time Alerts - Instant notification updates

🐳 Deployment & DevOps
Docker Containerization - Easy deployment with Docker

Production Ready - Optimized for scalable deployment

Environment Configuration - Secure environment variables

🏗️ Tech Stack
Layer	Technology
Frontend Framework	Next.js 14+ (App Router)
Styling	Tailwind CSS
Database & Auth	Supabase
OAuth Provider	Google Cloud Platform
Deployment	Docker
Language	TypeScript
State Management	React Context / Zustand
Icons	Lucide React / Heroicons
📁 Project Structure
text
📦 dashboard-app/
├── 📂 app/
│   ├── 📂 auth/
│   │   ├── 📜 login/
│   │   │   └── 📜 page.tsx
│   │   ├── 📜 signup/
│   │   │   └── 📜 page.tsx
│   │   └── 📜 layout.tsx
│   ├── 📂 dashboard/
│   │   ├── 📜 page.tsx
│   │   ├── 📂 notification/
│   │   │   └── 📜 page.tsx
│   │   └── 📜 layout.tsx
│   └── 📜 layout.tsx
├── 📂 components/
│   ├── 📜 DashboardLayout.tsx
│   ├── 📜 Notifications.tsx
│   ├── 📜 ProfileMenu.tsx
│   ├── 📜 AuthForm.tsx
│   └── 📜 ProtectedRoute.tsx
├── 📂 lib/
│   └── 📂 supabase/
│       ├── 📜 client.ts
│       └── 📜 auth.ts
├── 📂 public/
│   ├── 📜 notif.jpeg
│   ├── 📜 profile.jpg
│   └── 📜 vector.png
├── 📂 types/
│   └── 📜 index.ts
├── 🐳 Dockerfile
├── 📜 docker-compose.yml
├── 📜 tailwind.config.js
├── 📜 next.config.js
├── 📜 .env.local
└── 📜 README.md
⚙️ Installation & Setup
1️⃣ Clone Repository
bash
git clone https://github.com/your-username/dashboard-app.git
cd dashboard-app
2️⃣ Install Dependencies
bash
npm install
# or
yarn install
# or
pnpm install
3️⃣ Environment Configuration
Create .env.local in your project root:

env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth (Optional for local development)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
4️⃣ Supabase Setup
Step 1: Create Supabase Project
Go to Supabase Dashboard

Create a new project

Get your SUPABASE_URL and SUPABASE_ANON_KEY

Step 2: Configure Authentication
Navigate to Authentication → Settings

Configure your site URL: http://localhost:3000

Enable Email Provider

Configure Redirect URLs

Step 3: Database Schema (Optional)
Set up your user profiles table in SQL:

sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
5️⃣ Google OAuth Configuration
Step 1: Google Cloud Console
Go to Google Cloud Console

Create a new project or select existing one

Navigate to APIs & Services → Credentials

Click Create Credentials → OAuth 2.0 Client ID

Configure consent screen if required

Step 2: Authorized URIs
Authorized JavaScript origins:

text
http://localhost:3000
Authorized redirect URIs:

text
https://your-project-ref.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
Step 3: Supabase Integration
Go to Supabase Dashboard → Authentication → Providers

Enable Google

Paste your Google Client ID and Secret

Save configuration

🧩 Notification System
Notification Object Structure
typescript
interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

// Example Notification
{
  id: 1,
  title: 'Client follow-up email',
  description: 'Send a follow-up email to the client regarding the new updates.',
  date: '2025-10-16 11:00',
  status: 'Completed',
  type: 'success',
  read: false
}
Notification Features
Click: View recent notifications dropdown

Double-click: Navigate to full notifications page

Status Indicators: Color-coded by type and status

Mark as Read: Update notification status

Real-time Updates: Live notification stream

🧭 Navigation Guide
Route	Description	Access
/	Landing page	Public
/auth/login	User login	Public
/auth/signup	User registration	Public
/dashboard	Main dashboard	Protected
/dashboard/notification	Full notifications	Protected
/dashboard/profile	User profile	Protected
/dashboard/settings	Account settings	Protected
🐳 Docker Deployment
1️⃣ Docker Setup
Create Dockerfile in project root:

dockerfile
# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
2️⃣ Docker Compose (Optional)
Create docker-compose.yml:

yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - .:/app
      - /app/node_modules
    restart: unless-stopped
3️⃣ Build and Run
bash
# Build Docker image
docker build -t dashboard-app .

# Run container
docker run -p 3000:3000 dashboard-app

# Or use Docker Compose
docker-compose up -d
Your app will be available at: http://localhost:3000

🛠️ Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build for production
npm start	Start production server
npm run lint	Run ESLint
npm run type-check	Run TypeScript compiler
docker build -t dashboard-app .	Build Docker image
docker run -p 3000:3000 dashboard-app	Run container
🔧 Configuration
Tailwind CSS
The project uses Tailwind CSS for styling. Configuration can be modified in tailwind.config.js:

javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
  plugins: [],
}
Next.js Configuration
next.config.js settings:

javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'your-supabase-project.supabase.co'],
  },
}

module.exports = nextConfig
🚀 Deployment
Vercel Deployment (Recommended)
Push your code to GitHub

Connect your repository to Vercel

Add environment variables in Vercel dashboard

Deploy automatically

Other Platforms
The app can be deployed on:

Netlify

Railway

AWS Amplify

Digital Ocean App Platform

Any platform supporting Node.js

🧪 Testing
bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Development Guidelines
Follow TypeScript best practices

Use meaningful commit messages

Add tests for new features

Update documentation accordingly

Follow the existing code style

🐛 Troubleshooting
Common Issues
Authentication Errors

Verify Supabase environment variables

Check Google OAuth redirect URIs

Ensure CORS settings are correct

Build Errors

Clear Next.js cache: rm -rf .next

Reinstall dependencies: rm -rf node_modules && npm install

Check TypeScript types: npm run type-check

Docker Issues

Ensure Docker is running

Check port availability

Verify Dockerfile syntax

Getting Help
Check Supabase Documentation

Review Next.js Documentation

Create an issue on GitHub

Check existing discussions

👨‍💻 Author
Dhamodharan S
Full Stack Developer Intern

📧 Email: dhamodharansece23@gmail.com

💼 LinkedIn: https://www.linkedin.com/in/dhamodharan-s-web-designer

🐙 GitHub: https://github.com/dhamodharanECE

🌐 Portfolio: [Add your portfolio link]

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.