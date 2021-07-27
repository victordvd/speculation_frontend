import React from "react";
import Modal from 'react-modal';
import { Utils } from '../util'

export default class Popup extends React.Component<{
  isOpen?: boolean
  ref?: any

}, { isOpen?: boolean, json?: string }> {

  constructor(props: any) {

    super(props);
    this.state = {
      isOpen: false,
      // items: [<Row><Col>Buy</Col><Col>Sell</Col><Col>Strike</Col><Col>Buy</Col><Col>Sell</Col></Row>]
      json: 'json...'
    }

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal = () => {
    this.setState({ isOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isOpen: false });
  };

  loadJson = () => {
    let obj = JSON.parse(this.state.json)
    obj.forEach((element: any) => {
      let pos = Utils.parsePositionForRaw(element)
      Utils.addPosition(pos)
    });
  }

  handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) { this.setState({ isOpen: this.state.isOpen, json: event.target.value }); }

  render() {
    const txtStyle = { 'min-height': '500px', width: '100%' }

    return (<Modal isOpen={this.state.isOpen} >
      <textarea style={txtStyle} value={this.state.json} onChange={this.handleChange} />
      <button onClick={this.loadJson}>Load</button>
      <button onClick={this.handleCloseModal}>
        Close
      </button>
    </Modal>);
  }
}