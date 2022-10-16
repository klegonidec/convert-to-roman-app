import { romanConvertionHandler } from "../api/roman-convertion-service";
import { HttpHandler } from "./model";
import url from 'url';

export const handleApiCall: HttpHandler = async (request,response) => {

    // We might want remove this file if we do not need retrocompatibility
    if(request.method === "GET" &&  request.url?.match("/api/convert")){
        const handlerResult = romanConvertionHandler(url.parse(request.url!,true));
        response.writeHead(handlerResult.status,undefined, { 'Content-Type': "text/text"});
        response.write(handlerResult.body);
        response.end();
        return true;
     }

     return false;  
}