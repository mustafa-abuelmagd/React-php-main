import React, {Component} from "react";


export class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false
        };

        this.handleCheckbox = this.handleCheckbox.bind(this);
    }
    handleCheckbox() {
        this.state.isChecked = !this.state.isChecked;
        this.setState({isChecked : this.state.isChecked})
        if( this.state.isChecked === true ){
            this.props.productsToDelete.push(this.props.sku)
        }
        else{
            const itemIndex = this.props.productsToDelete.indexOf(this.props.sku)
            if (itemIndex > -1 && this.props.productsToDelete.length > 0) {
                this.props.productsToDelete.splice(itemIndex, 1)
            }
        }
    }

    render() {
        return (<div className="product-list__card">
            <input type="checkbox" name="" className="delete-checkbox" defaultChecked={this.state.isChecked}
                   onChange={this.handleCheckbox}/>
            <h2>{this.props.sku}</h2>
            <h2>{this.props.name}</h2>
            <h2>{this.props.price}$</h2>
            <h2>{this.props.Attributes.map(e => {
                return (<div>
                    <h3> {e.property} : {e.value} {e.unit} </h3>
                </div>);
            })}</h2>
        </div>);
    }
}
export default Card;
