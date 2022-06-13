import React, {Component} from "react";
import {Link} from "react-router-dom";
import Card from "./Card";
import HandleErrors from "./HandleErrors";


export class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
        };
    }

    async componentDidMount() {
        const response = await fetch('http://localhost:8080/getAllProducts')
        const data = await response.json()
        console.log("asdf ", this.products)
        this.setState({products: data})
    }

    render() {
        return (
            <>
                <div className="header">
                    <header>
                        <h1>Product List</h1>
                    </header>

                    <Link className="add-product-btn" to="/add-product">
                        <button>ADD</button>
                    </Link>

                    <button className="delete-product-btn">MASS DELETE</button>
                </div>
                <hr/>
                <div className="product-list">
                    <HandleErrors>
                        {this.state.products && this.state.products.map(product => {
                            return (
                                <Card key ={product.id} sku={product.sku} name={product.name} price={product.price} Attributes={product.properties}/>
                            );
                        })}
                    </HandleErrors>
                </div>
            </>
        );
    }
}

export default ProductList;
