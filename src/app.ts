import { initServer } from "./hosting/server";

const server = initServer(3000);

process.on('SIGINT', function() {
   console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");
   server.close();
       console.log("Exiting...");
       process.exit();
});