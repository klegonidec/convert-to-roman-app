import url from 'url'
import { PushNotificationResult } from '../contracts/interface';
import { InvalidEntry, toRoman } from '../number-roman-converter';

/**
 * Mapping from technical errors to User Friendly Messages
 * Could be loaded from external resource, handling multiple localization
 */
const errorMessageMapping : Map<InvalidEntry, string> = new Map<InvalidEntry,string>();
errorMessageMapping.set(InvalidEntry.MustBeInteger, "Please provide a valid integer");
errorMessageMapping.set(InvalidEntry.MustBeBetween1And99, "Please provide a integer within 1 and 99");


function invalidResponse(entry: InvalidEntry): PushNotificationResult{
    return {
        status: 400,
        body: errorMessageMapping.get(entry)!
    };
}

function successResponse(result: string): PushNotificationResult {
    return {
        status: 200,
        body: result
    }
}


export function romanConvertionHandler(url: url.UrlWithParsedQuery) : PushNotificationResult
{
    const {integer} = url.query;
    if(!integer || typeof integer !== "string" || !Number.isInteger(parseFloat(integer)))
        return invalidResponse(InvalidEntry.MustBeInteger);

    const romanResult = toRoman(parseInt(integer));

    return typeof romanResult === "string"
            ? successResponse(romanResult)
            : invalidResponse(romanResult);

}