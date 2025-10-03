import { exec } from"child_process";
import os from "os";

const commands = [
  { name: "Backend", cmd: "npm run backend:dev" },
  { name: "Frontend", cmd: "npm run frontend:dev" },
  { name: "Worker Synthetic", cmd: "npm run worker:synthetic" },
  { name: "Worker SSL", cmd: "npm run worker:ssl" },
];

const platform = os.platform();

commands.forEach(({ name, cmd }) => {
  if (platform === "win32") {
    // Windows
    exec(`start cmd /k "${cmd}"`);
  } else if (platform === "darwin") {
    // macOS
    exec(`osascript -e 'tell application "Terminal" to do script "${cmd}"'`);
  } else {
    // Linux (GNOME Terminal / most common)
    exec(`gnome-terminal -- bash -c '${cmd}; exec bash'`);
  }
  console.log(`Started ${name}`);
});
