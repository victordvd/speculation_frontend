import React, { createRef } from 'react';
import { render } from "react-dom";
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
      items: [<Row><Col>Buy</Col><Col>Sell</Col><Col>Strike</Col><Col>Buy</Col><Col>Sell</Col></Row>]
    }
    props.children = [<Row><Col>Buy</Col><Col>Sell</Col><Col>Strike</Col><Col>Buy</Col><Col>Sell</Col></Row>]

  }

  addRow(row: React.ReactChild) {
    this.setState({
      items: [...this.state.items, row]
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
