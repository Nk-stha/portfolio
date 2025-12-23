# Professional Full-Stack Portfolio

A high-performance, responsive, and visually stunning portfolio built with **Next.js 15**, **Tailwind CSS 4**, and **MongoDB**. This project features a full administrative dashboard for content management, secure authentication, and production-grade DevOps configuration.

![Portfolio Preview](/public/animatedprofile.png) *Note: Replace with actual screenshot*

## 🚀 Features

- **Dynamic Frontend**: Responsive UI with dark mode support and premium micro-animations (Framer Motion).
- **Admin Dashboard**: Secure control panel to manage blog posts, projects, experiences, and profile details.
- **Advanced API**: RESTful architecture using Next.js Route Handlers with dual-layer (Middleware + Service) authentication.
- **Secure Auth**: JWT-based authentication (Access & Refresh tokens) with secure cookie storage.
- **Audit Logging**: Comprehensive activity tracking for all administrative write operations.
- **Media Management**: Integrated Cloudinary support for optimized image uploads.
- **SEO Optimized**: Built-in sitemap generation, robots.txt, and metadata optimization.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: [Jose](https://github.com/panva/jose) & [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: Docker & Docker Compose

## 📁 Architecture Overview


- **`app/`**: Route handlers and page views.
- **`components/`**: Atomic design structure (UI primitives and layout sections).
- **`lib/`**: Core services, database models, and utility functions.
- **`middleware.ts`**: Global security layer for route protection and token validation.

## 🚦 Getting Started

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## 🐳 Docker Orchestration

This project provides two distinct Docker Compose configurations tailored for production and development environments.

### 1. Production Mode (`docker-compose.yml`)
Designed for stability, security, and minimal footprint. It uses a **multi-stage build** and runs the Next.js application in `standalone` mode.

- **Frontend**: Exposed on port `3001`.
- **Database**: MongoDB 7 (Jammy) with root authentication and health checks.
- **Persistence**: Named volumes `mongodb_data` and `mongodb_config`.
- **Network**: isolated `portfolio-network`.

**Launch Command:**
```bash
# Start in detached mode
docker-compose up -d --build
```

---

### 2. Development Mode (`docker-compose.dev.yml`)
Optimized for developer experience with **Hot Module Replacement (HMR)** and automatic dependency syncing.

- **Fast Rebuilds**: Uses a single-stage Node:22-Alpine image.
- **Live Sync**: Mounts the local directory to `/app` inside the container via bind mounts.
- **Dependency Isolation**: Uses an anonymous volume for `node_modules` to prevent host/container conflicts.
- **Auto-Boot**: Automatically runs `npm install` and `npm run dev` on startup.

**Launch Command:**
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d --build
```

---

### 3. Common Docker Operations

| Task | Command |
| :--- | :--- |
| **Check Logs** | `docker logs -f portfolio-app` (Prod) or `portfolio-app-dev` (Dev) |
| **Stop Stack** | `docker-compose down` or `docker-compose -f docker-compose.dev.yml down` |
| **Reset Data** | `docker-compose down -v` (Warning: Deletes database volumes) |
| **Exec Shell** | `docker exec -it portfolio-app sh` |

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

| Category | Key | Description |
| :--- | :--- | :--- |
| **Database** | `MONGODB_URI` | MongoDB connection string |
| | `MONGO_ROOT_USERNAME` | Root username for MongoDB (Docker) |
| | `MONGO_ROOT_PASSWORD` | Root password for MongoDB (Docker) |
| **App** | `NODE_ENV` | `development` or `production` |
| | `PORT` | Application port (default: 3001) |
| **Media** | `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name |
| | `CLOUDINARY_API_KEY` | Cloudinary API key |
| | `CLOUDINARY_API_SECRET`| Cloudinary API secret |
| **Auth** | `JWT_ACCESS_SECRET` | Secret for access tokens |
| | `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| | `JWT_ACCESS_EXPIRY` | Access token duration (e.g., `15m`) |
| | `JWT_REFRESH_EXPIRY` | Refresh token duration (e.g., `7d`) |
| **Security**| `MAX_LOGIN_ATTEMPTS` | Max consecutive failed logins |
| | `RATE_LIMIT_MAX_REQUESTS`| Max requests per window |
| **Setup** | `INITIAL_ADMIN_EMAIL` | Admin email for initial seeding |
| | `INITIAL_ADMIN_PASSWORD` | Admin password for initial seeding |

## 📜 Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build production bundle.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint checks.
- `npm run db:seed`: Seed the database with initial data.
- `npm run seed:admin`: Setup the initial administrator account.

## 🔒 Security

- **JWT Rotation**: Short-lived access tokens and long-lived refresh tokens.
- **Middle-ware Protection**: Edge-compatible route protection.
- **Standalone Mode**: Optimized Next.js build for minimal container footprint.
- **Rate Limiting**: Integrated protection against brute-force attacks.

---

Built with ❤️ by [Rohan Shrestha](https://nikeshshrestha405.com.np)
