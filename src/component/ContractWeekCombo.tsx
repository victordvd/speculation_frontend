import React from 'react';


export default class ContractWeekCombo extends React.Component<Props, { value?: string, items: Array<any> }> {
  constructor(props: any) {

    super(props);
    this.state = {
      items: []
    }
    // props.children = [<Row><Col>Buy</Col><Col>Sell</Col><Col>Strike</Col><Col>Buy</Col><Col>Sell</Col></Row>]

  }

  addContractCode(weekCode: string) {
    this.setState({
      items: [...this.state.items, <option value={weekCode}>{weekCode}</option>]
    })
  }

  clear() {
    this.setState({
      items: []
    })
  }

  handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    console.log('contract cmb:' + event.target.value)
    this.setState({ items: this.state.items, value: event.target.value });
    this.props.onChangeImpl(this.state.value)
  }

  render() {
    return (<select value={this.state.value} onChange={this.handleChange}>
      {React.Children.map(this.state.items, child => {
        return child
      })}
    </select>);
  }

}

interface Props {
  onChangeImpl: Function;
  children?: React.ReactChild[];
  ref?: any
}