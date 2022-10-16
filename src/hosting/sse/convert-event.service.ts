import http from "http";
import url from "url";

export enum EventServiceErrors {
    ConnectionNotFound,
    IssueWhenNotifying,
}

/** Handle Server Side Event mandatory state mechanism
 */
class ConvertEventService{

    private _clientLists = new Map<string, http.ServerResponse>();

    public addClient(identifier: string, clientRequest: http.IncomingMessage, clientResponse: http.ServerResponse ) {
        // This case might appears when browser lost connection and try to reconnect
        // When this happens, it is necessary to reattach the new response object and clean this old one
        if(this._clientLists.has(identifier)){
            this.endConnection(identifier);
        }

        this._clientLists.set(identifier,clientResponse);
        this.initConnection(identifier,clientRequest,clientResponse);
    }

    private initConnection(identifier: string, clientRequest: http.IncomingMessage, clientResponse: http.ServerResponse ){
        clientRequest.on("close",() => this.endConnection(identifier));

        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
          };

        clientResponse.writeHead(200, headers);

    }

    private endConnection(identifier: string){
        this._clientLists.get(identifier)?.end();
        this._clientLists.delete(identifier);
    }

    /**
     * 
     * @param identifier 
     * @param content 
     * @returns An Error if notification is impossible, true if 
     */
    public notifyClient<T>(identifier: string,content: T): EventServiceErrors | true{
        if(! this._clientLists.has(identifier)) return EventServiceErrors.ConnectionNotFound;
        try {
            this._clientLists.get(identifier)!.write(this.formatServerSideEvent(content));
            return true;
        }
        catch {
            //TODO We might want to implement a retry or cleanup mechanism here
            return EventServiceErrors.IssueWhenNotifying;
        }


    }

    /** Format a given input to expected format for Server Side Event
     * cf. https://developer.mozilla.org/fr/docs/Web/API/Server-sent_events/Using_server-sent_events#format_du_flux_d%C3%A9v%C3%A8nements
     * @param message 
     * @returns 
     */
    private formatServerSideEvent<T>(message: T) {
        return `data: ${JSON.stringify(message)}\n\n`
    }


}

export const convertEventService = new ConvertEventService();
