import React from 'react';
import $ from 'jquery';
import { LS, PositionModel, CP, Contract } from '../model'
import { PostionStore } from '../position_store'
import Button from './Button';
import { Utils } from '../util'
import GlobalVar from '../Global'
import { Container, Row, Col } from 'react-grid-system';


export default class ContractGrid extends React.Component<Props, { items: Array<any> }> {


  constructor(props: any) {

    super(props);
    this.state = {
      items: [<Row><Col>Bid</Col><Col>Ask</Col><Col>Strike</Col><Col>Bid</Col><Col>Ask</Col></Row>]
    }
    props.children = [<Row><Col>Bid</Col><Col>Ask</Col><Col>Strike</Col><Col>Bid</Col><Col>Ask</Col></Row>]

  }

  addRow(row: React.ReactChild) {
    this.setState({
      items: [...this.state.items, row]
    })
  }

  clear(){
    this.setState({
      items: [<Row><Col>Bid</Col><Col>Ask</Col><Col>Strike</Col><Col>Bid</Col><Col>Ask</Col></Row>]
    })
  }

  render() {
    return (<Container>
      {React.Children.map(this.state.items, child => {
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
  ref?: any
}

interface State {
  items: Array<any>
  ref?: Date
}
