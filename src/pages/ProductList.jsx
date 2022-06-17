import React, {Component} from "react";
import {Link} from "react-router-dom";
import Card from "./Card";
import HandleErrors from "./HandleErrors";


export class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            productsToDelete: []
        };

        this.handleMassDelete = this.handleMassDelete.bind(this);
        this.getApplicationProducts = this.getApplicationProducts.bind(this);

    }

    async componentDidMount() {
        await this.getApplicationProducts();
    }

    async getApplicationProducts() {
        const response = await fetch('http://localhost:8080/getAllProducts')
        const data = await response.json()

        console.log("asdf ", this.products)
        this.setState({products: data})
    }


    async handleMassDelete() {

        console.log("received data is ", JSON.stringify(this.state.productsToDelete),)

        fetch('http://localhost:8080/deleteProducts', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.productsToDelete),
            mode: 'no-cors',
        })
            .then((data) => {
                // console.log("received data is ", data,)
                this.setState({status: 'Delete successful',})
            });

        await this.getApplicationProducts();
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

                    <button className="delete-product-btn" onClick={this.handleMassDelete}>MASS DELETE</button>
                </div>
                <hr/>
                <div className="product-list">
                    <HandleErrors>
                        {this.state.products && this.state.products.map(product => {
                            return (
                                <Card key={product.id} sku={product.sku} name={product.name} price={product.price}
                                      Attributes={product.properties} productsToDelete={this.state.productsToDelete}/>
                            );
                        })}
                    </HandleErrors>
                </div>
            </>
        );
    }
}

export default ProductList;
