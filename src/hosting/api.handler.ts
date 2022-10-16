import { romanConvertionHandler } from "../api/roman-convertion-service";
import { HttpHandler } from "./model";
import url from 'url';

export const handleApiCall: HttpHandler = async (request,response) => {

    if(request.method === "GET" &&  request.url?.match("/api/convert")){
        const handlerResult = romanConvertionHandler(url.parse(request.url!,true));
        response.writeHead(handlerResult.status);
        response.write(handlerResult.body);
        response.end();
        return true;
     }
     return false;  
}