# Blog App Frontend

This is the React frontend for the Blog App. It provides the user interface for registration, login, reading articles, author article management, protected profiles, and article editing.

## Frontend Live URL

```txt
https://blog-app-week-9-10.vercel.app
```

## Backend API URL

```txt
https://blog-app-week-9-10.onrender.com
```

## Tech Stack

- React
- Vite
- React Router
- Zustand
- Axios
- React Hook Form
- React Hot Toast
- Tailwind CSS
- ESLint

## Features

- Home page
- Register as user or author
- Upload profile image during registration
- Login and logout
- Auth state management with Zustand
- Session restore on page refresh
- Protected routes
- Role-based navigation
- User profile page
- Author profile page
- Author article list
- Write article page
- Edit article page
- Article detail page
- Delete and restore articles
- Toast notifications
- Production API configuration using `VITE_API_URL`

## Folder Structure

```txt
Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── ArticleByID.jsx
│   │   ├── AuthorArticles.jsx
│   │   ├── AuthorProfile.jsx
│   │   ├── EditArticleForm.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Register.jsx
│   │   ├── RootLayout.jsx
│   │   ├── Unauthorized.jsx
│   │   ├── UserProfile.jsx
│   │   └── WriteArticle.jsx
│   ├── config/
│   │   └── api.js
│   ├── stores/
│   │   └── authStore.js
│   ├── styles/
│   │   └── common.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.production
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Important Files

- `src/App.jsx` - application routes
- `src/components/RootLayout.jsx` - common layout with header, footer, auth restore
- `src/components/ProtectedRoute.jsx` - role-based route protection
- `src/stores/authStore.js` - login, logout, check-auth state
- `src/config/api.js` - backend API base URL helper
- `src/styles/common.js` - shared style classes
- `.env.production` - production backend URL

## Installation

```bash
cd Frontend
npm install
```

## Environment Variables

Production environment file:

```env
VITE_API_URL=https://blog-app-week-9-10.onrender.com
```

This value is used by:

```txt
src/config/api.js
```

Local development falls back to:

```txt
http://localhost:4000
```

## Run Locally

Start the frontend development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

Make sure the backend is also running at:

```txt
http://localhost:4000
```

## Available Scripts

```bash
npm run dev
```

Starts the local Vite development server.

```bash
npm run build
```

Creates a production build inside the `dist` folder.

```bash
npm run lint
```

Runs ESLint checks.

```bash
npm run preview
```

Previews the production build locally.

## App Routes

| Path | Component | Access |
|---|---|---|
| `/` | Home | Public |
| `/register` | Register | Public |
| `/login` | Login | Public |
| `/user-profile` | UserProfile | USER |
| `/author-profile` | AuthorProfile | AUTHOR |
| `/author-profile/articles` | AuthorArticles | AUTHOR |
| `/author-profile/write-article` | WriteArticle | AUTHOR |
| `/article/:id` | ArticleByID | Public/auth-aware |
| `/edit-article` | EditArticleForm | Author flow |
| `/unauthorized` | Unauthorized | Public |

## API Communication

All backend URLs are created with:

```js
apiUrl("/some-api-route")
```

Example:

```js
axios.get(apiUrl("/common-api/check-auth"), { withCredentials: true })
```

`withCredentials: true` is required because authentication uses HTTP-only cookies.

## Deploy on Vercel

1. Push the project to GitHub.
2. Open Vercel.
3. Create a new project.
4. Import the GitHub repository.
5. Set root directory:

```txt
Frontend
```

6. Set build command:

```bash
npm run build
```

7. Set output directory:

```txt
dist
```

8. Add this environment variable in Vercel:

```env
VITE_API_URL=https://blog-app-week-9-10.onrender.com
```

9. Deploy.

## Deployment Notes

- After changing `.env.production` or Vercel environment variables, redeploy the frontend.
- After changing backend CORS or cookie logic, redeploy the backend on Render.
- If login does not persist after refresh, check that the backend is using production cookie settings.
- If requests fail with CORS, check the backend `FRONTEND_URL` environment variable.

## Troubleshooting

### Frontend opens but API calls fail

Check:

```env
VITE_API_URL=https://blog-app-week-9-10.onrender.com
```

### Login succeeds but user becomes logged out on refresh

Check backend production variables:

```env
NODE_ENV=production
JWT_SECRET=your_secret
FRONTEND_URL=https://blog-app-week-9-10.vercel.app
```

### 401 on protected routes

This usually means the user is not logged in, the cookie is missing, or the user role does not match the route.

### Vercel preview URL has CORS error

Redeploy the latest backend. The backend allows Vercel preview URLs for this project.
