import React from 'react';


export default class ContractWeekCombo extends React.Component<Props, { value?: string, items: Array<any> }> {
  constructor(props: any) {

    super(props);
    this.state = {
      items: []
    }

    // this.handleChange = this.handleChange.bind(this);
    // props.children = [<Row><Col>Buy</Col><Col>Sell</Col><Col>Strike</Col><Col>Buy</Col><Col>Sell</Col></Row>]

  }

  addContractCode(weekCode: string) {
    this.setState({
      items: [...this.state.items, <option value={weekCode}>{weekCode}</option>]
    })
  }

  setContractCode(weekCode: string) {
    this.setState({
      items: [...this.state.items], value:weekCode
    })
    // this.props.onChangeImpl(weekCode)
  }

  clear() {
    this.setState({
      items: []
    })
  }

  handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    console.log('contract cmb:' + event.target.value)
    this.setState({ items: this.state.items, value: event.target.value });
    this.props.onChangeImpl(event.target.value)
  }

  render() {
    return (<select value={this.state.value} onChange={e=>this.handleChange.apply(this,[e])}>
      {React.Children.map(this.state.items, child => {
        return child
      })}
    </select>);
  }

}

interface Props {
  onChangeImpl: Function;
  // onChange:Function
  children?: React.ReactChild[];
  ref?: any
}