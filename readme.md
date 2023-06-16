# Nutripal Backend

### API Documentation
<a href="https://github.com/Nutripal-Capstone/nutripal-backend/blob/main/api-docs.md" target="_blank">API Docs</a>


### Quick Start

**Install dependencies:**

```console
$ npm install
```

**Fill the .env (see .env.example)**

```
# Server
# Misc
PORT=
JWT_SECRET=

# Database
DB_PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# Firebase
FIREBASE_TYPE=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
FIREBASE_UNIVERSE_DOMAIN=

# Fatsecret
FATSECRET_CLIENT_ID=
FATSECRET_CLIENT_SECRET=
```

**Migrate the database:**

```console
$ npx prisma migrate deploy
```

**Seed the database:**
```console
$ npx prisma db seed
```

**Run the server:**
```console
$ npm run dev
```
