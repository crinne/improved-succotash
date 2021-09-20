import { Server } from "http";
import { app } from "./app";

let server: Server;
const port = 3000;

function handleShutdownGracefully() {
  console.info("closing server gracefully...");
  server.close(() => {
    console.info("server closed.");
    // close db connections here or
    // any other clean if required
    // process.exit(0); // if required
  });
}

process.on("SIGHUP", handleShutdownGracefully); // posix kill command
process.on("SIGINT", handleShutdownGracefully); // crtl + c
process.on("SIGTERM", handleShutdownGracefully); // kill command from cli

const start = async () => {
  try {
    // await prerun()
  } catch (err) {
    console.error(err);
  }

  server = app.listen(port, () => {
    console.log(`Listening on port ${port}!!`);
  });
};

start();
