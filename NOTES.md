# Notes

## Running the App

```
# Run the app
uvicorn src.app:app --reload
# or
python3 -m uvicorn src.app:app --reload
```

Open your browser to http://localhost:8000/static/index.html to view the web app.

## MongoDB

```
# Verify mongo db is running
mongosh --eval "db.getMongo().getDBs()"
```

Connection String for browsing using the MongoDB VS Code Extension:

    mongodb://localhost:27017


## Dev Container Configuration

### Initial setup of the container

```
# install dependencies
pip install -r requirements.txt
```

```
# install local mongo database
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update && sudo apt-get install -y mongodb-org
sudo mkdir -p /var/log/mongodb /var/lib/mongodb && sudo chown -R mongodb:mongodb /var/log/mongodb /var/lib/mongodb
sudo mkdir -p /data/db && sudo chown -R mongodb:mongodb /data/db
```

### Runs every time the container is rehydrated

```
# Launch the local mongo database
sudo mongod --fork --logpath /var/log/mongodb/mongod.log
```
