// import React from "react";
// import {Component} from "@types/react";
import React, {Component} from "react";


export class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChekced: false
        };

        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    // componentDidMount() {
    //
    // }
    handleCheckbox() {
        this.state.isChekced = !this.state.isChekced;
        this.setState({isChekced : this.state.isChekced})
        // this.state.isChekced ? this.props.productsToDelete.push(this.props.sku) : this.props.productsToDelete.splice(this.props.productsToDelete.indexOf(this.props.sku), 1)

        if( this.state.isChekced == true ){
            // console.log(" came here 1", );
            this.props.productsToDelete.push(this.props.sku)

        }
        else{
            console.log(" came here 2", );
            const itemIndex = this.props.productsToDelete.indexOf(this.props.sku)
            if (itemIndex > -1 && this.props.productsToDelete.length > 0) {
                // this.props.productsToDelete.splice(index, 1); // 2nd parameter means remove one item only
                this.props.productsToDelete.splice(itemIndex, 1)
                // console.log(" index is ", itemIndex, this.props.productsToDelete[itemIndex] );

            }
        }

        console.log("  array is ", this.props.productsToDelete);

        console.log(" product is ", this.state.isChekced );


        // console.log("current checked are ", this.props.productsToDelete);

    }

    render() {
        return (<div className="product-list__card">
            <input type="checkbox" name="" className="delete-checkbox" defaultChecked={this.state.isChekced}
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

//
// const Card = ({sku, name, price, Attributes, isChecked}) => {
//     return (<div className="product-list__card">
//         <input type="checkbox" name="" className="delete-checkbox"/>
//         <h2>{sku}</h2>
//         <h2>{name}</h2>
//         <h2>{price}$</h2>
//         <h2>{Attributes.map(e => {
//             return (<div>
//                 <h3> {e.property} : {e.value} {e.unit} </h3>
//             </div>);
//         })}:</h2>
//     </div>);
// };

export default Card;
