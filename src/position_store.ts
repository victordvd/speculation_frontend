import $ from 'jquery';
import { PositionModel, Contract, CP, LS } from './model'
import { Utils } from './util'
import GlobalVar from './Global'
import functionPlot from "function-plot"
var iv = require("implied-volatility");
var bs = require("black-scholes");

export class PoistionCoefficient {

    y: number = 0//profit
    x: number = 0//settle price

    ls: number
    cp: number
    strike: number
    price: number
    amount: number

}

export class PostionStore {

    //plot function Coefficients
    profit: number//y
    settle: number//x
    strike: number
    cp: number//C:+1  P:-1
    ls: number//L:-  S:+
    price: number
    iv: number// Implied Volatility

    // static strikes:Array<number>
    // static m:number
    // static b:number

    private static data: Array<PositionModel> = []

    static getData() {
        return this.data
    }

    static getDataJson() {
        let positions: any = []

        this.data.forEach((p: PositionModel) => {
            positions.push({ contract: p.contract, contractWeek: p.contractWeek, ls: p.ls, cp: p.cp, strike: p.strike, amount: p.amount, price: p.price })
        })

        let json = JSON.stringify(positions)

        return json
    }

    static addPosition(p: PositionModel) {
        this.data.push(p)
    }

    static removeAllPosition() {
        this.data = []

        Utils.getPositionTable().find("tr:gt(0)").remove()
        PostionStore.plotPosition()
    }

    static removePosition(p: PositionModel) {

        let delRecIdx: number = undefined

        this.data.forEach((rec, i) => {

            if (rec.equals(p))
                delRecIdx = i
        });

        if (delRecIdx !== undefined)
            this.data.splice(delRecIdx, 1)

        console.log('removed rec: ' + delRecIdx)
    }

    static plotPosition() {

        const fplot = document.querySelector("#fplot")

        let fnEtStk = this.getAnalyzeFn()
        // console.log(data)

        //reset
        while (fplot.firstChild) {
            fplot.removeChild(fplot.firstChild);
        }

        let fpVO: any = {
            target: fplot,
            tip: {
                xLine: true,    // dashed line parallel to y = 0
                yLine: true    // dashed line parallel to x = 0
                //   renderer: (x:number, y:number, index:number) =>{
                //     return x+' : '+y
                //   }
            },
            grid: true,
            yAxis: { label: 'Profit (tick)' },
            xAxis: { domain: [GlobalVar.txoData.spot - 500, GlobalVar.txoData.spot + 500], label: 'Settle Price' },
            data: fnEtStk.data,
            annotations: fnEtStk.annotations // vertical lines of strike price
            // data: [
            //   {fn: 'x^2'},
            //   {fn: '3x'}
            // ]
        }

        let spot = $('#spot').val()

        if (spot)
            fpVO.annotations.push({ x: spot, text: 'spot: ' + spot })


        console.log(fpVO)

        functionPlot(fpVO)
    }

    /** add profit function for each position in slope intercept form */
    static getAnalyzeFn() {

        let strikes: Set<number> = new Set

        // [{strike,[m1,b1],[m2,b2]}]
        let posiFnVO: Array<any> = []

        // [strike, B-S fn]]
        let strikeExprFnMap: Map<number,(ftx:number)=>number> = new Map()
        let defaultCost = $('#defaultCost').val() as number

        this.data.forEach((pos) => {

            let hRange: Array<any> = [0, pos.strike]
            let sRange: Array<any> = [pos.strike, Infinity]

            // line of profit/loss stop
            let m1, b1: number

            // line of P/L change
            let m2, b2: number
            
            let ls:number,cp:number
            let cpStr:string
            
            if (pos.contract === Contract.TXO) { 
                if (pos.ls === LS.LONG)
                    ls = -1
                else
                    ls = 1

                if (pos.cp === CP.CALL){
                    cp = 1
                    cpStr = 'call'
                }else{
                    cp = -1
                    cpStr = 'put'
                }

                if (cp === 1) {
                    m1 = 0
                    b1 = (ls * pos.price) * pos.amount
                    m2 = -ls * cp * pos.amount
                    b2 = (ls * (pos.price) + ls * cp * pos.strike) * pos.amount
                } else {
                    m1 = -ls * cp * pos.amount
                    b1 = (ls * (pos.price) + ls * cp * pos.strike) * pos.amount
                    m2 = 0
                    b2 = (ls * pos.price) * pos.amount
                }

                // set data points of "days-to-expiry"
                let days2Expr = Number($('#days2Expr').val())
                let year2Expr = days2Expr/252
                let riskFreeRate = Number($('#riskFreeRate').val())
                console.log('risk-free rate:',riskFreeRate,'days2expr:',days2Expr,'year2expr:',year2Expr)
                let impVola = iv.getImpliedVolatility(pos.price, GlobalVar.txoData.spot, pos.strike, year2Expr, riskFreeRate, cpStr)
                let exprFn = function (ftx:number) {
                    let exprPrice = bs.blackScholes(ftx, pos.strike, year2Expr, impVola, riskFreeRate, cpStr) 
                    return (-ls * (exprPrice-pos.price) -defaultCost) * pos.amount
                }    
                strikeExprFnMap.set(pos.strike, exprFn)

                strikes.add(pos.strike)
                posiFnVO.push([pos.contract, pos.strike, [m1, b1], [m2, b2]])
                
            } else {

                if (pos.ls === LS.LONG) {

                    m1 = 1 * pos.amount
                } else {

                    m1 = -1 * pos.amount
                }

                b1 = -pos.price * pos.amount

                posiFnVO.push([pos.contract, [m1, b1]])
            }
        })

        return this.addPosiFunc(Array.from(strikes), posiFnVO, strikeExprFnMap)
    }

    static addPosiFunc(strikes: Array<number>, posiFnVO: Array<Array<any>>, strikeExprFnMap: Map<number,(ftx:number)=>number>) {

        strikes.push(Infinity)
        strikes.sort((a, b) => { return a - b })

        //[[[range],m,b]]
        let fnSet: Array<Array<any>> = []
        let annotations: Array<object> = []

        strikes.forEach((item, i) => {

            //[[range],m,b]
            let defautFnVO = [[strikes[i], strikes[i + 1]], 0, 0]

            if (i === 0) {
                fnSet.push([[0, strikes[0]], 0, 0])
                fnSet.push(defautFnVO)
            } else if (i === strikes.length - 1) { }

            else
                fnSet.push(defautFnVO)


            if (item !== Infinity)
                annotations.push({ x: item, text: item })
        })

        // posiFnVO.sort((a,b)=>{return a[0]-b[0]})

        if (fnSet.length === 0 && posiFnVO.length !== 0) {
            fnSet.push([[0, Infinity], 0, 0])
        }

        posiFnVO.forEach(posi => {

            let contract = posi[0]
            let strike = posi[1]

            fnSet.forEach(fn => {
                if (contract === Contract.TXO) {
                    if (fn[0][1] <= strike) {

                        //m
                        fn[1] += posi[2][0]
                        //b
                        fn[2] += posi[2][1]

                    } else {

                        //m
                        fn[1] += posi[3][0]
                        //b
                        fn[2] += posi[3][1]
                    }
                } else {
                    //m
                    fn[1] += posi[1][0]
                    //b
                    fn[2] += posi[1][1]
                }
            })


        })

        console.log('fnSet'+fnSet)

        let defaultCost = $('#defaultCost').val() as number

        //range ,fn
        let plotVO: Array<object> = []
        let red = 'rgb(255, 0, 0)'
        let blue = 'rgb(0, 0, 255)'


        plotVO.push({ range: [0, Infinity], fn: '0', skipTip: true })

        // build fn str namely 'ax+b'
        fnSet.forEach((item, i) => {
            let fn = item[1] + '*x+' + item[2]
            if (defaultCost > 0)
                fn += '-' + Number(defaultCost) * fnSet.length
            console.log(fn)
            let color = red

            if (i % 2 === 0)
                color = red
            else
                color = blue

            plotVO.push({ range: item[0], fn: fn, color: color/*,closed: true*/ })
        })

        // plotVO.push({  fn: fnSet.length*-defaultCost+""/*,closed: true*/ })

        if(strikeExprFnMap.size>0){
            plotVO.push({
                graphType: 'polyline',
                color:'#147340',
                fn: function (scope:any) {
                  var ftx = scope.x
                  let fns = Array.from(strikeExprFnMap.values())
                  return fns.map(fn=>fn(ftx)).reduce((partialSum, a) => partialSum + a, 0)
                }
            })
        }

        return { annotations: annotations, data: plotVO }
    }

}