# Blog App

A full-stack blog application with role-based access for users and authors. Users can register, log in, read published articles, and view article details. Authors can register, log in, write articles, view their own articles, edit articles, and soft-delete or restore articles.

## Live Links

- Frontend: https://blog-app-week-9-10.vercel.app
- Backend: https://blog-app-week-9-10.onrender.com

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Zustand
- Axios
- React Hook Form
- React Hot Toast
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- HTTP-only cookies
- Multer
- Cloudinary
- CORS

## Main Features

- User and author registration
- Image upload to Cloudinary during registration
- Login and logout using JWT stored in HTTP-only cookies
- Protected routes based on roles
- User dashboard for reading active articles
- Author dashboard for managing articles
- Create, edit, delete, and restore articles
- Article detail page
- Automatic auth restore on page refresh
- Deployment-ready frontend and backend configuration
- CORS support for local, production, and Vercel preview URLs

## Project Structure

```txt
BLOG-APP/
├── Backend/
│   ├── APIs/
│   │   ├── AdminAPI.js
│   │   ├── AuthorAPI.js
│   │   ├── CommonAPI.js
│   │   └── UserAPI.js
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── cloudinaryUpload.js
│   │   └── multer.js
│   ├── middlewares/
│   │   ├── checkAuthor.js
│   │   └── verifyToken.js
│   ├── models/
│   │   ├── ArticleModel.js
│   │   └── UserModel.js
│   ├── services/
│   │   └── authService.js
│   ├── package.json
│   ├── req.http
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.production
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Local Setup

### 1. Clone the project

```bash
git clone <your-repository-url>
cd BLOG-APP
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../Frontend
npm install
```

## Environment Variables

### Backend `.env`

Create a `.env` file inside `Backend/`.

```env
PORT=4000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_long_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173,https://blog-app-week-9-10.vercel.app
NODE_ENV=development
```

For Render production:

```env
NODE_ENV=production
FRONTEND_URL=https://blog-app-week-9-10.vercel.app
```

### Frontend `.env`

For local development, the frontend falls back to:

```env
http://localhost:4000
```

For production, `Frontend/.env.production` contains:

```env
VITE_API_URL=https://blog-app-week-9-10.onrender.com
```

## Running Locally

### Start backend

```bash
cd Backend
npm start
```

Backend runs at:

```txt
http://localhost:4000
```

### Start frontend

```bash
cd Frontend
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

## Deployment

### Backend Deployment on Render

1. Push the project to GitHub.
2. Create a new Web Service on Render.
3. Select the repository.
4. Set the root directory to:

```txt
Backend
```

5. Set build command:

```bash
npm install
```

6. Set start command:

```bash
npm start
```

7. Add backend environment variables in Render.
8. Deploy.

Backend health check URL:

```txt
https://blog-app-week-9-10.onrender.com
```

Expected response:

```json
{
  "message": "Blog API is running",
  "frontend": "https://blog-app-week-9-10.vercel.app",
  "endpoints": ["/user-api", "/author-api", "/admin-api", "/common-api"]
}
```

### Frontend Deployment on Vercel

1. Push the project to GitHub.
2. Create a new project on Vercel.
3. Select the repository.
4. Set the root directory to:

```txt
Frontend
```

5. Set build command:

```bash
npm run build
```

6. Set output directory:

```txt
dist
```

7. Add this environment variable if not using `.env.production`:

```env
VITE_API_URL=https://blog-app-week-9-10.onrender.com
```

8. Deploy.

## Common API Groups

- `/common-api` - login, logout, auth check, password change
- `/user-api` - user registration, user article access, comments
- `/author-api` - author registration and article management
- `/admin-api` - admin route group

## Useful Commands

### Backend

```bash
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

- The backend uses HTTP-only cookies for authentication.
- In production, cookies are sent with `SameSite=None` and `Secure` so Vercel and Render can communicate.
- CORS allows the main Vercel URL and Vercel preview URLs for this project.
- If login works locally but not in production, check `JWT_SECRET`, `FRONTEND_URL`, and `VITE_API_URL`.
