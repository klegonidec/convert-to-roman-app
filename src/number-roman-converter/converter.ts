import { InvalidEntry,  RomanSymbol } from "./models"

type SingleDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; 

/**
 * Handle the Roman conversion logics
 * A pattern exists around the unit, the pivot and the upperBound
 * Ex.
 * from 1 to 10     :   1   2   3   4   5   6   7   8    9  (10)
 *                      I   II  III IV  V   VI  VII VIII IX  X
 * from 10 to 100   :   10  20  30  40  50  60  70  80   90 (100)
 *                      X   XX  XXX IL  L   LI  LII LIII IC  C
 *                      ^               ^                    ^
 *                     unit           pivot               upperBound
 * @param singledigit 
 * @param unit
 * @param pivot 
 * @param upperBound 
 * @returns 
 */
function mappingHelper(singledigit: SingleDigit,unit:RomanSymbol,pivot:RomanSymbol, upperBound:RomanSymbol) {
    //Runtime guard
    if(singledigit < 0 || singledigit > 9) throw Error(`Got ${singledigit} but singledigit parameter must be a single digit between 0 and 9`)

    switch(singledigit){
        case 0: return "";
        case 1: return unit;
        case 2: return unit+unit;
        case 3: return unit+unit+unit;
        case 4: return unit+pivot;
        case 5: return pivot;
        case 6: return pivot+unit;
        case 7: return pivot+unit+unit;
        case 8: return pivot+unit+unit+unit;
        case 9: return unit+upperBound
    }
}

// Type Guard function ensuring a number is a single Singledigit.
function SingleisDigit(SingledigitOrNumber: number) : SingledigitOrNumber is SingleDigit
{
    return SingledigitOrNumber > 0 && SingledigitOrNumber < 10 && Number.isInteger(SingledigitOrNumber);
}

/**
 * Converts a given integer in its Roman representation
 * cf. https://www.mathsisfun.com/roman-numerals.html
 * @param integer Must be strictly positive, strictly inferior to 100 integer
 * @returns The Roman representations, or InvalidEntry
 */
export const toRoman = (integer:number) : string|InvalidEntry => {
    if(integer < 1 || integer >= 100) return InvalidEntry.MustBeBetween1And99;
    if(!Number.isInteger(integer)) return InvalidEntry.MustBeInteger;
    
    if(SingleisDigit(integer)) return mappingHelper(integer,"I","V","X");
    
    const SinglefirstDigit = Math.floor(integer / 10) as SingleDigit;
    const rest = integer - 10*SinglefirstDigit as SingleDigit
    return mappingHelper(SinglefirstDigit,"X","L","C") + mappingHelper(rest,"I","V","X");

}