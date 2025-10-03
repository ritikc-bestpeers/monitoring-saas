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
├── backend/ # Express
├── monitoring-frontend/ # React/Tailwind dashboard
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

### 2. Install Dependencies in root folder


```bash
npm install && npm run deps:install
```



### 3. Configure Environment

```bash
npm run env:create
```

### 4. Start/Stop Redis Container


```bash
# Start Redis Container
npm run start:redis

# Stop Redis Container
npm run stop:redis
```

### 5. Start Applications

```bash
# It will start all the applications in terminals

# development/local
npm run start:all:dev 
```

## Usage

- Open http://localhost:3000
 (or your frontend port) for the dashboard.

- Add websites/APIs to start monitoring.

- Check logs and job status via the dashboard.

## Development Notes

- Jobs use removeOnComplete=false to persist job history.

- Monitoring retries are configurable (default: 5 retries).

- ElasticSearch can be integrated for log storage and analytics.


## Contribution

**Note** - Give a ⭐ to this project

- Fork this repository (Click the Fork button in the top right of this page, click your Profile Image)
- Clone your fork down to your local machine

```bash
git clone https://github.com/<your_username>/monitoring-saas.git
```

- Create a branch

```bash
git checkout -b branch-name
```

- Make your changes (choose from any task below)
- Commit and push

```bash
git add .
git commit -m 'Commit message'
git push origin branch-name
```

- Create a new pull request from your forked repository (Click the New Pull Request button located at the top of your repo)
- Wait for your PR review and merge approval!
- Star this repository if you had fun!

For more information, Please read [CONTRIBUTING.md](https://github.com/ritikc-bestpeers/monitoring-saas/blob/main/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.
