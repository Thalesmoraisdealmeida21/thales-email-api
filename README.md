# Email API

REST API for sending emails via SMTP. Exposes a `POST /send-email` endpoint that accepts recipient, subject, and body, validates with Zod, and sends using Nodemailer.

---

## Purpose

Enable programmatic email sending (contact forms, notifications, automations) through an HTTP API. Useful for integrating email delivery into other systems without configuring SMTP in each one.

---

## Prerequisites

- **Node.js** 20+ and **Yarn** (to run locally), or  
- **Docker** and **Docker Compose** (to run in containers)

---

## Configuration

### Environment variables

| Variable     | Required | Description                          | Default           |
|--------------|----------|--------------------------------------|-------------------|
| `EMAIL_USER`| Yes      | SMTP server username                 | —                 |
| `EMAIL_PASS`| Yes      | SMTP server password                 | —                 |
| `SMTP_HOST` | Yes       | SMTP server host                     | `smtp.umbler.com` |
| `SMTP_PORT` | Yes       | SMTP port                            | `587`             |
| `SMTP_SECURE`| Yes      | Use SSL/TLS (`true` or `false`)      | `false`           |
| `PORT`      | No       | HTTP server port                     | `3000`            |
| `RATE_LIMIT_MAX` | No   | Max requests per window for `/send-email` | `10`        |
| `RATE_LIMIT_WINDOW_MS` | No | Rate-limit window in ms           | `60000` (1 min)   |

### Using `.env-example`

1. Copy the example file:

   ```bash
   cp .env-example .env
   ```

2. Edit `.env` and set `EMAIL_USER`, `EMAIL_PASS`, and, if needed, `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE` according to your email provider.

Do not commit `.env` (it is in `.gitignore`).

---

## How to run

### 1. With Docker Compose (development)

Uses `Dockerfile.dev` and `yarn dev` (nodemon). The `./src` folder is mounted as a volume; changes in `src/` restart the process in the container.

```bash
docker-compose up --build
```

The service runs on port **3000**. To stop: `docker-compose down`.

To use `.env` variables in Compose, add `env_file: .env` to the service or set `environment` in `docker-compose.yml`.

### 2. Local (Node + Yarn)

```bash
yarn install
cp .env-example .env   # edit .env with your credentials
yarn dev
```

`yarn dev` uses nodemon and tsx; the server restarts when files in `src/` change.

### 3. Production (build + Node)

```bash
yarn install
yarn build
yarn start
```

Or with Docker (production image):

```bash
docker build -t email-api .
docker run -p 3000:3000 \
  -e EMAIL_USER=your@email.com \
  -e EMAIL_PASS=yourpassword \
  -e SMTP_HOST=smtp.umbler.com \
  -e SMTP_PORT=587 \
  -e SMTP_SECURE=false \
  email-api
```

---

## API usage

**Endpoint:** `POST /send-email`

**Headers:** `Content-Type: application/json`

**Body (JSON):**

| Field    | Type   | Required | Description      |
|----------|--------|----------|------------------|
| `to`     | string | Yes      | Recipient email  |
| `subject`| string | Yes      | Subject          |
| `text`   | string | Yes      | Email body       |

**cURL example:**

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Email subject",
    "text": "Email body content."
  }'
```

**Responses:**

- **200** – `{ "success": true }` — email sent.
- **400** — Validation error (Zod) when `to`, `subject`, or `text` are invalid.
- **429** – `{ "success": false, "error": "Too many requests, please try again later." }` — rate limit exceeded.
- **500** – `{ "success": false, "error": "Failed to send email" }` — send failed.

---

## Project structure

```
email-api/
├── src/
│   ├── server.ts       # Express, routes, and validation (Zod)
│   └── emailSender.ts  # Nodemailer and SMTP sending
├── .env-example        # Example env file; copy to .env
├── .dockerignore
├── .gitignore
├── Dockerfile          # Production image (build + node dist)
├── Dockerfile.dev      # Development image (yarn dev)
├── docker-compose.yml  # app-email-sender service with volumes and env
├── package.json
├── tsconfig.json
└── yarn.lock
```

SMTP is configured in `emailSender.ts` via environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `EMAIL_USER`, `EMAIL_PASS`). The `from` address is hardcoded; to make it configurable, use a variable (e.g. `EMAIL_FROM`).
