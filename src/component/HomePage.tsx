import React from 'react';
import $ from 'jquery';
import { LS, PositionModel, CP, Contract } from '../model'
import { PostionStore } from '../position_store'
import Button from './Button';
import { Utils } from '../util'
import GlobalVar from '../Global'
import ContractGrid from './ContractGrid'
import { Container, Row, Col } from 'react-grid-system';
import ContractWeekCombo from './ContractWeekCombo'


class HomePage extends React.Component {

  contractSelector = React.createRef<ContractGrid>()
  contractWeekCombo = React.createRef<ContractWeekCombo>()

  addContractRows() {
    this.contractSelector.current.clear()

    for (let i = 0; i < GlobalVar.txoData.strikes.length; i++) {
      let c = GlobalVar.txoData.callContracts[i]
      let p = GlobalVar.txoData.putContracts[i]
      let s = GlobalVar.txoData.strikes[i]

      if (Math.abs(s - GlobalVar.txoData.spot) > 600)
        continue

      let lcBtn = Utils.createPosiBtn(c, LS.LONG)
      let scBtn = Utils.createPosiBtn(c, LS.SHORT)
      let lpBtn = Utils.createPosiBtn(p, LS.LONG)
      let spBtn = Utils.createPosiBtn(p, LS.SHORT)


      // let tr = '<td>' + lcBtn + '</td><td>' + scBtn + '</td><th>' + s + '</td><td>' + lpBtn + '</td><td>' + spBtn + '</td>'
      let row = <Row>{lcBtn}{scBtn}<Col>{s}</Col>{lpBtn}{spBtn}</Row>

      // if (Math.abs(s - GlobalVar.txoData.spot) <= 25) {
      //   tr = '<tr style="background-color:skyblue;">' + tr + '</tr>'
      // } else {
      //   tr = '<tr>' + tr + '</tr>'
      // }


      this.contractSelector.current.addRow(row)
      // this.contractSelector.props.children.push(tr)

      // selector.append(tr)
    }
  }

  loadTxoData(home:any, contractWeek?:string) {
    // let home = this;
    // load raw data
    $.get(window.location.href.match(/^.*\//)[0] + "servlet/getTxoData",{contractWeek:contractWeek}, function (data) {
      GlobalVar.txoData = data.data;
      console.log('load data:' + GlobalVar.txoData+' contractWeek:'+contractWeek)

      // set spot
      console.log('spot:' + GlobalVar.txoData.spot)
      $('#spot').val(GlobalVar.txoData.spot)


      // set contract weeks
      home.contractWeekCombo.current.clear()

      GlobalVar.txoData.contractCodes.forEach((code:string) => {
        home.contractWeekCombo.current.addContractCode(code)
      });

      // init selector
      home.addContractRows()

      PostionStore.plotPosition()
    });
  }

  componentDidMount() {
    console.log('onload');

    this.loadTxoData(this)

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
    const bodyStyle = {padding:"20px"}
    const plotStyle = { display: 'inline-block', 'vertical-align': 'top' }
    const selectorStyle = {
      display: 'inline-block', 'max-height': '400px', overflow: 'auto',
      width: '500px', padding: '5px', border: '1px solid black'
    }
    let home = this

    return (
      <div style={bodyStyle}>
        <div>
          <div>
            <label>Spot</label>
            <input id="spot" type="number" />
          </div>

          <div>
            <label>Default Cost(tick/lot)</label>
            <input id="defaultCost" type="number" min="0" defaultValue="2" />
          </div>
          <div id="fplot" style={plotStyle}></div>

          <div style={selectorStyle}>
          <div>
            <label>Contract Week</label>
            <ContractWeekCombo ref={this.contractWeekCombo} onChangeImpl={(v:string)=> home.loadTxoData.apply(null,[home,v])}></ContractWeekCombo>
            </div>
            <ContractGrid ref={this.contractSelector}></ContractGrid>
          </div>
        </div>
        <br />
        <div>
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