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
import Popup from './Popup';

class HomePage extends React.Component {

  contractSelector = React.createRef<ContractGrid>()
  contractWeekCombo = React.createRef<ContractWeekCombo>()
  jsonPopup = React.createRef<Popup>()

  addContractRows() {
    this.contractSelector.current.clear()

    for (let i = 0; i < GlobalVar.txoData.strikes.length; i++) {
      let c = GlobalVar.txoData.callContracts[i]
      let p = GlobalVar.txoData.putContracts[i]
      let s = GlobalVar.txoData.strikes[i]

      // if (Math.abs(s - GlobalVar.txoData.spot) > 600)
      //   continue

      let lcBtn = Utils.createPosiBtn(c, LS.LONG)
      let scBtn = Utils.createPosiBtn(c, LS.SHORT)
      let lpBtn = Utils.createPosiBtn(p, LS.LONG)
      let spBtn = Utils.createPosiBtn(p, LS.SHORT)


      // let tr = '<td>' + lcBtn + '</td><td>' + scBtn + '</td><th>' + s + '</td><td>' + lpBtn + '</td><td>' + spBtn + '</td>'

      let rowStyle = {}
      if (Math.abs(s - GlobalVar.txoData.spot) <= 50) {
        rowStyle = { 'background-color': 'skyblue' }
      }

      let row = <Row style={rowStyle}>{lcBtn}{scBtn}<Col>{s}</Col>{lpBtn}{spBtn}</Row>
      this.contractSelector.current.addRow(row)

      // selector.append(tr)
    }
  }

  loadTxoData(home: any, contractWeek?: string) {
    // let home = this;
    // load raw data
    $.get(window.location.href.match(/^.*\//)[0] + "servlet/getTxoData", { contractWeek: contractWeek }, function (data) {
      GlobalVar.txoData = data.data;
      console.log('load data contractWeek:' + contractWeek + ' target week: ' + GlobalVar.txoData.targetContractCode)
      console.log(GlobalVar.txoData)

      // set spot
      console.log('spot:' + GlobalVar.txoData.spot)
      $('#spot').val(GlobalVar.txoData.spot)


      // set contract weeks
      home.contractWeekCombo.current.clear()

      GlobalVar.txoData.contractCodes.forEach((code: string) => {
        home.contractWeekCombo.current.addContractCode(code)
      });

      home.contractWeekCombo.current.setContractCode(GlobalVar.txoData.targetContractCode)

      // calculate days to expriation
      let days2Expr = String(Utils.getDays2ExpiryDate(GlobalVar.txoData.targetContractCode))
      $('#days2Expr').val(days2Expr)
      

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

    $('#toJsonBtn').click(() => {
      let json = PostionStore.getDataJson()
      window.alert(json)

      this.copyTextToClipboard(json)
    })

    $('#loadJsonBtn').click(() => {
      this.jsonPopup.current.handleOpenModal()
    })

    $('#spot').change(() => {
      PostionStore.plotPosition()
    })

    $('#riskFreeRate').change(() => {
      PostionStore.plotPosition()
    })

    $('#days2Expr').change(() => {
      PostionStore.plotPosition()
    })

    $('#timeValue').on("click",() => {
      PostionStore.plotPosition()
    })
    $('#timeValue').prop('checked', true)
    // CanvasBuilder.init()
  }

  fallbackCopyTextToClipboard(text: string) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }
  copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  render() {
    const bodyStyle = { padding: "20px" }
    const plotStyle = { display: 'inline-block', 'vertical-align': 'top' }
    const selectorStyle = {
      display: 'inline-block', 'max-height': '400px', height:'400px', overflow: 'hidden',
      width: '500px', padding: '5px', border: '1px solid black'
    }

    const overflowStyle = {overflow: 'scroll',height:'370px'}
    let home = this

    return (
      <div style={bodyStyle}>
        <Popup ref={this.jsonPopup}>popup</Popup>
        <div>
          <div>
            <label>Spot</label>
            <input id="spot" type="number"  min="0"/>
          </div>
          <div>
            <label>Default Cost(tick/lot)</label>
            <input id="defaultCost" type="number" min="0" defaultValue="1" />
          </div>
          <div>
            <label>Risk-free Rate</label>
            <input id="riskFreeRate" type="number" defaultValue="0.03" step="0.001" />
          </div>
          <div>
            <label>Days to Expiration</label>
            <input id="days2Expr" type="number" min="0.0" step="1"/>
          </div>
          <div>
            <label>Display Time Value</label>
            <input id="timeValue" type="checkbox"/>
          </div>
          <div id="fplot" style={plotStyle}></div>

          <div style={selectorStyle} >
            <div>
              <label>Contract Week</label>
              <ContractWeekCombo ref={this.contractWeekCombo} onChangeImpl={(v: string) => home.loadTxoData.apply(null, [home, v])}></ContractWeekCombo>
            </div >
            <div style={overflowStyle}>
              <ContractGrid ref={this.contractSelector}></ContractGrid>
            </div>
          </div>
        </div>
        <br />
        <div>
          <button id="addBtn">Add</button>
          <button id="clearBtn">Clear</button>
          <button id="toJsonBtn">To JSON</button>
          <button id="loadJsonBtn">Load JSON</button>
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