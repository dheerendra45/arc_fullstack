# ARC Admin Panel System

A secure and functional Admin Panel System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that enables admin users to manage users and opportunities through a web interface.

![ARC Admin Panel](https://via.placeholder.com/800x400?text=ARC+Admin+Panel)

## Project Structure

```
arc_fullstack/
├── arc_backend/    # Backend application built with Node.js, Express, and MongoDB
├── arc_frontend/   # Frontend application built with React.js
```

## Features

- 🔐 **JWT Authentication** - Secure admin login with JWT token-based authentication
- 👥 **Users Management** - View, filter, and soft delete users
- 📢 **Opportunities Management** - View, filter, and update status of opportunities
- 🛡️ **Role-Based Access Control** - Only admin users can access the admin panel
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Backend (arc_backend)

### Tech Stack

- Node.js & Express.js - Server framework
- MongoDB - Database
- Mongoose - ODM library
- JWT - Authentication
- Cors - Cross-origin resource sharing

### Installation & Setup

1. Navigate to the backend directory:
   ```bash
   cd arc_backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/arc_admin_panel
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Seed the database with initial data (optional):
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Admin login

#### User Management
- `GET /admin/users` - Fetch all users (with pagination and filters)
- `DELETE /admin/user/:id` - Soft delete a user

#### Opportunity Management
- `GET /admin/opportunities` - Fetch all opportunities (with pagination and filters)
- `PATCH /admin/opportunity/:id/status` - Update opportunity status

#### Analytics (Bonus)
- `GET /admin/stats` - Get system statistics

### API Usage Examples

#### Fetch Users with Filtering and Pagination
```
GET /admin/users?role=player&page=1&limit=10
Authorization: Bearer <your_jwt_token>
```

#### Soft Delete a User
```
DELETE /admin/user/60d21b4667d0d8992e610c85
Authorization: Bearer <your_jwt_token>
```

#### Update Opportunity Status
```
PATCH /admin/opportunity/60d21b4667d0d8992e610c85/status
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "status": "approved"
}
```

## Frontend (arc_frontend)

### Tech Stack

- React.js - Frontend library
- React Router - Navigation
- Axios - API requests
- TailwindCSS - Styling

### Installation & Setup

1. Navigate to the frontend directory:
   ```bash
   cd arc_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Main Components

- **Login Page**: Administrator authentication
- **Dashboard**: Main layout with navigation
- **Users Management Page**: Displays users with filters and pagination
- **Opportunities Management Page**: Displays opportunities with filters and status management

## Running the Complete Application

### Development Mode

1. Start the backend server:
   ```bash
   cd arc_backend
   npm run dev
   ```

2. In a new terminal, start the frontend server:
   ```bash
   cd arc_frontend
   npm start
   ```

3. Access the application at http://localhost:3000

### Production Mode

1. Build the frontend:
   ```bash
   cd arc_frontend
   npm run build
   ```

2. Start the backend server in production mode:
   ```bash
   cd arc_backend
   npm start
   ```

## Database Schema

### User Model

```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (player, organizer, admin),
  isDeleted: Boolean,
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Opportunity Model

```javascript
{
  title: String,
  description: String,
  status: String (pending, approved, closed),
  organizer: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication Flow

1. Admin enters credentials on the login page
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage/sessionStorage
4. Token is sent with each subsequent request in Authorization header
5. Backend middleware validates token and role before processing requests

## Troubleshooting

### Common Issues:

1. **Connection to MongoDB failed**
   - Check if MongoDB is running
   - Verify connection string in `.env` file

2. **JWT Authentication issues**
   - Ensure JWT_SECRET is set correctly
   - Check token expiration

3. **CORS errors**
   - Verify CORS is properly configured on backend
   - Check API URL in frontend environment

## Contributing Guidelines

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request
