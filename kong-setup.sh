#!/bin/bash

# Register Services
echo "Registering services..."
curl -i -X POST http://localhost:8001/services \
  --data name=product-service \
  --data url=http://product-service:3000

curl -i -X POST http://localhost:8001/services \
  --data name=inventory-service \
  --data url=http://inventory-service:5000

curl -i -X POST http://localhost:8001/services \
  --data name=cart-service \
  --data url=http://cart-service:8080

curl -i -X POST http://localhost:8001/services \
  --data name=user-service \
  --data url=http://user-service:3000

# Create Routes
echo "Creating routes..."
curl -i -X POST http://localhost:8001/services/product-service/routes \
  --data 'paths[]=/api/products' \
  --data name=product-route

curl -i -X POST http://localhost:8001/services/inventory-service/routes \
  --data 'paths[]=/api/inventory' \
  --data name=inventory-route

curl -i -X POST http://localhost:8001/services/cart-service/routes \
  --data 'paths[]=/api/cart' \
  --data name=cart-route

curl -i -X POST http://localhost:8001/services/user-service/routes \
  --data 'paths[]=/api/users' \
  --data name=user-route

curl -i -X POST http://localhost:8001/services/user-service/routes \
  --data 'paths[]=/api/auth' \
  --data name=auth-route

# Configure Plugins
echo "Configuring plugins..."
curl -i -X POST http://localhost:8001/plugins \
  --data name=rate-limiting \
  --data config.minute=100 \
  --data config.policy=local

curl -i -X POST http://localhost:8001/plugins \
  --data name=cors \
  --data config.origins=* \
  --data config.methods=GET,POST,PUT,DELETE \
  --data config.headers=Content-Type,Authorization \
  --data config.exposed_headers=X-Auth-Token \
  --data config.credentials=true \
  --data config.max_age=3600

curl -i -X POST http://localhost:8001/plugins \
  --data name=jwt \
  --data config.claims_to_verify=exp \
  --data config.key_claim_name=kid \
  --data "config.uri_param_names=jwt"

curl -i -X POST http://localhost:8001/routes/auth-route/plugins \
  --data name=request-termination \
  --data config.status_code=200 \
  --data config.message="OK" \
  --data config.content_type="application/json"

echo "Kong setup completed!"