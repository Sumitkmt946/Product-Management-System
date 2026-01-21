# Slooze Backend API

A comprehensive REST API for the Slooze product management system built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: Full CRUD operations for products with image upload
- **User Management**: Admin functionality for managing users
- **File Upload**: Image upload support with Multer
- **Security**: Helmet, CORS, rate limiting, input validation
- **Error Handling**: Comprehensive error handling and logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **File Upload**: Multer
- **Security**: Helmet, CORS, express-rate-limit
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd slooze-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/slooze
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. Start MongoDB service (if running locally)

5. Seed the database with sample data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

#### POST /api/auth/login
Login user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "MANAGER"
    }
  }
}
```

#### POST /api/auth/register
Register a new user (Manager only).

#### GET /api/auth/me
Get current user profile.

#### PUT /api/auth/update-password
Update user password.

### Products

#### GET /api/products
Get all products with pagination, search, and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `category`: Filter by category
- `minStock`: Filter products below minimum stock

#### GET /api/products/:id
Get single product by ID.

#### POST /api/products
Create new product with image upload.

**Request Body (Form Data):**
- `name`: Product name
- `description`: Product description
- `category`: Product category
- `price`: Product price
- `stock`: Current stock quantity
- `minStock`: Minimum stock threshold
- `sku`: Stock Keeping Unit
- `barcode`: Product barcode
- `image`: Product image file

#### PUT /api/products/:id
Update product.

#### DELETE /api/products/:id
Delete product.

#### GET /api/products/stats/dashboard
Get dashboard statistics (Manager only).

### Users (Manager Only)

#### GET /api/users
Get all users with pagination.

#### GET /api/users/:id
Get single user by ID.

#### POST /api/users
Create new user.

#### PUT /api/users/:id
Update user.

#### DELETE /api/users/:id
Delete user.

#### PUT /api/users/:id/reset-password
Reset user password.

### Health Check

#### GET /api/health
Check API health status.

## User Roles

- **MANAGER**: Full access to all features including user management
- **STORE_KEEPER**: Can manage products but not users

## File Upload

- Images are stored in the `uploads/` directory
- Supported formats: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB
- Images are accessible via `/uploads/filename`

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Development

### Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm run seed`: Seed database with sample data
- `npm test`: Run tests (if implemented)

### Project Structure

```
slooze-backend/
├── models/           # Mongoose models
│   ├── User.js
│   └── Product.js
├── routes/           # API routes
│   ├── auth.js
│   ├── products.js
│   └── users.js
├── middleware/       # Custom middleware
│   └── auth.js
├── uploads/          # File uploads directory
├── server.js         # Main server file
├── seed.js           # Database seeding script
├── package.json
├── .env              # Environment variables
└── README.md
```

## Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention through parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.