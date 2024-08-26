import HomePage from './component/HomePage';
import './App.css';
import {LS} from './model'

declare function functionPlot(arg: any): any;


/*
window.onload = function (){
  
  console.log('onload');
  // load raw data
  $.get( "servlet/getTxoData", function( data) {
     txoData = data.data;
    console.log('load data:' +txoData)

     // set spot
  $('#spot').val(txoData.spot)

  // init selector
  loadContracts()

  
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
*/

/*
function App() {
  return (
    <>
      <h1>Colorful Custom Button Components</h1>
      
<div>
    <div>
        <button id="refreshBtn">Refresh</button>
    </div>
    <div>
        <div id="fplot"></div>
        <div>
            <table id="contractSelector"> </table>
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
    </>
  );
}
*/

// function App() {
//   return (
//     <>
//       <h1>Colorful Custom Button Components</h1>
//       <Button 
//         border="none"
//         color="pink"
//         height = "200px"
//         onClick={() => alert("You clicked on the pink circle!")}
//         radius = "50%"
//         width = "200px"
//         children = "I'm a pink circle!"
//       />
//       <br></br>
//     </>
//   );
// }
function App() {
  return (
    <HomePage />
  );
}


export default App;



