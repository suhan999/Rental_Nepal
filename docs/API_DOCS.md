# API Documentation

## Authentication Endpoints

### POST /api/auth/login
User login endpoint
- Request: `{ email, password }`
- Response: `{ token, user }`

### POST /api/auth/register
User registration endpoint
- Request: `{ name, email, password }`
- Response: `{ user, token }`

## Property Endpoints

### GET /api/properties
Fetch all properties
- Query params: `page, limit, filter`
- Response: `{ properties, total }`

### GET /api/properties/:id
Fetch property details
- Response: `{ property }`
