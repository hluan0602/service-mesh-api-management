#!/bin/bash

# Create consumer and JWT credentials
echo "Creating consumer and JWT credentials..."
curl -i -X POST http://localhost:8001/consumers \
  --data username=ecommerce-frontend

curl -i -X POST http://localhost:8001/consumers/ecommerce-frontend/jwt \
  --data algorithm=HS256 \
  --data secret=your_jwt_secret_key

# Configure rate limiting
echo "Configuring rate limiting..."
curl -i -X POST http://localhost:8001/routes/product-route/plugins \
  --data name=rate-limiting \
  --data config.minute=200 \
  --data config.policy=local

curl -i -X POST http://localhost:8001/routes/auth-route/plugins \
  --data name=rate-limiting \
  --data config.minute=20 \
  --data config.policy=local

# Configure IP restriction
echo "Configuring IP restriction..."
curl -i -X POST http://localhost:8001/plugins \
  --data name=ip-restriction \
  --data config.whitelist=127.0.0.1,192.168.1.1 \
  --data config.applyToAdminApi=true

# Configure request transformation
echo "Configuring request transformation..."
curl -i -X POST http://localhost:8001/plugins \
  --data name=request-transformer \
  --data config.remove.headers=X-Forwarded-For,X-Real-IP

# Configure response transformation
echo "Configuring response transformation..."
curl -i -X POST http://localhost:8001/plugins \
  --data name=response-transformer \
  --data config.add.headers=Strict-Transport-Security:max-age=31536000,X-Content-Type-Options:nosniff,X-XSS-Protection:1;mode=block

# Generate SSL certificate
echo "Generating SSL certificate..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -subj "/CN=localhost"

# Upload certificate to Kong
echo "Uploading certificate to Kong..."
curl -i -X POST http://localhost:8001/certificates \
  --form cert=@server.crt \
  --form key=@server.key \
  --form snis=localhost

echo "Security configuration completed!"