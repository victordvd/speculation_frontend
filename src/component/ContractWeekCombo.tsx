import React from 'react';


export default class ContractWeekCombo extends React.Component<Props, { items: Array<any> }> {
    constructor(props: any) {

        super(props);
        this.state = {
          items:[]
        }
        // props.children = [<Row><Col>Buy</Col><Col>Sell</Col><Col>Strike</Col><Col>Buy</Col><Col>Sell</Col></Row>]
    
      }

      addContractCode(weekCode: string) {
        this.setState({
          items: [...this.state.items, <option value={weekCode}>{weekCode}</option>]
        })
      }
    
      clear(){
        this.setState({
          items: []
        })
      }


    render() {
        return (<select>
          {React.Children.map(this.state.items, child => {
            return child
          })}
        </select>);
      }

}

interface Props {
    children?: React.ReactChild[];
    ref?: any
  }