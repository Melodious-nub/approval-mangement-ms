# Approval Management System - Backend API Documentation

## Overview

This document provides comprehensive information for developing the backend API for the **Approval Management System** using **Java Spring Boot with MySQL database**. The frontend is built with Angular and communicates with the backend via RESTful APIs.

**Database**: MySQL 8.0 or higher is required for this project.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Development Workflow](#development-workflow)
- [MySQL Database Setup](#mysql-database-setup)
- [API Base URL](#api-base-url)
- [Swagger/OpenAPI Documentation](#swaggeropenapi-documentation)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [Deployment](#deployment)
- [Quick Start Guide](#quick-start-guide)

---

## Development Workflow

This section provides a step-by-step guide for backend development. Follow these steps in order:

### Phase 1: Environment Setup

1. **Install Java 17+**
   ```bash
   java -version  # Verify installation
   ```

2. **Install Maven**
   ```bash
   mvn -version  # Verify installation
   ```

3. **Install MySQL 8.0+**
   ```bash
   mysql --version  # Verify installation
   ```

4. **Install IDE** (IntelliJ IDEA recommended)

### Phase 2: Project Initialization

1. **Create Spring Boot Project**
   - Visit: https://start.spring.io/
   - Project: Maven, Language: Java, Spring Boot: 3.2.x
   - Java: 17
   - Dependencies: Spring Web, Spring Data JPA, Spring Security, MySQL Driver

2. **Clone/Create Project Structure**
   ```
   approval-management-backend/
   ├── src/
   │   ├── main/
   │   │   ├── java/com/yourcompany/approvalmanagement/
   │   │   │   ├── config/
   │   │   │   ├── controller/
   │   │   │   ├── dto/
   │   │   │   ├── entity/
   │   │   │   ├── repository/
   │   │   │   ├── service/
   │   │   │   ├── security/
   │   │   │   └── ApprovalManagementApplication.java
   │   │   └── resources/
   │   │       └── application.properties
   │   └── test/
   └── pom.xml
   ```

### Phase 3: Database Setup

1. **Create MySQL Database** (see [MySQL Database Setup](#mysql-database-setup))
2. **Configure Connection** in `application.properties`
3. **Create Tables** (auto-create with Hibernate or manual SQL)

### Phase 4: Core Implementation (Order Matters!)

1. **Entities** → Create JPA entities (User, Requisition, ApprovalAction, FileAttachment)
2. **Repositories** → Create repository interfaces extending JpaRepository
3. **DTOs** → Create request/response DTOs with validation
4. **Services** → Implement business logic in service classes
5. **Security** → Configure JWT authentication and Spring Security
6. **Controllers** → Create REST controllers with Swagger annotations
7. **Configuration** → Add Swagger/OpenAPI configuration

### Phase 5: Testing & Verification

1. **Start Application** → `mvn spring-boot:run`
2. **Access Swagger UI** → `http://localhost:8080/swagger-ui.html`
3. **Test Endpoints** → Use Swagger UI to test all APIs
4. **Verify Database** → Check tables and data in MySQL

### Phase 6: Frontend Integration

1. **Update Frontend** → Point Angular app to backend API
2. **Test Integration** → Verify end-to-end flow
3. **Fix Issues** → Address any integration problems

---

## Technology Stack

### Recommended Stack
- **Java**: 17 or higher
- **Spring Boot**: 3.x
- **Spring Security**: JWT-based authentication
- **Spring Data JPA**: Database operations
- **Database**: MySQL 8.0 or higher
- **Maven/Gradle**: Build tool (Maven recommended)
- **Lombok**: Code simplification
- **MapStruct**: DTO mapping (optional)

---

## API Base URL

```
Base URL: http://localhost:8080/api
```

All API endpoints should be prefixed with `/api`.

---

## Swagger/OpenAPI Documentation

### Overview

This project uses **SpringDoc OpenAPI 3** (formerly Swagger) for interactive API documentation. Swagger provides a user-friendly interface to explore, test, and understand all API endpoints.

### Access URLs

Once the application is running, access the documentation at:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
- **OpenAPI YAML**: `http://localhost:8080/v3/api-docs.yaml`

### Dependencies

Add the following dependency to your `pom.xml`:

```xml
<!-- SpringDoc OpenAPI UI -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

For Gradle (`build.gradle`):

```gradle
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0'
```

### Configuration Class

Create a configuration class to customize Swagger documentation:

```java
package com.yourapp.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
                .info(new Info()
                        .title("Approval Management System API")
                        .version("1.0.0")
                        .description("RESTful API documentation for the Approval Management System. " +
                                   "This API provides endpoints for user management, requisition creation, " +
                                   "and approval workflow management.")
                        .contact(new Contact()
                                .name("API Support")
                                .email("support@example.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement()
                        .addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT token obtained from login endpoint")));
    }
}
```

### Application Properties

Add the following properties to `application.properties`:

```properties
# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.tryItOutEnabled=true
springdoc.swagger-ui.filter=true
springdoc.swagger-ui.display-request-duration=true

# Enable/Disable Swagger UI (set to false for production)
springdoc.swagger-ui.enabled=true
```

### Controller Annotation Examples

Annotate your controllers with OpenAPI annotations for comprehensive documentation:

#### Example: Auth Controller

```java
package com.yourapp.controller;

import com.yourapp.dto.LoginRequest;
import com.yourapp.dto.LoginResponse;
import com.yourapp.dto.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and user session management endpoints")
public class AuthController {

    @PostMapping("/login")
    @Operation(
        summary = "User login",
        description = "Authenticate a user with email and password. Returns JWT token and user details.",
        operationId = "login"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Login successful",
            content = @Content(schema = @Schema(implementation = LoginResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Invalid credentials",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "403",
            description = "User account is inactive",
            content = @Content
        )
    })
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // Implementation
    }

    @GetMapping("/me")
    @Operation(
        summary = "Get current user",
        description = "Retrieve the currently authenticated user's information",
        operationId = "getCurrentUser"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User retrieved successfully",
            content = @Content(schema = @Schema(implementation = UserDTO.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing token",
            content = @Content
        )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserDTO> getCurrentUser() {
        // Implementation
    }
}
```

#### Example: Requisition Controller

```java
package com.yourapp.controller;

import com.yourapp.dto.RequisitionDTO;
import com.yourapp.dto.RequisitionCreateRequest;
import com.yourapp.dto.ApprovalRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requisitions")
@Tag(name = "Requisitions", description = "Requisition management and approval workflow endpoints")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
public class RequisitionController {

    @GetMapping
    @Operation(
        summary = "Get all requisitions",
        description = "Retrieve a paginated list of requisitions. Supports filtering by status, createdBy, and assignedTo.",
        operationId = "getAllRequisitions"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Requisitions retrieved successfully",
            content = @Content(schema = @Schema(implementation = Page.class))
        )
    })
    public ResponseEntity<Page<RequisitionDTO>> getAllRequisitions(
            @Parameter(description = "Filter by status (Draft, Pending, Approved, Rejected)")
            @RequestParam(required = false) String status,
            @Parameter(description = "Filter by creator user ID")
            @RequestParam(required = false) String createdBy,
            @Parameter(description = "Filter by assigned approver user ID")
            @RequestParam(required = false) String assignedTo,
            Pageable pageable) {
        // Implementation
    }

    @PostMapping
    @Operation(
        summary = "Create a new requisition",
        description = "Create a new requisition/memo. Reference number is auto-generated if not provided.",
        operationId = "createRequisition"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Requisition created successfully",
            content = @Content(schema = @Schema(implementation = RequisitionDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Validation error",
            content = @Content
        )
    })
    public ResponseEntity<RequisitionDTO> createRequisition(
            @Valid @RequestBody RequisitionCreateRequest request) {
        // Implementation
    }

    @PostMapping("/{id}/approve")
    @Operation(
        summary = "Approve a requisition",
        description = "Approve a pending requisition. The current user must be assigned as an approver.",
        operationId = "approveRequisition"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Requisition approved successfully",
            content = @Content(schema = @Schema(implementation = RequisitionDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "User has already taken action or validation error",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "403",
            description = "User is not assigned as approver",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Requisition not found",
            content = @Content
        )
    })
    public ResponseEntity<RequisitionDTO> approveRequisition(
            @Parameter(description = "Requisition ID", required = true)
            @PathVariable String id,
            @Valid @RequestBody ApprovalRequest request) {
        // Implementation
    }
}
```

### DTO Annotation Examples

Annotate your DTOs for better documentation:

```java
package com.yourapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "User information")
public class UserDTO {
    
    @Schema(description = "Unique user identifier", example = "1")
    private String id;
    
    @Schema(description = "User's full name", example = "John Doe", required = true)
    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
    private String name;
    
    @Schema(description = "User's email address", example = "john@example.com", required = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @Schema(description = "Whether the user account is active", example = "true")
    private Boolean active;
}
```

### Security Configuration for Swagger

Update your Spring Security configuration to allow access to Swagger endpoints:

```java
package com.yourapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/api/auth/login",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/swagger-ui.html"
                ).permitAll()
                // All other endpoints require authentication
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
}
```

### Testing with Swagger UI

1. **Access Swagger UI**: Navigate to `http://localhost:8080/swagger-ui.html`
2. **Login**: Use the `/api/auth/login` endpoint to get a JWT token
3. **Authorize**: Click the "Authorize" button (lock icon) at the top right
4. **Enter Token**: Enter `Bearer {your-jwt-token}` or just `{your-jwt-token}` (depending on configuration)
5. **Test Endpoints**: All endpoints are now interactive and can be tested directly from the UI

### Grouping with Tags

Use `@Tag` annotation to group related endpoints:

```java
@Tag(name = "Users", description = "User management endpoints")
@Tag(name = "Requisitions", description = "Requisition management and approval workflow")
@Tag(name = "Authentication", description = "Authentication and session management")
```

### API Documentation Best Practices

1. **Always document** request/response DTOs with `@Schema`
2. **Use descriptive** `summary` and `description` for each endpoint
3. **Include examples** in schema annotations
4. **Document error responses** with `@ApiResponses`
5. **Use proper HTTP status codes** and document them
6. **Tag endpoints logically** for better organization
7. **Document query parameters** with `@Parameter`
8. **Include security requirements** for protected endpoints

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

## MySQL Database Setup

### Prerequisites

1. **Install MySQL 8.0 or higher**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use MySQL via Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0`

2. **Verify MySQL Installation**
   ```bash
   mysql --version
   ```

### Database Creation Steps

1. **Connect to MySQL**
   ```bash
   mysql -u root -p
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE approval_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE approval_management;
   ```

3. **Create Database User (Optional but Recommended)**
   ```sql
   CREATE USER 'approval_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON approval_management.* TO 'approval_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Verify Database**
   ```sql
   SHOW DATABASES;
   SELECT DATABASE();
   ```

### Application Configuration

Update `application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/approval_management?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root  # or 'approval_user' if you created one
spring.datasource.password=your_password
```

**Note**: If using Spring Boot's `ddl-auto=update`, tables will be auto-created. Otherwise, run the SQL scripts below.

---

## Database Schema

### Complete SQL Script for MySQL

Run this script to create all tables manually (if not using Hibernate auto-create):

```sql
USE approval_management;

-- User Table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(active);
```

### Individual Table Definitions

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    status ENUM('Draft', 'Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Draft',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (accounts_person_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    action ENUM('Approved', 'Rejected') NOT NULL,
    comment TEXT NOT NULL,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_approver_action (requisition_id, approver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_file_attachments_requisition ON file_attachments(requisition_id);
```

### MySQL-Specific Notes

1. **Character Set**: All tables use `utf8mb4` to support full Unicode (including emojis)
2. **Storage Engine**: Using `InnoDB` for transaction support and foreign keys
3. **ENUM vs VARCHAR**: Using `ENUM` for status/action fields for better performance and data integrity
4. **ON DELETE Behaviors**:
   - `ON DELETE CASCADE`: Child records deleted when parent is deleted
   - `ON DELETE RESTRICT`: Prevents deletion if child records exist
   - `ON DELETE SET NULL`: Sets foreign key to NULL when parent is deleted

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

# Database - MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/approval_management?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA - Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.id.new_generator_mappings=true
spring.jpa.properties.hibernate.connection.CharSet=utf8mb4
spring.jpa.properties.hibernate.connection.characterEncoding=utf8mb4
spring.jpa.properties.hibernate.connection.useUnicode=true

# JWT
jwt.secret=your-256-bit-secret-key-here
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB

# CORS
cors.allowed-origins=http://localhost:4200

# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.tryItOutEnabled=true
springdoc.swagger-ui.filter=true
springdoc.swagger-ui.display-request-duration=true
springdoc.swagger-ui.enabled=true
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
    
    <!-- MySQL Database Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
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
    
    <!-- SpringDoc OpenAPI (Swagger) -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.2.0</version>
    </dependency>
</dependencies>
```

---

## Testing

### Swagger UI Testing (Recommended)

The easiest way to test the API is through Swagger UI:

1. Start the application
2. Navigate to `http://localhost:8080/swagger-ui.html`
3. Use the interactive interface to test all endpoints
4. Authenticate using the "Authorize" button after logging in

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

### Unit Testing

Create comprehensive unit tests for all services and controllers:

```java
@ExtendWith(MockitoExtension.class)
class RequisitionServiceTest {
    
    @Mock
    private RequisitionRepository requisitionRepository;
    
    @InjectMocks
    private RequisitionService requisitionService;
    
    @Test
    void testCreateRequisition() {
        // Test implementation
    }
}
```

### Integration Testing

Test the full API flow using `@SpringBootTest`:

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class RequisitionControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetAllRequisitions() throws Exception {
        mockMvc.perform(get("/api/requisitions")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
```

---

## Deployment

### Environment Configuration

Use Spring profiles for different environments:

**application-dev.properties:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/approval_management_dev?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=dev_password
springdoc.swagger-ui.enabled=true
logging.level.root=DEBUG
spring.jpa.show-sql=true
```

**application-prod.properties:**
```properties
spring.datasource.url=jdbc:mysql://prod-db:3306/approval_management?useSSL=true&serverTimezone=UTC
spring.datasource.username=prod_user
spring.datasource.password=${DB_PASSWORD}
springdoc.swagger-ui.enabled=false
logging.level.root=INFO
spring.jpa.show-sql=false
```

### Build and Run

**Maven:**
```bash
mvn clean package
java -jar target/approval-management-1.0.0.jar
```

**Gradle:**
```bash
./gradlew build
java -jar build/libs/approval-management-1.0.0.jar
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/approval-management-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:
```bash
docker build -t approval-management .
docker run -p 8080:8080 approval-management
```

### Production Checklist

- [ ] Disable Swagger UI in production (`springdoc.swagger-ui.enabled=false`)
- [ ] Use strong JWT secret key (environment variable)
- [ ] Configure proper CORS for production domain
- [ ] Set up HTTPS/TLS certificates
- [ ] Configure database connection pooling
- [ ] Enable database connection encryption
- [ ] Set up proper logging (file rotation, log aggregation)
- [ ] Configure health check endpoints
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy for database
- [ ] Use environment variables for sensitive configuration
- [ ] Enable rate limiting on authentication endpoints

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

---

## Quick Start Guide

### 1. Prerequisites

- **Java**: 17 or higher (verify with `java -version`)
- **Maven**: 3.6+ (verify with `mvn -version`) or Gradle 7+
- **MySQL**: 8.0 or higher (verify with `mysql --version`)
- **IDE**: IntelliJ IDEA (recommended), Eclipse, or VS Code
- **MySQL Workbench** (optional but recommended for database management)

### 2. MySQL Setup

1. **Install MySQL 8.0+**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - During installation, note the root password you set

2. **Start MySQL Service**
   - Windows: MySQL service should start automatically, or use Services panel
   - Linux/Mac: `sudo systemctl start mysql` or `brew services start mysql`

3. **Create Database**
   ```bash
   mysql -u root -p
   ```
   Then in MySQL:
   ```sql
   CREATE DATABASE approval_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

### 3. Spring Boot Project Setup

1. **Create New Spring Boot Project**
   - Use Spring Initializr: https://start.spring.io/
   - Select: Spring Boot 3.x, Java 17, Maven, JAR packaging
   - Dependencies: Spring Web, Spring Data JPA, Spring Security, MySQL Driver

2. **Add All Dependencies**
   - Copy dependencies from [Dependencies Section](#8-dependencies-pomxml)
   - Add to `pom.xml` and run `mvn clean install`

3. **Configure Application Properties**
   - Create/update `src/main/resources/application.properties`
   - Copy configuration from [Spring Boot Configuration](#7-spring-boot-configuration)
   - Update MySQL credentials:
     ```properties
     spring.datasource.username=root
     spring.datasource.password=your_mysql_password
     ```

4. **Create Package Structure**
   ```
   com.yourcompany.approvalmanagement
   ├── config
   ├── controller
   ├── dto
   ├── entity
   ├── repository
   ├── service
   ├── security
   └── ApprovalManagementApplication.java
   ```

### 4. Database Setup

**Option A: Auto-create with Hibernate (Recommended for Development)**
- Set `spring.jpa.hibernate.ddl-auto=update` in `application.properties`
- Tables will be created automatically on first run

**Option B: Manual Creation (Recommended for Production)**
- Run SQL scripts from [Database Schema](#database-schema) section
- Set `spring.jpa.hibernate.ddl-auto=validate` in `application.properties`

### 5. Implementation Steps

1. **Create Entities** (User, Requisition, ApprovalAction, FileAttachment)
   - Based on [Database Schema](#database-schema)
   - Use JPA annotations: `@Entity`, `@Table`, `@Id`, `@Column`, etc.

2. **Create Repositories**
   - Extend `JpaRepository<Entity, ID>`
   - Add custom query methods as needed

3. **Create DTOs** (Data Transfer Objects)
   - Request DTOs for API inputs
   - Response DTOs for API outputs
   - Use validation annotations: `@NotNull`, `@Email`, `@Size`, etc.

4. **Create Services**
   - Business logic implementation
   - Use `@Service` annotation
   - Inject repositories with `@Autowired`

5. **Create Controllers**
   - REST endpoints
   - Use `@RestController` and `@RequestMapping`
   - Add Swagger annotations from [Swagger Examples](#controller-annotation-examples)
   - Inject services with `@Autowired`

6. **Configure Security**
   - JWT authentication setup
   - Security filter chain configuration
   - Password encoder (BCrypt)

7. **Configure Swagger**
   - Create `OpenAPIConfig` class
   - Add configuration from [Swagger Configuration](#swaggeropenapi-documentation)

### 6. Run and Test

1. **Start the Application**
   ```bash
   mvn spring-boot:run
   ```
   Or run from IDE: Right-click `Application.java` → Run

2. **Verify Database Connection**
   - Check console logs for successful connection
   - Verify tables are created (if using auto-create)

3. **Access Swagger UI**
   - Navigate to: `http://localhost:8080/swagger-ui.html`
   - Verify all endpoints are listed

4. **Test Authentication**
   - Use Swagger UI to test `/api/auth/login`
   - Create a test user first (or use SQL insert)

5. **Test Protected Endpoints**
   - Click "Authorize" button in Swagger UI
   - Enter JWT token from login response
   - Test other endpoints

### 7. Verify Integration

1. **Check API Response Formats**
   - Ensure responses match [Data Models](#data-models) section
   - Verify date formats are ISO 8601

2. **Test Error Handling**
   - Test with invalid credentials
   - Test with missing required fields
   - Verify error response format matches [Error Handling](#error-handling)

3. **Database Verification**
   ```sql
   USE approval_management;
   SHOW TABLES;
   DESCRIBE users;
   DESCRIBE requisitions;
   ```

### 3. Initial Data Setup

**Insert Test Users** (Optional - for testing):
```sql
USE approval_management;

INSERT INTO users (id, name, email, password, active) VALUES
('1', 'John Doe', 'john@example.com', '$2a$10$encrypted_password_hash', true),
('2', 'Jane Smith', 'jane@example.com', '$2a$10$encrypted_password_hash', true),
('3', 'Bob Johnson', 'bob@example.com', '$2a$10$encrypted_password_hash', true);
```

**Note**: Replace `$2a$10$encrypted_password_hash` with actual BCrypt hashed passwords.

To hash passwords in Java:
```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashedPassword = encoder.encode("password123");
System.out.println(hashedPassword);
```

### 4. Frontend Integration

The frontend expects:
- **Base URL**: `http://localhost:8080/api`
- **JWT Token**: In `Authorization: Bearer {token}` header
- **Content-Type**: `application/json` for requests
- **Response Format**: JSON with ISO 8601 date format for timestamps

**When backend is ready, update frontend:**
1. Open `src/app/core/interceptors/auth.interceptor.ts`
2. Verify base URL configuration
3. Test login endpoint
4. Verify token is stored and sent in headers
5. Test protected endpoints

### 5. Common Issues and Solutions

**Issue: Cannot connect to MySQL**
- Verify MySQL service is running
- Check username/password in `application.properties`
- Verify database exists: `SHOW DATABASES;`
- Check MySQL port (default: 3306)

**Issue: Table creation errors**
- Ensure `utf8mb4` character set is supported
- Check MySQL version (requires 8.0+)
- Verify foreign key constraints are correct

**Issue: JWT token not working**
- Verify JWT secret key is set in `application.properties`
- Check token expiration time
- Verify token is sent in `Authorization: Bearer {token}` format

**Issue: CORS errors from frontend**
- Verify CORS configuration in `SecurityConfig`
- Check allowed origins matches frontend URL (http://localhost:4200)
- Ensure CORS is configured before authentication

---

**Version**: 2.0.0  
**Last Updated**: January 2024  
**Documentation**: Complete with Swagger/OpenAPI integration

