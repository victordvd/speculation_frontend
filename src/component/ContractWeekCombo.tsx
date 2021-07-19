import React from 'react';


export default class ContractWeekCombo extends React.Component<Props, { value?:string,items: Array<any> }> {
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

  render() {
    return (<select value={this.state.value}  onChange={() => this.props.onChange(this.state.value)}>
      {React.Children.map(this.state.items, child => {
        return child
      })}
    </select>);
  }

}

interface Props {
  onChange: Function;
  children?: React.ReactChild[];
  ref?: any
}