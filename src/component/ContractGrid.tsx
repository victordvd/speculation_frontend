import React from 'react';
import $ from 'jquery';
import { LS, PositionModel, CP, Contract } from '../model'
import { PostionStore } from '../position_store'
import Button from './Button';
import { Utils } from '../util'
import GlobalVar from '../Global'
import { Container, Row, Col } from 'react-grid-system';


export default class ContractGrid extends React.Component<Props, {items:Array<any>}> {
    // handleClick() {
    //     console.log('this is:', this);
    //   }
    
    //   render() {
    //         return (

    //             <table></table>
    //     );
    //   }

    constructor(props:any) {
      super(props);
      this.state = {
        items: [<Row><Col>Buy</Col><Col>Sell</Col><Col>Strike</Col><Col>Buy</Col><Col>Sell</Col></Row> ] 
      }

      props.children = [<Row><Col>Buy</Col><Col>Sell</Col><Col>Strike</Col><Col>Buy</Col><Col>Sell</Col></Row> ] 

    }

  
    addRow(row:React.ReactChild){
      // this.state.items = this.state.items.concat(row)
      this.props.children.push(row)
      this.setState(this.state)
    }
    
    render() {
     return (<Container>
       {this.props.children}
       {React.Children.map(this.props.children, child => {
            return child
         })}
       </Container>);
    }
}


interface Props {
  // lcBtn: any;
  // scBtn: any;
  // strike:any;
  // lpBtn: any;
  // spBtn: any;
  children?: React.ReactChild[];
}

// const Row: React.FC<Props> = ({ 
//   lcBtn,
//   scBtn,
//   strike,
//   lpBtn,
//   spBtn,
//   children

//   }) => { 
//     return (
//       <tr>
//         <td>{lcBtn}</td>
//         <td>{scBtn}</td>
//         <td>{strike}</td>
//         <td>{lpBtn}</td>
//         <td>{spBtn}</td>
//       </tr>
//   );
// }


// class Table extends React.Component {
//   getInitialState: {
//     return {
//       rows: ['row 1', 'row 2', 'row 3']
//     }
// }
//   addRow : function() {
//     var rows = this.state.rows
//     rows.push('new row')
//     this.setState({rows: rows})
// }
//   render() {
//     return (
//       <table>
//       {rows.map((r) => (
//         <tr>
//             <td>{r}</td>
//         </tr>
//       ))}
//   </table>
//     );
//   }
// }
