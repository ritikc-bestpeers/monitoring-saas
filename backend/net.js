// port monitoring

import net from "net";

async function checkTCP(host, port, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.on("connect", () => {
      socket.destroy();
      resolve({ status: "up" });
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("Connection timed out"));
    });

    socket.on("error", (err) => {
      reject(err);
    });

    socket.connect(port, host);
  });
}



(async() => {
    let res = await checkTCP("docfliq.com", 53)

    console.log(res)
})()
