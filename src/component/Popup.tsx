import React from "react";
import Modal from 'react-modal';
import { Utils } from '../util'
import { PostionStore } from '../position_store'

export default class Popup extends React.Component<{
  isOpen?: boolean
  ref?: any

}, { isOpen?: boolean, json?: string }> {

  constructor(props: any) {

    super(props);
    this.state = {
      isOpen: false
      // items: [<Row><Col>Buy</Col><Col>Sell</Col><Col>Strike</Col><Col>Buy</Col><Col>Sell</Col></Row>]
    }

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleOpenModal = () => {
    this.setState({ isOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isOpen: false });
  };

  loadJson = () => {
    PostionStore.removeAllPosition()

    let obj = JSON.parse(this.state.json)
    obj.forEach((element: any) => {
      let pos = Utils.parsePositionForRaw(element)
      Utils.addPosition(pos)
    });
    this.setState({ isOpen: false });
  }

  handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
     this.setState({ isOpen: this.state.isOpen, json: event.target.value }); }

  render() {
    const txtStyle = { 'min-height': '500px', width: '100%' }

    return (<Modal isOpen={this.state.isOpen} >
      <textarea style={txtStyle} defaultValue="json" value={this.state.json} onChange={this.handleChange} />
      <button onClick={this.loadJson}>Load</button>
      <button onClick={this.handleCloseModal}>
        Close
      </button>
    </Modal>);
  }
}