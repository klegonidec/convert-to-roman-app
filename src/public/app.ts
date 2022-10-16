
function debounce(func:Function, timeout = 300){
    let timer: any;
    return (...args:any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(undefined, args); }, timeout);
    };
  }


  class ServerSideEventHandler{

    private _eventSource ?: EventSource;
    constructor(private url: string, private resultHandler: (result: MessageEvent)=> void){}

    public ensureIsInit(){
        // Do nothing if already init
        if(this._eventSource) return;

        this._eventSource = new EventSource(this.url);
        this._eventSource.onmessage = this.resultHandler;
    };
   }



document.addEventListener("DOMContentLoaded", function() {
    const resultElement = document.querySelector("#result");
    const errorElement = document.querySelector("#errors");
    const integerInputElement = document.querySelector("#integer") as HTMLInputElement;
    
    if(!resultElement || !errorElement || !integerInputElement) return;

    // Given the load of the application, this is a good enough identifier.
    // TODO. Use instead a GUID for instance
    const uniqueId = new Date().toISOString();

    const event = new ServerSideEventHandler(
                    `/api/subscribe?clientId=${uniqueId}`,
                    (event: MessageEvent) => {
                        const result = JSON.parse(event.data)
                        if(result.status === 200)
                            setResult(result.body);
                        else
                            setError(result.body);
                    });

    integerInputElement.addEventListener("focus", event.ensureIsInit.bind(event));

    integerInputElement.addEventListener("input", debounce(async (evt: Event) => {
        event.ensureIsInit();
        let response = await fetch(`/api/async-convert?clientId=${uniqueId}&integer=${integerInputElement.valueAsNumber}`,{method: "POST"});
        if(response.status != 200) {
            //TODO We might want implement EventSource refresh mechanism here
            setError(await response.text());
        }
    }));

    function setResult(result: string){
        errorElement?.setAttribute("style","display:none");
        if(resultElement)
            resultElement.innerHTML = result;
    }
    
    function setError(error: string){
        if(errorElement)
            errorElement.innerHTML = error;
        if(resultElement)
            resultElement.innerHTML = "";

        errorElement?.setAttribute("style","display:block");
    }
});
