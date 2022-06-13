import React, {Component} from "react";
import {Link, Navigate} from "react-router-dom";

export class ProductAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            sku: "",
            price: "",
            typeValue: "",
            typeAttr: [],
            isposted: false,
        };

        this.handleHeadingChange = this.handleHeadingChange.bind(this);
        this.handleAttrChange = this.handleAttrChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTypeSwitching = this.handleTypeSwitching.bind(this);
    }


    handleHeadingChange(event) {
        const Val = event.target.value;
        const name = event.target.name;
        name === "name"
            ? this.setState({name: Val})
            : name === "sku"
                ? this.setState({sku: Val})
                : this.setState({price: Val});
    }

    handleAttrChange(event) {
        const val = event.target.value;
        const name = event.target.id;
        const typeAttrributes = this.state.typeAttr;

        typeAttrributes.length > 0 &&
        typeAttrributes.some((item) => item.name === name)
            ? this.setState((state) => {
                const typeAttr = state.typeAttr.map((item) => {
                    if (item.name === name) {
                        return {name, val};
                    } else {
                        return item;
                    }
                });
                return {
                    typeAttr,
                };
            })
            : this.setState((state) => {
                const typeAttr = [...state.typeAttr, {name, val}];
                return {
                    typeAttr,
                };
            });
    }

    async handleSubmit(event) {
        const {name, sku, price, typeAttr} = this.state;
        event.preventDefault();
        this.setState({isposted: false});
        if (
            name.length !== 0 &&
            sku.length !== 0 &&
            price.length !== 0 &&
            typeAttr.length !== 0
        ) {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                        "SKU": sku,
                        "name": name,
                        "price": price,
                        "type": 2,
                        "productProperties": [


                            {
                                "type_id": 2,
                                "property_id": 1,
                                "value": 5
                            }
                        ]
                    },
                ),
                mode: 'no-cors',

            };

            const response = await fetch('http://localhost:8080/addProduct', requestOptions);
            const data = await response.json();
            await console.log("post request");
            this.setState({isposted: true});
        }
    }

    handleTypeSwitching(e) {
        this.setState({typeValue: e.target.value, typeAttr: []});
    }

    render() {
        const typeOptions = [
            {label: "", value: ""},
            {label: "DVD", value: "dvd"},
            {label: "Furniture", value: "furniture"},
            {label: "Book", value: "book"},
        ];
        return (
            <>
                {this.state.isposted && <Navigate to="/"/>}
                <form id="product_form" onSubmit={this.handleSubmit}>
                    <div className="header">
                        <header>
                            <h1>Product Add</h1>
                        </header>

                        <button className="save-product-btn" type="submit" value="Submit">
                            Save
                        </button>
                        <Link className="cancel-product-btn" to="/">
                            <button type="reset">Cancel</button>
                        </Link>
                    </div>
                    <hr/>
                    <div className="form-header">
                        <label>
                            <p>SKU:</p>
                            <input
                                id="sku"
                                name="sku"
                                type="text"
                                value={this.state.sku}
                                onChange={this.handleHeadingChange}
                            />
                        </label>

                        <label>
                            <p> Name:</p>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={this.state.name}
                                onChange={this.handleHeadingChange}
                            />
                        </label>

                        <label>
                            <p>Price:</p>
                            <input
                                id="price"
                                name="price"
                                type="text"
                                value={this.state.price}
                                onChange={this.handleHeadingChange}
                            />
                        </label>
                    </div>
                    <div className="form-typeAttr">
                        <label className="form-typeAttr__switcher ">
                            Type Switcher
                            <select
                                id="productType"
                                value={
                                    this.state.typeValue.length > 0 ? this.state.typeValue : ""
                                }
                                onChange={this.handleTypeSwitching}
                            >
                                {typeOptions.map((option, i) => (
                                    <option key={i} id={option.label} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {this.state.typeValue === "" ? (
                            ""
                        ) : this.state.typeValue === "dvd" ? (
                            <>
                                <label>
                                    <p>
                                        Size: <strong>(MB)</strong>
                                    </p>
                                    <input
                                        id="size"
                                        name="price"
                                        onChange={this.handleAttrChange}
                                    />
                                </label>
                                <h2>Please provide the DVD size</h2>
                            </>
                        ) : this.state.typeValue === "furniture" ? (
                            <>
                                <label>
                                    <p>
                                        Height:<strong> (CM)</strong>
                                    </p>
                                    <input
                                        id="height"
                                        name="price"
                                        onChange={this.handleAttrChange}
                                    />
                                </label>
                                <label>
                                    <p>
                                        width:<strong> (CM)</strong>
                                    </p>
                                    <input
                                        id="width"
                                        name="price"
                                        onChange={this.handleAttrChange}
                                    />
                                </label>
                                <label>
                                    <p>
                                        Length:<strong> (CM)</strong>
                                    </p>
                                    <input
                                        id="lenght"
                                        name="price"
                                        onChange={this.handleAttrChange}
                                    />
                                </label>
                                <h2>Please provide the furniture dimentions</h2>
                            </>
                        ) : this.state.typeValue === "book" ? (
                            <>
                                <label>
                                    <p>
                                        Weight:<strong> (KG)</strong>
                                    </p>
                                    <input
                                        id="weight"
                                        name="price"
                                        onChange={this.handleAttrChange}
                                    />
                                </label>
                                <h2>Please provide the book weight</h2>
                            </>
                        ) : (
                            ""
                        )}
                    </div>
                </form>
            </>
        );
    }
}

export default ProductAdd;
