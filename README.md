# Monitoring SaaS Application

A full-stack monitoring SaaS application designed to track uptime, SSL certificates, and system health. The app provides real-time monitoring, job queue processing, and a dashboard to visualize metrics. Built with a modern stack for scalability and extensibility.

---

## Features

- **Uptime Monitoring** – Track availability of websites and APIs.  
- **SSL Monitoring** – Get alerts before SSL certificates expire.  
- **Job Queue** – Powered by BullMQ for reliable background processing.  
- **Custom Dashboard** – Visualize data with charts and tables.  
- **Notifications** – Configurable alerts via email, webhooks, or push.  
- **Multi-service Support** – Backend, frontend, and worker processes for modular scalability.  

---

## Tech Stack

- **Backend:** Node.js, Express, GraphQL, Redis, BullMQ  
- **Frontend:** React (Vite/Next.js), TailwindCSS  
- **Database:** MongoDB (Mongoose ORM)  
- **Worker:** BullMQ jobs for monitoring and background tasks  
- **Other:** Docker (optional), Helmet, CORS, Morgan  

---

## Project Structure

```bash
├── backend/ # Express + GraphQL API
├── frontend/ # React/Tailwind dashboard
├── worker/ # BullMQ job processing
├── .gitignore
└── README.md
```

## Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/monitoring-saas.git
cd monitoring-saas
```

### 2. Install Dependencies

Each service has its own dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../worker && npm install
```

### 3. Configure Environment

Create a .env file inside backend/ with the following variables:

```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/monitoring
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
```

Other services (worker/frontend) can share REDIS_URL and API URLs.

### 4. Run Services

In separate terminals:

**Redis Container**

```bash
docker run -d \
  --name monitoring-redis \
  -p 6379:6379 \
  redis:7
```

**Backend**

```bash
cd backend && npm run dev
```

**Worker**
```bash
cd worker && npm run dev
```

**Frontend**

```bash
cd frontend && npm run dev
```

## Usage

- Open http://localhost:5173
 (or your frontend port) for the dashboard.

- Add websites/APIs to start monitoring.

- Check logs and job status via the dashboard.

## Development Notes

- Jobs use removeOnComplete=false to persist job history.

- Monitoring retries are configurable (default: 5 retries).

- ElasticSearch can be integrated for log storage and analytics.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

