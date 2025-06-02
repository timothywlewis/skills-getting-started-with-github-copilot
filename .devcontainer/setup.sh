#!/bin/bash

# Install Python requirements
pip install -r requirements.txt

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Create MongoDB directories and set permissions
sudo mkdir -p /data/db /var/log/mongodb # /var/lib/mongodb
sudo chown -R mongodb:mongodb /data/db /var/log/mongodb # /var/lib/mongodb

# Start MongoDB
sudo mongod --fork --logpath /var/log/mongodb/mongod.log
