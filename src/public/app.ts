function debounce(func:Function, timeout = 300){
    let timer: any;
    return (...args:any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(undefined, args); }, timeout);
    };
  }




document.addEventListener("DOMContentLoaded", function() {
    const resultElement = document.querySelector("#result");
    const errorElement = document.querySelector("#errors");
    const integerInputElement = document.querySelector("#integer") as HTMLInputElement;
    if(!resultElement || !errorElement || !integerInputElement) return;

    integerInputElement.addEventListener("input", debounce(async (evt: Event) => {
        let response = await fetch("/api/convert?integer="+integerInputElement.valueAsNumber);
        if(response.status === 200){
            errorElement.setAttribute("style","display:none");
            resultElement.innerHTML = await response.text();
        }
        else{
            evt.preventDefault();
            errorElement.innerHTML = await response.text();
            resultElement.innerHTML = "";
            errorElement.setAttribute("style","display:block");
        }
    }))
});
