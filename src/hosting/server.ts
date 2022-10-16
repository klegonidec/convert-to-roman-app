import http from "http";

import { handleStaticFiles } from "./static-files.handler";
import { handleApiCall } from "./api.handler";
import { handleEventPushCall } from "./sse/convert-event.handler";


export function initServer(port: number) {
   
   const server = http.createServer(async(req, res) =>  {
    
      // Define http pipeline : Treat Api calls in first, static files in lasts
      if(await handleApiCall(req,res)) return;
      if(await handleEventPushCall(req,res)) return;
      if(await handleStaticFiles(req,res)) return;
   });

   server.listen(port, () => {
      console.log(`Server is running on port ${port}. Go to http://localhost:${port}/`)
   });
   
   return server;
}
