import React from 'react';
import $ from 'jquery';
import { LS, PositionModel, CP, Contract } from '../model'
import { PostionStore } from '../position_store'
import Button from './Button';
import { Utils } from '../util'
import GlobalVar from '../Global'
import ContractGrid  from './ContractGrid'
import { Container, Row, Col } from 'react-grid-system';
/*
function loadContracts() {
  let selector = $('#contractSelector')
  // header
  selector.append('<tr><th>Buy</th><th>Sell</th><th>Strike</th><th>Buy</th><th>Sell</th></tr>')


  for (let i = 0; i < GlobalVar.txoData.strikes.length; i++) {
    let c = GlobalVar.txoData.callContracts[i]
    let p = GlobalVar.txoData.putContracts[i]
    let s = GlobalVar.txoData.strikes[i]

    if (Math.abs(s - GlobalVar.txoData.spot) > 600)
      continue

    let lcBtn =  Utils.createPosiBtn(c, LS.LONG)
    let scBtn = Utils.createPosiBtn(c, LS.SHORT)
    let lpBtn = Utils.createPosiBtn(p, LS.LONG)
    let spBtn =  Utils.createPosiBtn(p, LS.SHORT)

    let tr = '<td>' + lcBtn + '</td><td>' + scBtn + '</td><th>' + s + '</td><td>' + lpBtn + '</td><td>' + spBtn + '</td>'

    if (Math.abs(s - GlobalVar.txoData.spot) <= 25) {
      tr = '<tr style="background-color:skyblue;">' + tr + '</tr>'
    } else {
      tr = '<tr>' + tr + '</tr>'
    }

    selector.append(tr)
  }
}*/



class HomePage extends React.Component {

  contractSelector:any = (<ContractGrid></ContractGrid>)

  loadContracts() {
    // let selector = $('#contractSelector')
    // header
    // selector.append('<tr><th>Buy</th><th>Sell</th><th>Strike</th><th>Buy</th><th>Sell</th></tr>')
  
  
    for (let i = 0; i < GlobalVar.txoData.strikes.length; i++) {
      let c = GlobalVar.txoData.callContracts[i]
      let p = GlobalVar.txoData.putContracts[i]
      let s = GlobalVar.txoData.strikes[i]
  
      if (Math.abs(s - GlobalVar.txoData.spot) > 600)
        continue
  
      let lcBtn =  Utils.createPosiBtn(c, LS.LONG)
      let scBtn = Utils.createPosiBtn(c, LS.SHORT)
      let lpBtn = Utils.createPosiBtn(p, LS.LONG)
      let spBtn =  Utils.createPosiBtn(p, LS.SHORT)
  
      // let tr = '<td>' + lcBtn + '</td><td>' + scBtn + '</td><th>' + s + '</td><td>' + lpBtn + '</td><td>' + spBtn + '</td>'
      let row = <Row><Col>{lcBtn}</Col><Col>{scBtn}</Col><Col>{s}</Col><Col>{lpBtn}</Col><Col>{spBtn}</Col></Row>
  
      // if (Math.abs(s - GlobalVar.txoData.spot) <= 25) {
      //   tr = '<tr style="background-color:skyblue;">' + tr + '</tr>'
      // } else {
      //   tr = '<tr>' + tr + '</tr>'
      // }
  
      console.log(row)
  
      console.log(this.contractSelector)
      console.log(this.contractSelector.props.children)

      this.contractSelector.addRow(row)
      // this.contractSelector.props.children.push(tr)
  
      // selector.append(tr)
    }
  }

  componentDidMount() {
    console.log('onload');

    let home = this;
    // load raw data
    $.get(window.location.href.match(/^.*\//)[0]+"servlet/getTxoData", function (data) {
      GlobalVar.txoData = data.data;
      console.log('load data:' + GlobalVar.txoData)

      // set spot
      console.log('spot:' + GlobalVar.txoData.spot)
      $('#spot').val(GlobalVar.txoData.spot)

      // // init selector
      home.loadContracts()

      PostionStore.plotPosition()
    });



    // let srcPos: Array<any> = JSON.parse(POS)
    // srcPos.forEach(element => {
    //   let pos = Utils.parsePositionForRaw(element)
    //   Utils.addPosition(pos)
    // });


    $('#addBtn').click(() => {
      let m_2 = PositionModel.getTXOInstance(LS.LONG, CP.CALL, Contract.TXO, 16000, 1, 64.5)

      Utils.addPosition(m_2)
    })

    $('#clearBtn').click(() => {
      PostionStore.removeAllPosition()

    })

    $('#spot').change(() => {
      PostionStore.plotPosition()
    })



    // CanvasBuilder.init()
  }

  render() {
    return (
      <div>
    <div>
        <button id="refreshBtn">Refresh</button>
    </div>
    <div>
        <div id="fplot"></div>
        <div>
            {/* <table id="contractSelector"> </table> */}
            {this.contractSelector}
        </div>
    </div>
    <br/>
    <div>
        <label>Spot</label>
        <input id="spot" type="number"/>
        <button id="addBtn">Add</button>
        <button id="clearBtn">Clear</button>
    </div>
    <div>
        <table id="positionTable">
            <tr>
                <th></th>
                <th>標的</th>
                <th>買賣</th>
                <th>C/P</th>
                <th>履約價</th>
                <th>數量</th>
                <th>價格</th>
            </tr>
        </table>
    </div>
    
</div>
    );
  }
}

export default HomePage