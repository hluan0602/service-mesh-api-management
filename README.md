# Microservices API Gateway with Kong

## Overview
This project sets up a microservices architecture using Kong API Gateway. It includes multiple services such as product management, user authentication, databases, and monitoring tools.

## Prerequisites
Ensure you have the following installed:
- Docker
- Docker Compose

## Services
### 1. Kong API Gateway
- **kong-database**: PostgreSQL database for Kong
- **kong-migration**: Runs Kong migrations
- **kong**: Kong API Gateway

### 2. Microservices
- **product-service**: Manages product information, connects to MongoDB
- **user-service**: Handles user authentication and management, connects to PostgreSQL
- *(Optional)* inventory-service, cart-service

### 3. Databases
- **mongo**: MongoDB for product data
- **postgres**: PostgreSQL for user data
- **redis**: Caching for cart-service

### 4. Monitoring
- **prometheus**: Metrics collection
- **grafana**: Data visualization

## Installation & Usage
1. Clone the repository:
   ```sh
   git clone <repo_url>
   cd <project_folder>
   ```
2. Start services using Docker Compose:
   ```sh
   docker-compose up -d
   ```
3. Access the following services:
   - **Kong Admin API**: http://localhost:8001
   - **Kong Admin GUI**: http://localhost:8002
   - **Product Service**: http://localhost:3001
   - **User Service**: http://localhost:3004
   - **Grafana Dashboard**: http://localhost:3000
   - **Prometheus Metrics**: http://localhost:9090

## Configuration
Modify `.env` files for each microservice to configure database connections and secrets.

## Stopping Services
To stop all running containers:
```sh
docker-compose down
```

## License
This project is licensed under the MIT License.

