# RohanRice Marketplace API Documentation

**Base URL**: `https://api.rohanrice.com` (Production) or `http://localhost:5000` (Development)

**WebSocket URL**: `https://rohanrice.com` (Production) or `http://localhost:3000` (Development)

---

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Token Structure

```javascript
{
  "id": "user_id",
  "role": "user|admin",
  "iat": 1234567890,
  "exp": 1234654290  // 7 days from creation
}
```

### Refresh Token Flow

1. After 7 days, JWT expires
2. Frontend uses refresh token to request new JWT
3. Backend returns new JWT (valid for 7 more days)

---

## 1. Authentication Routes

### 1.1 Sign Up

**Endpoint**: `POST /api/auth/signup`

**Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+14155552677",
  "country": "United States"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+14155552677",
    "role": "user"
  },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors**:
- 400: Email already registered
- 400: Invalid password format (min 8 chars, must include upper, lower, digit, special)

---

### 1.2 Login

**Endpoint**: `POST /api/auth/login`

**Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "lastLogin": "2026-02-27T10:30:00.000Z"
  },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors**:
- 401: Invalid credentials
- 404: User not found

---

### 1.3 Request OTP

**Endpoint**: `POST /api/auth/request-otp`

**Body**:
```json
{
  "email": "john@example.com",
  "otpType": "email|sms|both",
  "purpose": "signup|login|password-reset"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otpId": "otp_456",
  "expiresIn": 600,  // seconds (10 minutes)
  "note": "[Development Only] OTP: 123456"
}
```

**Errors**:
- 400: Invalid email or phone
- 429: Too many OTP requests (rate limited)

---

### 1.4 Verify OTP

**Endpoint**: `POST /api/auth/verify-otp`

**Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "purpose": "signup|login",
  "userData": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+14155552677",
    "password": "SecurePass123!"
  }
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "firstName": "John",
    "role": "user"
  },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors**:
- 400: Invalid or expired OTP
- 400: Max attempts exceeded (5 limit)
- 404: OTP not found

---

### 1.5 Get User Profile

**Endpoint**: `GET /api/auth/me`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Response (200)**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+14155552677",
    "company": "John's Rice Trading",
    "country": "United States",
    "role": "user",
    "isVerified": true,
    "addresses": [
      {
        "type": "shipping|billing",
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94105",
        "country": "United States"
      }
    ],
    "lastLogin": "2026-02-27T10:30:00.000Z"
  }
}
```

**Errors**:
- 401: Unauthorized (missing/invalid token)

---

### 1.6 Update User Profile

**Endpoint**: `PUT /api/auth/profile`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+14155552677",
  "company": "John's Rice Trading",
  "country": "United States"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe",
    "company": "John's Rice Trading",
    "country": "United States",
    "updatedAt": "2026-02-27T10:30:00.000Z"
  }
}
```

---

### 1.7 Logout

**Endpoint**: `POST /api/auth/logout`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note**: Token removal happens on frontend (localStorage/sessionStorage cleanup)

---

## 2. Product Routes

### 2.1 List Products

**Endpoint**: `GET /api/products?page=1&limit=10&variety=Basmati&sort=price`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `variety` (optional): Filter by variety (Basmati, 1121, Super Kernel, IRRI-6, Sella, Brown)
- `sort` (optional): Sort by field (price, rating, stock, createdAt)
- `order` (optional): asc or desc (default: desc)

**Response (200)**:
```json
{
  "success": true,
  "products": [
    {
      "id": "prod_001",
      "name": "Premium Basmati Rice",
      "variety": "Basmati",
      "price": 1.20,
      "stock": 500,
      "rating": 4.9,
      "reviewCount": 234,
      "images": [
        "https://cdn.example.com/basmati-1.jpg",
        "https://cdn.example.com/basmati-2.jpg"
      ],
      "description": "Premium basmati rice from India...",
      "specification": {
        "length": "8.5mm",
        "color": "Cream",
        "aroma": "Strong basmati aroma",
        "texture": "Light, fluffy",
        "cookingTime": "18 minutes",
        "moisture": "12%",
        "brokenPercentage": "<2%",
        "purity": "99%"
      },
      "certifications": ["ISO 9001:2015", "FDA Approved"],
      "packaging": ["1kg", "5kg", "25kg", "Bulk", "Custom"],
      "seo": {
        "metaTitle": "Premium Basmati Rice | RohanRice Marketplace",
        "metaDescription": "High-quality Indian basmati rice...",
        "keywords": ["basmati rice", "premium rice", "Indian basmati"]
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### 2.2 Get Single Product

**Endpoint**: `GET /api/products/:id`

**Response (200)**:
```json
{
  "success": true,
  "product": {
    "id": "prod_001",
    "name": "Premium Basmati Rice",
    // ... same as above
  }
}
```

**Errors**:
- 404: Product not found

---

### 2.3 Search Products (Algolia AI)

**Endpoint**: `GET /api/products/search/ai?q=long+grain+rice`

**Query Parameters**:
- `q` (required): Search query
- `hitsPerPage` (optional): Results to return (default: 10, max: 50)

**Response (200)**:
```json
{
  "success": true,
  "results": {
    "aiAnswer": {
      "message": "Long grain rice varieties include Basmati and 1121. Basmati rice is known for its aromatic properties and is perfect for biryanis and pilafs.",
      "sources": ["prod_001", "prod_002"]
    },
    "hits": [
      {
        "id": "prod_001",
        "name": "Premium Basmati Rice",
        "variety": "Basmati",
        "price": 1.20,
        "highlight": "Long grain rice with <em>premium</em> quality"
      }
    ]
  }
}
```

**Note**: AI answer appears first, followed by product matches

---

### 2.4 Featured Products

**Endpoint**: `GET /api/products/featured`

**Response (200)**:
```json
{
  "success": true,
  "products": [
    {
      "id": "prod_001",
      "name": "Premium Basmati Rice",
      "variety": "Basmati",
      "price": 1.20,
      "rating": 4.9,
      "reviewCount": 234
    }
  ]
}
```

---

### 2.5 Rice Variety Statistics

**Endpoint**: `GET /api/products/varieties/list`

**Response (200)**:
```json
{
  "success": true,
  "varieties": [
    {
      "name": "Basmati",
      "count": 2,
      "avgPrice": 1.275,
      "avgRating": 4.85,
      "minPrice": 1.20,
      "maxPrice": 1.35
    },
    {
      "name": "1121",
      "count": 1,
      "avgPrice": 1.35,
      "avgRating": 4.8,
      "minPrice": 1.35,
      "maxPrice": 1.35
    }
  ]
}
```

---

## 3. Cart Routes

### 3.1 Get User Cart

**Endpoint**: `GET /api/cart`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Response (200)**:
```json
{
  "success": true,
  "cart": {
    "id": "cart_789",
    "userId": "user_123",
    "items": [
      {
        "productId": "prod_001",
        "name": "Premium Basmati Rice",
        "quantity": 5,
        "price": 1.20,
        "subtotal": 6.00,
        "image": "https://cdn.example.com/basmati-1.jpg"
      }
    ],
    "totalItems": 5,
    "totalPrice": 6.00,
    "lastUpdated": "2026-02-27T10:30:00.000Z"
  }
}
```

---

### 3.2 Add to Cart

**Endpoint**: `POST /api/cart/add`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Body**:
```json
{
  "productId": "prod_001",
  "quantity": 5
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Product added to cart",
  "cart": {
    "id": "cart_789",
    "items": [
      {
        "productId": "prod_001",
        "name": "Premium Basmati Rice",
        "quantity": 5,
        "price": 1.20,
        "subtotal": 6.00
      }
    ],
    "totalItems": 5,
    "totalPrice": 6.00
  }
}
```

**Errors**:
- 400: Product not found
- 400: Insufficient stock (max available: X units)

---

### 3.3 Update Cart Item

**Endpoint**: `PUT /api/cart/update/:productId`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Body**:
```json
{
  "quantity": 10
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Cart updated",
  "cart": {
    "id": "cart_789",
    "items": [
      {
        "productId": "prod_001",
        "name": "Premium Basmati Rice",
        "quantity": 10,
        "price": 1.20,
        "subtotal": 12.00
      }
    ],
    "totalItems": 10,
    "totalPrice": 12.00
  }
}
```

---

### 3.4 Remove from Cart

**Endpoint**: `DELETE /api/cart/remove/:productId`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Item removed from cart",
  "cart": { /* updated cart */ }
}
```

---

### 3.5 Clear Cart

**Endpoint**: `DELETE /api/cart/clear`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Cart cleared",
  "cart": {
    "id": "cart_789",
    "items": [],
    "totalItems": 0,
    "totalPrice": 0
  }
}
```

---

## 4. Order Routes

### 4.1 Create Order

**Endpoint**: `POST /api/orders/create`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Body**:
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105",
    "country": "United States"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105",
    "country": "United States"
  },
  "paymentMethod": "credit_card|paypal|bank_transfer",
  "promoCode": "SAVE10"  // optional
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "order_999",
    "orderNumber": "RR-1708999800000-12345",
    "userId": "user_123",
    "items": [
      {
        "productId": "prod_001",
        "name": "Premium Basmati Rice",
        "quantity": 5,
        "price": 1.20,
        "subtotal": 6.00
      }
    ],
    "totals": {
      "subtotal": 6.00,
      "tax": 0.60,
      "shipping": 5.00,
      "discount": 0,
      "total": 11.60
    },
    "shippingAddress": { /* ... */ },
    "billingAddress": { /* ... */ },
    "paymentMethod": "credit_card",
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "estimatedDelivery": "2026-03-05T00:00:00.000Z",
    "createdAt": "2026-02-27T10:30:00.000Z"
  }
}
```

**Errors**:
- 400: Cart is empty
- 400: Invalid shipping address
- 400: Insufficient stock

---

### 4.2 List User Orders

**Endpoint**: `GET /api/orders?page=1&limit=10&status=pending`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): pending, confirmed, processing, shipped, delivered, cancelled

**Response (200)**:
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_999",
      "orderNumber": "RR-1708999800000-12345",
      "totalPrice": 11.60,
      "paymentStatus": "pending",
      "orderStatus": "pending",
      "estimatedDelivery": "2026-03-05T00:00:00.000Z",
      "createdAt": "2026-02-27T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

---

### 4.3 Get Order Details

**Endpoint**: `GET /api/orders/:id`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Response (200)**:
```json
{
  "success": true,
  "order": {
    "id": "order_999",
    "orderNumber": "RR-1708999800000-12345",
    "userId": "user_123",
    "items": [ /* ... */ ],
    "totals": { /* ... */ },
    "shippingAddress": { /* ... */ },
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "trackingNumber": null,
    "notes": "",
    "createdAt": "2026-02-27T10:30:00.000Z"
  }
}
```

---

### 4.4 Cancel Order

**Endpoint**: `PUT /api/orders/:id/cancel`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    "id": "order_999",
    "orderStatus": "cancelled",
    "cancelledAt": "2026-02-27T10:35:00.000Z"
  }
}
```

**Errors**:
- 400: Order already shipped or delivered
- 404: Order not found or unauthorized

---

## 5. Admin Routes

### 5.1 Dashboard Statistics

**Endpoint**: `GET /api/admin/stats`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Response (200)**:
```json
{
  "success": true,
  "stats": {
    "totalOrders": 45,
    "totalRevenue": 2345.67,
    "totalUsers": 123,
    "totalProducts": 6,
    "recentOrders": [
      {
        "id": "order_999",
        "orderNumber": "RR-1708999800000-12345",
        "customerName": "John Doe",
        "total": 11.60,
        "status": "pending",
        "createdAt": "2026-02-27T10:30:00.000Z"
      }
    ],
    "topProducts": [
      {
        "id": "prod_001",
        "name": "Premium Basmati Rice",
        "sales": 156,
        "revenue": 187.20
      }
    ]
  }
}
```

---

### 5.2 Create Product

**Endpoint**: `POST /api/admin/products`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Body**:
```json
{
  "name": "Premium Basmati Rice",
  "variety": "Basmati",
  "price": 1.20,
  "stock": 500,
  "category": "Premium",
  "description": "High-quality basmati rice...",
  "origin": {
    "country": "India",
    "region": "Punjab",
    "farm": "Arora Farms"
  },
  "specification": {
    "length": "8.5mm",
    "color": "Cream",
    "aroma": "Strong basmati aroma",
    "texture": "Light, fluffy",
    "cookingTime": "18 minutes",
    "moisture": "12%",
    "brokenPercentage": "<2%",
    "purity": "99%"
  },
  "certifications": ["ISO 9001:2015", "FDA Approved"],
  "images": [
    "https://cdn.example.com/basmati-1.jpg",
    "https://cdn.example.com/basmati-2.jpg"
  ],
  "packaging": ["1kg", "5kg", "25kg", "Bulk"],
  "rating": 4.9,
  "reviewCount": 234,
  "seo": {
    "metaTitle": "Premium Basmati Rice | RohanRice Marketplace",
    "metaDescription": "High-quality Indian basmati rice...",
    "keywords": ["basmati rice", "premium rice"]
  }
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "id": "prod_001",
    "name": "Premium Basmati Rice",
    // ... full product details
  }
}
```

---

### 5.3 Update Product

**Endpoint**: `PUT /api/admin/products/:id`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Body**: Same as create (any fields to update)

**Response (200)**:
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": { /* updated product */ }
}
```

---

### 5.4 Delete Product

**Endpoint**: `DELETE /api/admin/products/:id`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Response (200)**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 5.5 Update Product Stock (Real-time)

**Endpoint**: `PATCH /api/admin/products/:id/stock`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Body**:
```json
{
  "stock": 250,
  "reason": "Spring inventory update"  // optional
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Stock updated successfully",
  "product": {
    "id": "prod_001",
    "name": "Premium Basmati Rice",
    "stock": 250,
    "status": "in_stock"  // in_stock, low_stock, out_of_stock
  }
}
```

**Socket.io Broadcast**:
```javascript
// All connected clients receive:
{
  event: 'stock-updated',
  data: {
    productId: 'prod_001',
    stock: 250,
    status: 'in_stock'
  }
}
```

---

### 5.6 List All Orders (Admin)

**Endpoint**: `GET /api/admin/orders?page=1&limit=20&status=pending`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Response (200)**:
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_999",
      "orderNumber": "RR-1708999800000-12345",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "total": 11.60,
      "paymentStatus": "pending",
      "orderStatus": "pending",
      "createdAt": "2026-02-27T10:30:00.000Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### 5.7 Update Order Status

**Endpoint**: `PATCH /api/admin/orders/:id/status`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Body**:
```json
{
  "orderStatus": "confirmed|processing|shipped|delivered|cancelled",
  "trackingNumber": "TRACK123456789",  // optional, for shipped status
  "notes": "Order dispatched"  // optional
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Order status updated",
  "order": {
    "id": "order_999",
    "orderStatus": "shipped",
    "trackingNumber": "TRACK123456789",
    "updatedAt": "2026-02-27T10:35:00.000Z"
  }
}
```

**Socket.io Broadcast** (to user room):
```javascript
{
  event: 'order-updated',
  data: {
    orderId: 'order_999',
    status: 'shipped',
    trackingNumber: 'TRACK123456789'
  }
}
```

---

### 5.8 Bulk Index Products in Algolia

**Endpoint**: `POST /api/admin/bulk-index`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Response (200)**:
```json
{
  "success": true,
  "message": "All products indexed successfully",
  "indexedCount": 6
}
```

---

## 6. Message/Inquiry Routes

### 6.1 Submit Contact Inquiry

**Endpoint**: `POST /api/messages/submit`

**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+14155552677",
  "type": "inquiry|bulk-order|support|feedback|partnership",
  "subject": "Bulk order enquiry",
  "message": "I'm interested in ordering 10 tons of basmati rice...",
  "productId": "prod_001",  // optional
  "attachments": []  // optional
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Message submitted successfully",
  "inquiry": {
    "id": "msg_001",
    "status": "new",
    "createdAt": "2026-02-27T10:30:00.000Z"
  }
}
```

**Auto Actions**:
- Email sent to admin@rohanrice.com
- Confirmation email sent to user
- Socket.io notification sent to admin dashboard

---

### 6.2 Get Messages (Admin)

**Endpoint**: `GET /api/messages?page=1&limit=10&status=new`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Query Parameters**:
- `status` (optional): new, read, responded, closed
- `type` (optional): inquiry, bulk-order, support, feedback, partnership

**Response (200)**:
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_001",
      "type": "inquiry",
      "senderName": "John Doe",
      "senderEmail": "john@example.com",
      "subject": "Bulk order enquiry",
      "message": "I'm interested in ordering...",
      "status": "new",
      "priority": "high",
      "createdAt": "2026-02-27T10:30:00.000Z"
    }
  ]
}
```

---

### 6.3 Message Statistics (Admin)

**Endpoint**: `GET /api/messages/stats/overview`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Response (200)**:
```json
{
  "success": true,
  "stats": {
    "totalMessages": 45,
    "newCount": 5,
    "respondedCount": 32,
    "closedCount": 8,
    "byType": {
      "inquiry": 12,
      "bulk-order": 8,
      "support": 15,
      "feedback": 7,
      "partnership": 3
    }
  }
}
```

---

### 6.4 Admin Respond to Message

**Endpoint**: `PUT /api/messages/:id/respond`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Body**:
```json
{
  "response": "Thank you for your inquiry. We can provide 10 tons at a special bulk rate..."
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Response sent successfully",
  "inquiry": {
    "id": "msg_001",
    "status": "responded",
    "adminResponse": {
      "message": "Thank you for your inquiry...",
      "respondedAt": "2026-02-27T10:35:00.000Z"
    }
  }
}
```

**Auto Actions**:
- Response email sent to user
- Socket.io notification to user (if logged in)

---

### 6.5 Close Message

**Endpoint**: `PUT /api/messages/:id/close`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Response (200)**:
```json
{
  "success": true,
  "message": "Message closed",
  "inquiry": {
    "id": "msg_001",
    "status": "closed",
    "closedAt": "2026-02-27T10:35:00.000Z"
  }
}
```

---

### 6.6 Mark Message as Read

**Endpoint**: `PUT /api/messages/:id/read`

**Headers**: `Authorization: Bearer <JWT_TOKEN>` (admin only)

**Response (200)**:
```json
{
  "success": true,
  "message": "Message marked as read",
  "inquiry": {
    "id": "msg_001",
    "status": "read"
  }
}
```

---

## 7. Health Check

### 7.1 API Health

**Endpoint**: `GET /api/health`

**Response (200)**:
```json
{
  "status": "ok",
  "timestamp": "2026-02-27T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional information"
  }
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `AUTH_FAILED` - Authentication error
- `UNAUTHORIZED` - No permission for this action
- `NOT_FOUND` - Resource doesn't exist
- `DUPLICATE_ENTRY` - Resource already exists
- `INSUFFICIENT_STOCK` - Not enough inventory
- `RATE_LIMITED` - Too many requests

---

## Rate Limiting

- **Normal endpoints**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 requests per 15 minutes per email

Response headers include:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1708906200
```

---

## Pagination

List endpoints support pagination:

```
GET /api/products?page=2&limit=20
```

Response includes:
```json
{
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 245,
    "pages": 13
  }
}
```

---

## Real-time Events (Socket.io)

Connect to WebSocket and listen for events:

```javascript
import io from 'socket.io-client';

const socket = io('https://rohanrice.com', {
  auth: {
    token: jwtToken
  }
});

// Subscribe to stock updates
socket.emit('subscribe-stock', { productId: 'prod_001' });
socket.on('stock-updated', (data) => {
  console.log(`Stock for ${data.productId}: ${data.stock}`);
});

// Listen for order updates (user's own orders)
socket.on('order-updated', (data) => {
  console.log(`Order ${data.orderId} status: ${data.status}`);
});

// Admin: Listen for new messages
socket.on('new-message', (message) => {
  console.log(`New ${message.type}: ${message.subject}`);
});
```

---

## Testing with cURL

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Get products
curl http://localhost:5000/api/products

# Add to cart (requires token)
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_001",
    "quantity": 5
  }'
```

---

**Next**: See [POSTMAN_COLLECTION.json](./POSTMAN_COLLECTION.json) for importing all endpoints into Postman for easy testing.

