🧠 NiveshSathi – Backend

NiveshSathi backend powers authentication, secure APIs, AI recommendation orchestration, and integration with the ML service.
It acts as the core engine connecting the frontend, database, and ML model.

✨ Key Responsibilities

    🔐 User Authentication (JWT-based)
    👤 User Management (Signup / Login)
    🤖 AI Recommendation API
    🔗 ML Service Integration (FastAPI)
    🛡️ Secure API access using Spring Security
    🌐 CORS-enabled for production frontend

🛠️ Tech Stack

    Framework: Spring Boot
    Language: Java
    Security: Spring Security + JWT
    Database: PostgreSQL
    ORM: Hibernate / JPA
    ML Integration: REST (FastAPI service)
    Deployment: Render

📂 Project Structure

    src/main/java/com/hackathon/NiveshSathi
    ├── config/
    │   ├── SecurityConfig.java
    │
    ├── controller/
    │   ├── AuthController.java
    │   ├── AIRecommendationController.java
    │
    ├── service/
    │   ├── AuthService.java
    │   ├── MlService.java
    │
    ├── dto/
    ├── entity/
    └── repository/

🔑 Environment Variables

    Set the following environment variables in your deployment environment:
  
    SPRING_DATASOURCE_URL=your_database_url
    SPRING_DATASOURCE_USERNAME=your_db_username
    SPRING_DATASOURCE_PASSWORD=your_db_password
    JWT_SECRET=your_jwt_secret
    ML_SERVICE_URL=https://your-ml-service-url

🔐 Authentication Flow

    User signs up or logs in
    Backend issues a plain JWT token
    Token is sent by frontend in headers:
    Authorization: Bearer <token>


    Secured APIs validate the token

    🤖 AI Recommendation Flow
    Frontend
       ↓
    Backend (/api/ai/recommend)
       ↓
    ML Service (FastAPI)
       ↓
    Processed Recommendation
       ↓
    Frontend

🌍 Live Backend API

    Backend is deployed and live:
    👉 https://nivesh-sathi-backend.onrender.com
    The backend is configured to accept requests from the deployed frontend.
