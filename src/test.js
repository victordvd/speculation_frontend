// import * as iv from "implied-volatility";
var iv = require("implied-volatility");


/*
getImpliedVolatility(expectedCost, s, k, t, r, callPut, estimate)

expectedCost - The market price of the option
s - Current price of the underlying
k - Strike price
t - Time to experiation in years
r - Anual risk-free interest rate as a decimal
callPut - The type of option priced - "call" or "put"
[estimate=.1] - An initial estimate of implied volatility
*/
let v = iv.getImpliedVolatility(2, 101, 100, .1, .0015, "call"); // 0.11406250000000001 (11.4%)

console.log(v)

/*
    blackScholes(s, k, t, v, r, callPut)
    s - Current price of the underlying
    k - Strike price
    t - Time to expiration in years
    v - Volatility as a decimal
    r - Annual risk-free interest rate as a decimal
    callPut - The type of option to be priced - "call" or "put"
*/
var bs = require("black-scholes");

var p = bs.blackScholes(30, 34, .25, .2, .08, "call"); // 0.23834902311961947

console.log('p',p)


function getDays2ExpiryDate(contract_month){
    try{
        let year = contract_month.substring(0,4)
        let month = contract_month.substring(4,6)-1 // js month start at 0

        // 202401W2
        let first_day = new Date(year, month, 1)
        first_day.setDate(first_day.getDate() + (4-first_day.getDay()) % 7)

        if(contract_month.length==8){
            let week = Number(contract_month.substring(7,8))
            first_day.setDate(first_day.getDate() + (week-1)*7)
        }else{
            first_day.setDate(first_day.getDate() + 14)
        }
        return Math.floor((first_day.getTime()-new Date().getTime()) / (1000 * 3600 * 24))
    }catch(e){
        console.log('error:',contract_month)
        throw e
    }
}

console.log(getDays2ExpiryDate('202404'))