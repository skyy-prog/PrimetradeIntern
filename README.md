# Scalable Task Management Application

A full-stack task management web application consisting of a modular Express.js backend with MongoDB, and a modern React.js frontend styled with TailwindCSS. Features include secure JWT authentication, role-based access control, task CRUD APIs, Swagger documentation, and a dashboard interface.

---

## Project Structure

* `/backend` - Express.js REST API with Mongoose, Helmet security, morgan logging, and OpenAPI documentation.
* `/frontend` - Vite React client with TailwindCSS and Lucide icons.

---

## Getting Started

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** (running locally on port 27017 or a remote Atlas connection)

---

### 1. Backend Setup & Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configuration:
   Create or edit the `.env` file in `/backend` to match your database settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/primetrade
   JWT_SECRET=supersecretjwtkey12345!@#$%
   JWT_EXPIRE=24h
   NODE_ENV=development
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   * The backend will start at `http://localhost:5000`
   * API endpoints will be accessible under `/api/v1`

---

### 2. Frontend Setup & Run

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Configuration:
   Create or edit the `.env` file in `/frontend` (ensure Vite reads the backend API URL):
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   * The frontend will start at `http://localhost:5173` (or the next available port)

---

## API Documentation (Swagger)

A Swagger UI dashboard mapping out all request payloads, authorization constraints, and response schemas is built-in.

* **Swagger URL**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### Authentication Endpoints
* `POST /api/v1/auth/register` - Create new user/admin
* `POST /api/v1/auth/login` - Authenticate and return JWT token
* `GET /api/v1/auth/me` - Fetch profile (Protected)
* `GET /api/v1/auth/users` - List all system users (Admin only)

### Task CRUD Endpoints (Protected)
* `POST /api/v1/tasks` - Create a new task (Admins can assign to any user, Regular users assign to self)
* `GET /api/v1/tasks` - Fetch tasks list (Admins get all tasks, Regular users get their own tasks)
* `GET /api/v1/tasks/:id` - Fetch single task details
* `PUT /api/v1/tasks/:id` - Update task (Admins can modify all, Regular users can modify their own)
* `DELETE /api/v1/tasks/:id` - Delete task (Admins can delete all, Regular users can delete their own)

---

## Security Practices Implemented

1. **Password Hashing**: Bcryptjs with salt round of 10 inside pre-save mongoose hooks.
2. **Stateless JWT**: Secure token authorization verified on requests via modular middlewares.
3. **Role-Based Protection**: Dynamic router middleware (`authorize('admin')`) verifying privileges.
4. **Input Validation**: Schema-level validations handled by `express-validator` preventing invalid payload entries.
5. **Secure HTTP Headers**: Helmet module integration configured to avoid data leaks.
6. **Cross-Origin Resource Sharing**: CORS integration limiting endpoint accessibility.

---

## Scalability Note (Architecture Recommendation)

To handle production-scale traffic, the following enhancements are recommended:

### 1. Database Scaling
* **Read Replicas**: Configure MongoDB replica sets to offload read operations from the primary node.
* **Database Sharding**: Share data across multiple servers using a shard key (e.g., `createdBy` or `tenantId`) when DB size exceeds single node capacity.

### 2. Caching Layer
* **Redis Caching**: Cache resource lists (e.g., frequently queried tasks or user profiles) in Redis. Set a Time-to-Live (TTL) and invalidate the cache upon update/delete actions.

### 3. Load Balancing & Clustering
* **Node.js Clustering**: Use PM2 or Node's native cluster module to run multiple server instances utilizing all CPU cores.
* **Reverse Proxy**: Place an Nginx load balancer or AWS ALB in front of the API instances to distribute traffic.

### 4. Microservices Transition
* **Service Decomposition**: Split the Auth service and the Task management service into independent dockerized microservices.
* **Message Broker**: Introduce RabbitMQ or Apache Kafka to handle asynchronous tasks (e.g., email notifications, reporting exports) without blocking HTTP cycles.
