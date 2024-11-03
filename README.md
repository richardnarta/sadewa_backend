
## Installation

If you don't have [NodeJS](https://nodejs.org/en/download/package-manager), [Redis](https://redis.io/), [PostgreSQL](https://www.postgresql.org/) installed, install those first.

If you don't have [Brevo](https://www.brevo.com/) service account for email messaging, and [Firebase](https://firebase.google.com) service account for realtime database and cloud messaging, register first.

---

Clone the repository

```bash
  git clone https://github.com/richardnarta/sadewa_backend
```

Navigate to the directory

```bash
  cd sadewa_backend
```

Install dependencies

```bash
  npm install
```

    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### server configuration

`HOST`=localhost

`PORT`=5000

### database configuration

`PG_USER`=your_username

`PG_PASSWORD`=your_password

`PG_DATABASE`=your_database

`PG_HOST`=localhost

`PG_PORT`=5432

### brevo configuration

`BREVO_API_KEY`=your_API_key

`BREVO_SENDER_EMAIL`=your_registered_email

### redis configuration

`REDIS_HOST`=localhost

`REDIS_PORT`=6379

### auth configuration

`AUTH_SECRET_KEY`=your_secret_key

`AUTH_ALGORITHM`=your_authentication_algorithm

`AUTH_SALT`=5

`AUTH_EXPIRATION_SECONDS`=2629800

### firebase configuration

`FIREBASE_SERVICE_PATH`=path_to_your_firebase_service_account_file

`REALTIME_DB_URL`=your_firebase_realtime_database_url


## Start Database Migration

To start database migration, run the following command

```bash
  npm run migrate
```


## Running Server

To run the backend service, run the following command

```bash
  npm run start-dev
```

To run the redis service, run the following command

```bash
  redis-server --port 6379
```


## Root User

`username`="admin"

`password`="Test12345!"


## API Documentation

[Documentation](https://docs.google.com/spreadsheets/d/1utMbEjBV4yvi6SznqQXrRF3L5p6jMc0gkrOxfiaUscI/edit?usp=sharing)

