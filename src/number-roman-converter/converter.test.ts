import { toRoman } from "./converter";
import { InvalidEntry } from "./models";

const testCases = [
    ["I",1],
    ["II",2],
    ["III",3],
    ["IV",4],
    ["V",5],
    ["VI",6],
    ["VII",7],
    ["VIII",8],
    ["IX",9],
    ["X",10],
    ["L",50],
    ["LXI",61],
    ["LXXX",80],
    ["LXXXIX",89],
];
    describe("toRoman conversion", () => {
        describe("handles nominal inputs",() => {
            
            it.each(testCases)(
                "Expect %p for %p as input",
                (expected, input) => {
                    expect(toRoman(input as number)).toBe(expected);
                });
        });
    
        describe("handles errorneous inputs", () => {
            const outOfBoundsCases = [
                [0],
                [-1],
                [100],
                [101],
            ]
            it.each(outOfBoundsCases)
            ("Out of bounds (%p)",(val) => {
                expect(toRoman(val)).toBe(InvalidEntry.MustBeBetween1And99);
            });

            it("Decimal numbers",() => {
                expect(toRoman(1.65)).toBe(InvalidEntry.MustBeInteger);
            })
        });
        
        
    })