import url from 'url'
import { InvalidEntry, toRoman } from '../number-roman-converter';

/**
 * Mapping from technical errors to User Friendly Messages
 * Could be loaded from external resource, handling multiple localization
 */
const errorMessageMapping : Map<InvalidEntry, string> = new Map<InvalidEntry,string>();
errorMessageMapping.set(InvalidEntry.MustBeInteger, "Please provide a valid integer");
errorMessageMapping.set(InvalidEntry.MustBeBetween1And99, "Please provide a integer within 1 and 99");

type HandlerResult = {status:200|400, body:string };

function invalidResponse(entry: InvalidEntry): HandlerResult{
    return {
        status: 400,
        body: errorMessageMapping.get(entry)!
    };
}

function successResponse(result: string): HandlerResult {
    return {
        status: 200,
        body: result
    }
}


export function romanConvertionHandler(url: url.UrlWithParsedQuery) : HandlerResult
{
    const {integer} = url.query;
    if(!integer || typeof integer !== "string" || !Number.isInteger(parseFloat(integer)))
        return invalidResponse(InvalidEntry.MustBeInteger);

    const romanResult = toRoman(parseInt(integer));

    return typeof romanResult === "string"
            ? successResponse(romanResult)
            : invalidResponse(romanResult);

}