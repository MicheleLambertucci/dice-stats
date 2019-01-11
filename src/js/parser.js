import { Die } from './diceUtils'

export class ParsingError extends Error {}

export function parse(str){
    const languageExpr = /^((\+|\-|^)(\d+|d\d+|\d+d\d+))+$/gm;
    const constantNumbers = /(?:(\+|\-|^)(\d+)(?!d)(?:(\+|\-|$)))/gm;
    const missingDiceNumber = /(\+|\-|^)(d\d+)/gm;

    var result = str.replace(/\s/gm, ``);

    if(!languageExpr.test(result)) throw new ParsingError();

    result = result.replace(constantNumbers, `$&d1`);
    result = result.replace(missingDiceNumber, `$11$2`);
    
    const diceExpr = /(?<sign>\+|\-|^)(?<n_of>\d+)d(?<dtype>\d+)/gm;
    var ret = []

    let match;
    while((match = diceExpr.exec(result)) !== null){
        var multiplier;
        switch(match.groups['sign']){
            case "+":
                multiplier = 1;
                break;
            case "-":
                multiplier = -1;
                break;
            default:
                multiplier = 1;
        }

        ret.push(new Die(
            Number(match.groups['n_of']),
            Number(match.groups['dtype']),
            multiplier
        ))
    }

    return ret;
}