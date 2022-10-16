import { HttpHandler } from "../model";
import url from 'url';
import { convertEventService, EventServiceErrors } from "./convert-event.service";
import { romanConvertionHandler } from "../../api/roman-convertion-service";
import { ParsedUrlQuery } from "querystring";
import { ServerResponse } from "http";

function retrieveIdentifierFromQueryString(query : ParsedUrlQuery) : string | false {
    const {clientId} = query;

    return clientId && typeof clientId === "string"
            ? clientId
            : false;
}


function invalidClientIdResult(response: ServerResponse){
    response.writeHead(400, undefined, { 'Content-Type': "text/text"});
    response.write("Provide a valid clientId");
    response.end();
    return true;
}

function notificationIssueResult(notifyErrorResult:EventServiceErrors, response: ServerResponse){
    response.writeHead(400, undefined, { 'Content-Type': "text/text"});
    switch(notifyErrorResult){
        case EventServiceErrors.ConnectionNotFound:
            response.write("Provide a valid clientId");
        case EventServiceErrors.IssueWhenNotifying:
            response.write("Impossible to notify. Please try again in a short time, or reload your page");
    }
    response.end();
 return true;
}

function successResult(response: ServerResponse){
    response.writeHead(200);
    response.end();
    return true;
}

export const handleEventPushCall: HttpHandler = async (request,response) => {
    if(request.method === "POST" &&  request.url?.match("/api/async-convert")){
        const parsedUrl = url.parse(request.url!,true);
        const clientId = retrieveIdentifierFromQueryString(parsedUrl.query);
        if(!clientId) {
           return invalidClientIdResult(response);
        }
        const handlerResult = romanConvertionHandler(url.parse(request.url!,true));
        const notifyResult = convertEventService.notifyClient(clientId,handlerResult);
        if(!notifyResult){
           return notificationIssueResult(notifyResult,response);
        }
        else {
           return successResult(response);
        }   
    }
    if(request.method === "GET" &&  request.url?.match("/api/subscribe")){
        const parsedUrl = url.parse(request.url!,true);
        const clientId = retrieveIdentifierFromQueryString(parsedUrl.query);
        if(!clientId) {
           return invalidClientIdResult(response);
        }

        convertEventService.addClient(clientId,request,response);
        return true;
    }
     return false;

}
