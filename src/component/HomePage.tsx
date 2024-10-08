import React, { useState } from 'react';
import $ from 'jquery';
import { LS, PositionModel, CP, Contract } from '../model'
import { PostionStore } from '../position_store'
import { Utils } from '../util'
import GlobalVar from '../Global'
import ContractGrid from './ContractGrid'
import {Row, Col } from 'react-grid-system';
import ContractWeekCombo from './ContractWeekCombo'
import Popup from './Popup';
import {WebSocketUtil} from '../websocket';
import TestCmp from './TestCmp';
import '../App.css';

function TimeValueChk(){
  const [checked,setChecked] = useState(true);
  const handleClick = ()=>{setChecked(!checked);PostionStore.plotPosition();}
  return (<input id="timeValue" type="checkbox" checked={checked} onClick={handleClick}/>)
}

class HomePage extends React.Component {

  contractSelector = React.createRef<ContractGrid>()
  contractWeekCombo = React.createRef<ContractWeekCombo>()
  jsonPopup = React.createRef<Popup>()
  firstInit = true

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
    $.get(window.location.href.match(/^.*\//)[0] + "servlet/getTxoData", { contractWeek: contractWeek },data=>home.renderTxoData(home,data,true))
  }

  renderTxoData(home: any, data:any, resetContractWeek=false){
    GlobalVar.txoData = data.data;

    console.log(GlobalVar.txoData)

    // set spot
    console.log('spot:' + GlobalVar.txoData.spot)
    $('#spot').val(GlobalVar.txoData.spot)

    // set contract weeks
    if(resetContractWeek){
      home.contractWeekCombo.current.clear()
      GlobalVar.txoData.contractCodes.forEach((code: string) => {
        home.contractWeekCombo.current.addContractCode(code)
      });
      home.contractWeekCombo.current.setContractCode(GlobalVar.txoData.targetContractCode)
    }
    // calculate days to expriation
    let days2Expr = String(Utils.getDays2ExpiryDate(GlobalVar.txoData.targetContractCode))
    $('#days2Expr').val(days2Expr)
    

    // init selector
    home.addContractRows()

    if(home.firstInit){
      PostionStore.plotPosition()
      home.firstInit = false
    }
  }

  componentDidMount() {
    console.log('onload');

    this.loadTxoData(this)

    // let srcPos: Array<any> = JSON.parse(POS)
    // srcPos.forEach(element => {
    //   let pos = Utils.parsePositionForRaw(element)
    //   Utils.addPosition(pos)
    // });

    // WebSocket
    let websocketUtil = new WebSocketUtil(this)
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

  // Render
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
        {/* <Popup ref={this.jsonPopup}>popup</Popup> */}
        <div>
          {/* <TestCmp/> */}
          <div>
            <label>Spot</label>
            <input id="spot" type="number"  min="0" onChange={()=>PostionStore.plotPosition()}/>
          </div>
          <div>
            <label>Default Cost(tick/lot)</label>
            <input id="defaultCost" type="number" min="0" defaultValue="1" onChange={()=>PostionStore.plotPosition()}/>
          </div>
          <div>
            <label>Risk-free Rate</label>
            <input id="riskFreeRate" type="number" defaultValue="0.03" step="0.001" onChange={()=>PostionStore.plotPosition()}/>
          </div>
          <div>
            <label>Days to Expiration</label>
            <input id="days2Expr" type="number" min="0.0" step="1" onChange={()=>PostionStore.plotPosition()}/>
          </div>
          <div>
            <label>Display Time Value</label>
            <TimeValueChk/>
          </div>
        {/* <div>
            <form>
                <div>
                    <label>Messege</label>
                    <input id="msgTxt" type="text" placeholder="messege here..." />
                    <button id="socketSendBtn" type="submit">Send</button>
                </div>
            </form>
            <tbody id="txtArea"></tbody>
        </div> */}
          <div id="fplot" style={plotStyle}></div>

          <div style={selectorStyle} >
            <div className='row'>
              <div className='column'>
                <label>Contract Week</label>
                <ContractWeekCombo ref={this.contractWeekCombo} onChangeImpl={(v: string) => home.loadTxoData.apply(null, [home, v])}></ContractWeekCombo>
              </div>
              <div className='column'>
                <label>Auto-Update</label>
                <button id="socketConnBtn" type="submit">Enable</button>
                <button id="socketDisconnBtn" type="submit" disabled>Disable</button>
              </div>
            </div>
            <div style={overflowStyle}>
              <ContractGrid ref={this.contractSelector}></ContractGrid>
            </div>
          </div>
        </div>
        <br />
        <div>
          <button id="addBtn" onClick={()=>{      
            let m_2 = PositionModel.getTXOInstance(LS.LONG, CP.CALL, Contract.TXO, 22000, 1, 64.5);
            Utils.addPosition(m_2);}}>Add</button>
          <button id="clearBtn" onClick={()=>PostionStore.removeAllPosition()}>Clear</button>
          <button id="toJsonBtn" onClick={()=>{ let json = PostionStore.getDataJson();
            window.alert(json);
            this.copyTextToClipboard(json);}}>To JSON</button>
          <button id="loadJsonBtn" onClick={()=>this.jsonPopup.current.handleOpenModal()}>Load JSON</button>
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