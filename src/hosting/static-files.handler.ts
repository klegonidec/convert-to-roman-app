import fs from 'fs/promises';
import { resolve } from "path";
import http from "http";
import url from "url";
import { HttpHandler } from './model';


interface FileInfo {
    physicalPath: string,
    contentType: `text/${"javascript"|"html"|"css"}`
    filePromise?: Promise<Buffer>
}

const exposedFiles: {[k:string] : FileInfo} = {
    "/" :  {physicalPath: "../public/index.html", contentType: 'text/html'},
    "/app.js": {physicalPath: "../public/app.js", contentType: 'text/javascript'},
    "/styles.css": {physicalPath: "../public/styles.css", contentType: 'text/css'},
}

for(const fileName in exposedFiles){
    const fileInfo = exposedFiles[fileName as (keyof typeof exposedFiles)];
    fileInfo.filePromise = fs.readFile(resolve(__dirname,fileInfo.physicalPath));
}

async function ResponseWithGivenFile(f: FileInfo,  response : http.ServerResponse){
    response.writeHead(200,undefined,{ 'Content-Type': f.contentType});
    response.write(await f.filePromise);
    response.end();

    return true;
}

export const handleStaticFiles : HttpHandler = async (request: http.IncomingMessage, response : http.ServerResponse) => {
    if(!request.url || request.method !== "GET") return false;

    const parsedUrl = url.parse(request.url);
    // Handle default page returns
    if(!parsedUrl.path || !exposedFiles[parsedUrl.path])
        return ResponseWithGivenFile(exposedFiles["/"],response);

    return ResponseWithGivenFile(exposedFiles[parsedUrl.path],response);
}
