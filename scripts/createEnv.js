import fs from "fs";
import webpush from "web-push";

const vapidKeys = webpush.generateVAPIDKeys();

const backendEnvContent = `
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/monitoring
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret

VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
`;

// Frontend env (only safe public vars)
const frontendEnvContent = `
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
`;

// Ensure folders exist
if (!fs.existsSync("./backend")) fs.mkdirSync("./backend");
if (!fs.existsSync("./monitoring-frontend")) fs.mkdirSync("./monitoring-frontend");

// Write files
fs.writeFileSync("./backend/.env", backendEnvContent.trim() + "\n");
fs.writeFileSync("./monitoring-frontend/.env.local", frontendEnvContent.trim() + "\n"); 

console.log("✅ .env files created in backend/.env and frontend/.env.local");
