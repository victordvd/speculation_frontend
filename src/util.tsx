import $ from 'jquery';
import React from 'react';
import { PostionStore } from './position_store'
import { PositionModel, Contract, CP, LS } from './model'
import Button from './component/Button'
import GlobalVar from './Global';
import { Col } from 'react-grid-system';

export class Utils {
  static posiFn: any = {}

  static checkNull(o: any) {
    if (o == null)
      return '-'

    return o
  }

  static getPositionTable() {
    return $('#positionTable')
  }

  static addPosition(model: PositionModel) {

    console.log('addposi' + model)
    let existing = PostionStore.getData().filter(i => i.contract == model.contract && i.ls == model.ls && i.cp == model.cp && i.strike == model.strike)

    if (existing.length > 0) {
      existing[0].addAmount(model.amount)
    } else {
      model.addRow()
      PostionStore.getData().push(model)
      PostionStore.plotPosition()
    }
  }

  /* [{"ls":"L","contract":{"type":"C","strike":18200,"bid":47.5,"ask":48},"price":48},
  {"ls":"S","contract":{"type":"C","strike":18300,"bid":33.5,"ask":35.5},"price":33.5}] 
  
  {"contract":"TXO","ls":"Long","cp":"Call","strike":14200,"amount":1,"price":3060},
  */
  static parsePositionForRaw(o: any) {
    let ls = (o.ls == 'Long') ? LS.LONG : LS.SHORT
    // let contract = o.contract
    let type = (o.cp == 'Call') ? CP.CALL : CP.PUT
    let strike = o.strike
    let price = o.price
    let amount = o.amount

    return PositionModel.getTXOInstance(ls, type, Contract.TXO, strike, amount, price)
  }
  // static parsePositionForRaw(o: any) {
  //   let ls = (o.ls == 'L') ? LS.LONG : LS.SHORT
  //   let contract = o.contract
  //   let type = (contract.type == 'C') ? CP.CALL : CP.PUT
  //   let strike = contract.strike
  //   let price = o.price

  //   return PositionModel.getTXOInstance(ls, type, Contract.TXO, strike, 1, price)
  // }

  static parsePosition(o: any, ls: LS) {
    let type = (o.type == 'C') ? CP.CALL : CP.PUT
    let strike = o.strike
    let price = undefined

    if (LS.LONG === ls)
      price = o.ask
    else if (LS.SHORT === ls)
      price = o.bid

    return PositionModel.getTXOInstance(ls, type, Contract.TXO, strike, 1, price)
  }

  static createPosiBtn(p: any, ls: LS) {
    let m = Utils.parsePosition(p, ls)
    const colStyle= {border: '1px solid black',
    padding: '3px'}

    if (m.price == undefined)
      return <Col style={colStyle}></Col>

    // let fnName = ls + p.type + p.strike + '_posifn'
    // Utils.posiFn[fnName] = () => {
    //   m = Utils.parsePosition(p, ls)
    //   Utils.addPosition(m)
    // }
    // return '<button type="button" style="width:100%;" onclick="Utils.posiFn.' + fnName + '()">' + m.price + '</button> '

    const style= {
      width:'100%'
    }

    return <Col style={colStyle}><button style={style} onClick={() => {
      m = Utils.parsePosition(p, ls)
      Utils.addPosition(m)
    }}>    {m.price}</button></Col>
  }

  static getDays2ExpiryDate(contract_month:string){
    try{
        let year = Number(contract_month.substring(0,4))
        let month = Number(contract_month.substring(4,6))-1 // js month start at 0

        // 202401W2
        let first_day = new Date(year, month, 1)
        // first_day.setDate(first_day.getDate() + (4-first_day.getDay()) % 7)

        // Calculate the difference between the first day of the month and Wednesday
        let daysUntilWednesday = (3 - first_day.getDay() + 7) % 7; // 3 is the day code for Wednesday
        
        // Add the difference to the first day to get the first Wednesday
        let firstWednesday = new Date(daysUntilWednesday);
        first_day.setDate(first_day.getDate() + daysUntilWednesday);

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


}