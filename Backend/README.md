# Blog App Backend

This is the Express.js backend for the Blog App. It handles authentication, user registration, author registration, article management, protected routes, image uploads, and MongoDB database operations.

## Backend Live URL

```txt
https://blog-app-week-9-10.onrender.com
```

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- HTTP-only cookies
- bcryptjs
- Multer
- Cloudinary
- CORS
- dotenv

## Features

- User registration
- Author registration
- Login and logout
- JWT authentication
- HTTP-only cookie-based sessions
- Role-based route protection
- Upload profile images to Cloudinary
- Create articles as an author
- Read active articles as a user
- Read author-specific articles
- Edit articles
- Soft-delete and restore articles
- Add comments to articles
- Central error handling
- Production CORS support for Vercel

## Folder Structure

```txt
Backend/
├── APIs/
│   ├── AdminAPI.js
│   ├── AuthorAPI.js
│   ├── CommonAPI.js
│   └── UserAPI.js
├── config/
│   ├── cloudinary.js
│   ├── cloudinaryUpload.js
│   └── multer.js
├── middlewares/
│   ├── checkAuthor.js
│   └── verifyToken.js
├── models/
│   ├── ArticleModel.js
│   └── UserModel.js
├── services/
│   └── authService.js
├── package.json
├── package-lock.json
├── req.http
└── server.js
```

## Important Files

- `server.js` - main Express app, database connection, CORS, route mounting, root API response, error handling
- `APIs/CommonAPI.js` - login, logout, check-auth, change password
- `APIs/UserAPI.js` - user registration, reading articles, comments
- `APIs/AuthorAPI.js` - author registration and article CRUD actions
- `middlewares/verifyToken.js` - JWT verification and role protection
- `services/authService.js` - register and login logic
- `models/UserModel.js` - user, author, and admin schema
- `models/ArticleModel.js` - article schema
- `config/cloudinary.js` - Cloudinary configuration
- `config/multer.js` - file upload configuration

## Installation

```bash
cd Backend
npm install
```

## Environment Variables

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

### Production Environment Variables for Render

```env
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_long_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://blog-app-week-9-10.vercel.app
NODE_ENV=production
```

Render automatically provides `PORT`, so it does not have to be manually set there.

## Run Locally

```bash
npm start
```

The backend runs at:

```txt
http://localhost:4000
```

Root URL response:

```txt
GET /
```

Returns:

```json
{
  "message": "Blog API is running",
  "frontend": "https://blog-app-week-9-10.vercel.app",
  "endpoints": ["/user-api", "/author-api", "/admin-api", "/common-api"]
}
```

## API Routes

### Common Routes

Base path:

```txt
/common-api
```

| Method | Route | Description | Protected |
|---|---|---|---|
| POST | `/login` | Login user or author | No |
| GET | `/logout` | Logout current user | No |
| GET | `/check-auth` | Check current login session | Cookie-based |
| PUT | `/change-password` | Change password | Yes |

### User Routes

Base path:

```txt
/user-api
```

| Method | Route | Description | Protected |
|---|---|---|---|
| POST | `/users` | Register a user | No |
| GET | `/articles` | Get all active articles | USER |
| PUT | `/articles` | Add comment to an article | USER |

### Author Routes

Base path:

```txt
/author-api
```

| Method | Route | Description | Protected |
|---|---|---|---|
| POST | `/users` | Register an author | No |
| POST | `/articles` | Create an article | AUTHOR |
| GET | `/articles/:authorId` | Get articles by author | AUTHOR |
| PUT | `/articles` | Edit an article | AUTHOR |
| PATCH | `/articles/:id/status` | Delete or restore an article | AUTHOR |

### Admin Routes

Base path:

```txt
/admin-api
```

Admin route group is mounted and available for future admin features.

## Authentication Flow

1. User logs in using `/common-api/login`.
2. Backend validates email and password.
3. Backend creates a JWT.
4. JWT is stored in an HTTP-only cookie named `token`.
5. Protected routes read the cookie using `cookie-parser`.
6. `verifyToken` validates the token and checks role permission.

## Cookie Behavior

Local development:

```txt
SameSite=Lax
Secure=false
```

Production:

```txt
SameSite=None
Secure=true
```

This allows cookies to work between:

```txt
https://blog-app-week-9-10.vercel.app
https://blog-app-week-9-10.onrender.com
```

## Deploy on Render

1. Push your project to GitHub.
2. Open Render.
3. Create a new Web Service.
4. Connect your GitHub repository.
5. Set root directory:

```txt
Backend
```

6. Set build command:

```bash
npm install
```

7. Set start command:

```bash
npm start
```

8. Add all backend environment variables.
9. Deploy.

## Troubleshooting

### `Cannot GET /`

The backend has a root route now. If this appears, redeploy the latest backend code.

### Login returns 500

Check Render environment variables, especially:

```env
JWT_SECRET
DB_URL
```

### CORS error

Check:

```env
FRONTEND_URL=https://blog-app-week-9-10.vercel.app
```

The backend also allows Vercel preview URLs that start with `blog-app-week-9-10-` and end with `.vercel.app`.

### Image upload fails

Check Cloudinary variables:

```env
CLOUD_NAME
API_KEY
API_SECRET
```
