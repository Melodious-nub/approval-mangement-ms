# Approval Management System - Backend API Documentation

## Overview

This document provides comprehensive information for developing the backend API for the **Approval Management System** using **Java Spring Boot**. The frontend is built with Angular and communicates with the backend via RESTful APIs.

## Table of Contents

- [Technology Stack](#technology-stack)
- [API Base URL](#api-base-url)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)
- [Development Guidelines](#development-guidelines)

---

## Technology Stack

### Recommended Stack
- **Java**: 17 or higher
- **Spring Boot**: 3.x
- **Spring Security**: JWT-based authentication
- **Spring Data JPA**: Database operations
- **Database**: PostgreSQL (recommended) or MySQL
- **Maven/Gradle**: Build tool
- **Lombok**: Code simplification
- **MapStruct**: DTO mapping (optional)

---

## API Base URL

```
Base URL: http://localhost:8080/api
```

All API endpoints should be prefixed with `/api`.

---

## Authentication

### Authentication Method
The frontend uses **JWT (JSON Web Token)** authentication with Bearer tokens.

### Headers
All authenticated requests must include:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Authentication Endpoints

#### 1. Login
```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password1"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "active": true
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password",
  "status": 401,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Error Response (403 Forbidden - Inactive User):**
```json
{
  "error": "User account is inactive",
  "status": 403,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### 2. Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "active": true
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "status": 401,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

---

## API Endpoints

### Users API

#### 1. Get All Users
```http
GET /api/users
Authorization: Bearer {token}
```

**Query Parameters (Optional):**
- `active`: boolean - Filter by active status (e.g., `?active=true`)

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "active": true
  },
  {
    "id": "2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "active": true
  }
]
```

#### 2. Get User by ID
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "active": true
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found",
  "status": 404,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### 3. Create User
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "securePassword123",
  "active": true
}
```

**Response (201 Created):**
```json
{
  "id": "7",
  "name": "New User",
  "email": "newuser@example.com",
  "active": true
}
```

**Error Response (400 Bad Request - Email exists):**
```json
{
  "error": "Email already exists",
  "status": 400,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### 4. Update User
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "password": "newPassword123",
  "active": true
}
```

**Note:** All fields are optional. Only include fields you want to update. If password is not provided, it should not be changed.

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Updated Name",
  "email": "updated@example.com",
  "active": true
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Email already exists",
  "status": 400,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### 5. Deactivate User
```http
PATCH /api/users/{id}/deactivate
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "active": false
}
```

---

### Requisitions API

#### 1. Get All Requisitions
```http
GET /api/requisitions
Authorization: Bearer {token}
```

**Query Parameters (Optional):**
- `status`: string - Filter by status (e.g., `?status=Pending`)
- `createdBy`: string - Filter by creator ID (e.g., `?createdBy=1`)
- `assignedTo`: string - Filter by assigned approver ID (e.g., `?assignedTo=2`)

**Response (200 OK):**
```json
[
  {
    "id": "req_1",
    "referenceNumber": "MEMO-2024-001",
    "date": "2024-01-15T00:00:00Z",
    "subject": "Office Equipment Purchase",
    "tinNumber": "123456789",
    "binNid": "987654321",
    "summary": "Request for purchasing new office equipment...",
    "budget": 500000,
    "accountsPersonId": "2",
    "createdBy": "1",
    "assignedApprovers": ["2", "3"],
    "status": "Pending",
    "createdAt": "2024-01-15T08:00:00Z",
    "approvalHistory": [],
    "attachedFiles": [
      {
        "id": "file_1",
        "fileName": "quotation.pdf",
        "fileSize": 245000,
        "uploadDate": "2024-01-15T08:00:00Z",
        "fileType": "application/pdf",
        "fileUrl": "/api/files/file_1"
      }
    ],
    "remarks": "Urgent request"
  }
]
```

#### 2. Get Requisition by ID
```http
GET /api/requisitions/{id}
Authorization: Bearer {token}
```

**Response (200 OK):** (Same format as above, single object)

**Error Response (404 Not Found):**
```json
{
  "error": "Requisition not found",
  "status": 404,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### 3. Create Requisition
```http
POST /api/requisitions
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "referenceNumber": "MEMO-2024-006",
  "date": "2024-01-20",
  "subject": "New Requisition",
  "tinNumber": "123456789",
  "binNid": "987654321",
  "summary": "Detailed description of the requisition",
  "budget": 100000,
  "accountsPersonId": "2",
  "createdBy": "1",
  "assignedApprovers": ["2", "3"],
  "status": "Draft",
  "attachedFiles": [
    {
      "fileName": "document.pdf",
      "fileSize": 102400,
      "fileType": "application/pdf"
    }
  ],
  "remarks": "Optional remarks"
}
```

**Note:** 
- `id`, `createdAt`, and `approvalHistory` are auto-generated by the backend
- If `referenceNumber` is not provided, backend should generate it in format: `MEMO-YYYY-NNN` (e.g., `MEMO-2024-001`)
- Reference number should be sequential per year

**Response (201 Created):**
```json
{
  "id": "req_6",
  "referenceNumber": "MEMO-2024-006",
  "date": "2024-01-20T00:00:00Z",
  "subject": "New Requisition",
  "tinNumber": "123456789",
  "binNid": "987654321",
  "summary": "Detailed description of the requisition",
  "budget": 100000,
  "accountsPersonId": "2",
  "createdBy": "1",
  "assignedApprovers": ["2", "3"],
  "status": "Draft",
  "createdAt": "2024-01-20T10:30:00Z",
  "approvalHistory": [],
  "attachedFiles": [
    {
      "id": "file_3",
      "fileName": "document.pdf",
      "fileSize": 102400,
      "uploadDate": "2024-01-20T10:30:00Z",
      "fileType": "application/pdf",
      "fileUrl": "/api/files/file_3"
    }
  ],
  "remarks": "Optional remarks"
}
```

#### 4. Update Requisition
```http
PUT /api/requisitions/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** (Same as create, all fields optional)

**Response (200 OK):** (Updated requisition object)

**Error Response (403 Forbidden):**
```json
{
  "error": "Cannot update requisition that is not in Draft status",
  "status": 403,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### 5. Approve Requisition
```http
POST /api/requisitions/{id}/approve
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "comment": "Approved for budget allocation"
}
```

**Note:** The `approverId` should be extracted from the JWT token (current user).

**Response (200 OK):** (Updated requisition with approval action added)

**Business Logic:**
- Check if the current user is in the `assignedApprovers` list
- Check if the user has already taken action on this requisition
- Add approval action to `approvalHistory`
- If all approvers have approved, update status to `"Approved"`
- Otherwise, keep status as `"Pending"`

**Error Response (403 Forbidden):**
```json
{
  "error": "User is not assigned as approver",
  "status": 403,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "User has already taken action on this requisition",
  "status": 400,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### 6. Reject Requisition
```http
POST /api/requisitions/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "comment": "Budget constraints, please reduce quantity"
}
```

**Response (200 OK):** (Updated requisition with rejection action added)

**Business Logic:**
- Check if the current user is in the `assignedApprovers` list
- Check if the user has already taken action on this requisition
- Add rejection action to `approvalHistory`
- Update status to `"Rejected"` (any rejection rejects the entire requisition)

---

## Data Models

### User

```json
{
  "id": "string (UUID or generated ID)",
  "name": "string (required, min: 1, max: 255)",
  "email": "string (required, valid email format, unique)",
  "password": "string (required on create/update, hashed in database, never returned in GET)",
  "active": "boolean (default: true)"
}
```

### Requisition

```json
{
  "id": "string (UUID or generated ID)",
  "referenceNumber": "string (format: MEMO-YYYY-NNN, auto-generated if not provided)",
  "date": "datetime (ISO 8601 format, date only)",
  "subject": "string (required, min: 1, max: 500)",
  "tinNumber": "string (required)",
  "binNid": "string (required)",
  "summary": "string (required, min: 1)",
  "budget": "number (optional, positive)",
  "accountsPersonId": "string | null (user ID, optional)",
  "createdBy": "string (user ID, required)",
  "assignedApprovers": "string[] (array of user IDs)",
  "status": "enum: 'Draft' | 'Pending' | 'Approved' | 'Rejected'",
  "createdAt": "datetime (ISO 8601, auto-generated)",
  "approvalHistory": "ApprovalAction[]",
  "attachedFiles": "FileAttachment[]",
  "remarks": "string (optional)"
}
```

### ApprovalAction

```json
{
  "approverId": "string (user ID)",
  "action": "enum: 'Approved' | 'Rejected'",
  "comment": "string (required, min: 1)",
  "actionDate": "datetime (ISO 8601, auto-generated)"
}
```

### FileAttachment

```json
{
  "id": "string (UUID or generated ID)",
  "fileName": "string (required)",
  "fileSize": "number (bytes, required, positive)",
  "uploadDate": "datetime (ISO 8601, auto-generated)",
  "fileType": "string (MIME type, optional)",
  "fileUrl": "string (URL to download file, optional)"
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message description",
  "status": 400,
  "timestamp": "2024-01-20T10:30:00Z",
  "path": "/api/requisitions/req_1"
}
```

### HTTP Status Codes

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST (resource created)
- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Authenticated but not authorized for the action
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

### Validation Errors

```json
{
  "error": "Validation failed",
  "status": 400,
  "timestamp": "2024-01-20T10:30:00Z",
  "validationErrors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

---

## Database Schema

### Suggested Entity-Relationship Design

#### User Table
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(active);
```

#### Requisition Table
```sql
CREATE TABLE requisitions (
    id VARCHAR(255) PRIMARY KEY,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    subject VARCHAR(500) NOT NULL,
    tin_number VARCHAR(100) NOT NULL,
    bin_nid VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    budget DECIMAL(15, 2),
    accounts_person_id VARCHAR(255),
    created_by VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Draft', 'Pending', 'Approved', 'Rejected')),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (accounts_person_id) REFERENCES users(id)
);

CREATE INDEX idx_requisitions_reference ON requisitions(reference_number);
CREATE INDEX idx_requisitions_created_by ON requisitions(created_by);
CREATE INDEX idx_requisitions_status ON requisitions(status);
CREATE INDEX idx_requisitions_date ON requisitions(date);
```

#### Requisition Approvers (Many-to-Many)
```sql
CREATE TABLE requisition_approvers (
    requisition_id VARCHAR(255) NOT NULL,
    approver_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (requisition_id, approver_id),
    FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_req_approvers_requisition ON requisition_approvers(requisition_id);
CREATE INDEX idx_req_approvers_approver ON requisition_approvers(approver_id);
```

#### Approval Action Table
```sql
CREATE TABLE approval_actions (
    id VARCHAR(255) PRIMARY KEY,
    requisition_id VARCHAR(255) NOT NULL,
    approver_id VARCHAR(255) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('Approved', 'Rejected')),
    comment TEXT NOT NULL,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id),
    UNIQUE KEY unique_approver_action (requisition_id, approver_id)
);

CREATE INDEX idx_approval_actions_requisition ON approval_actions(requisition_id);
CREATE INDEX idx_approval_actions_approver ON approval_actions(approver_id);
```

#### File Attachment Table
```sql
CREATE TABLE file_attachments (
    id VARCHAR(255) PRIMARY KEY,
    requisition_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100),
    file_path VARCHAR(500),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE
);

CREATE INDEX idx_file_attachments_requisition ON file_attachments(requisition_id);
```

---

## Development Guidelines

### 1. Security Best Practices

- **Password Hashing**: Use BCrypt or Argon2 for password hashing. Never store plain text passwords.
- **JWT Token**: 
  - Use strong secret key (minimum 256 bits)
  - Set appropriate expiration time (recommended: 24 hours)
  - Include user ID and email in token payload
  - Implement token refresh mechanism if needed
- **Input Validation**: Validate all inputs on both client and server side
- **SQL Injection**: Use parameterized queries (JPA handles this automatically)
- **CORS**: Configure CORS to allow requests only from the frontend origin
- **Rate Limiting**: Implement rate limiting for authentication endpoints

### 2. Reference Number Generation

Generate reference numbers in the format: `MEMO-YYYY-NNN`

**Logic:**
- Extract current year (YYYY)
- Find the highest sequence number (NNN) for the current year
- Increment by 1 and pad with zeros (e.g., 001, 002, ...)
- Example: `MEMO-2024-001`, `MEMO-2024-002`, etc.

**Java Example:**
```java
public String generateReferenceNumber(int year) {
    String prefix = "MEMO-" + year + "-";
    long maxSequence = requisitionRepository
        .findMaxSequenceByYear(year)
        .orElse(0L);
    String sequence = String.format("%03d", maxSequence + 1);
    return prefix + sequence;
}
```

### 3. Requisition Status Workflow

1. **Draft**: Initial state, can be edited/deleted by creator
2. **Pending**: Submitted for approval, cannot be edited
3. **Approved**: All assigned approvers have approved
4. **Rejected**: Any assigned approver has rejected

### 4. File Upload Handling

- Store files in a secure directory outside the web root
- Validate file types and sizes
- Generate unique file names to prevent conflicts
- Store file metadata in the database
- Provide secure download endpoints

**Recommended file size limit:** 10MB per file

### 5. Date/Time Format

- Always use ISO 8601 format in JSON responses: `"2024-01-20T10:30:00Z"`
- Use UTC timezone for all timestamps
- Parse dates from frontend in format: `"YYYY-MM-DD"` for date-only fields

### 6. Pagination (Optional but Recommended)

For list endpoints, consider implementing pagination:

```http
GET /api/requisitions?page=0&size=20&sort=createdAt,desc
```

**Response:**
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "currentPage": 0,
  "size": 20
}
```

### 7. Spring Boot Configuration

**application.properties example:**
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/approval_management
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT
jwt.secret=your-256-bit-secret-key-here
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB

# CORS
cors.allowed-origins=http://localhost:4200
```

### 8. Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
    </dependency>
    
    <!-- Database Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

---

## Testing Endpoints

### Using cURL Examples

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password1"
  }'
```

#### Get Requisitions (with token)
```bash
curl -X GET http://localhost:8080/api/requisitions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Approve Requisition
```bash
curl -X POST http://localhost:8080/api/requisitions/req_1/approve \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Approved for budget allocation"
  }'
```

---

## Additional Notes

1. **Multi-tenancy**: Consider adding organization/tenant support if needed
2. **Audit Trail**: Consider logging all approval actions for audit purposes
3. **Notifications**: Implement email/push notifications for approval requests
4. **Reporting**: Consider adding reporting endpoints for analytics
5. **File Storage**: Consider using cloud storage (AWS S3, Azure Blob) for production
6. **Caching**: Implement caching for frequently accessed data (e.g., user list)

---

## Support

For questions or clarifications, please refer to the frontend codebase in the `src/app/core/services/` directory to understand the expected API behavior.

---

**Version**: 1.0.0  
**Last Updated**: January 2024

