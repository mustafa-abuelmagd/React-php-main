import React, {Component} from "react";
import {Link, Navigate} from "react-router-dom";
import HandleErrors from "./HandleErrors";


export class ProductAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            sku: "",
            price: "",
            typeValue: "",
            typeAttr: [],
            typeOptionsState: this.props.applicationData,
            typeOptions: [],
            isPosted: false,
            enteredData: {},
            textFields: {}

        };

        // this.state.typeOptionsState = this.props.applicationData;
        this.handleHeadingChange = this.handleHeadingChange.bind(this);
        this.handleAttrChange = this.handleAttrChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTypeSwitching = this.handleTypeSwitching.bind(this);
    }


    async componentWillMount() {
        const typeOptions1 = [
            {label: "", value: ""},
        ];
        let applicationDataTemp = {};
        let applicationDataUsed = {};
        if (this.props.applicationData.length === 0) {
            const response2 = await fetch('https://mostafa.osharif.xyz/getApplicationData');
            applicationDataTemp = await response2.json()
        } else {
            applicationDataTemp = this.props.applicationData;
        }
        applicationDataTemp.map(e => {
            applicationDataUsed[e.type_name.toString()]  = e;
            typeOptions1[e.type_name.toString()] = {label: e.type_name.toString(), value: e.type_name.toString()}
            e.properties.map(e1 => {
                this.state.textFields[e1.property] = "";
                this.setState({textFields: this.state.textFields})
            })

        })
        this.setState({typeOptions: typeOptions1})
        this.setState({typeOptionsState: applicationDataUsed})
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
        event.preventDefault();

        const val = event.target.value;
        const name = event.target.id;
        this.state.textFields[Object.keys(this.state.textFields).find(element => element === name.toString())] = val;

        this.setState({textFields: this.state.textFields})
        let newSKU = `${this.state.name}${this.state.typeValue}${Date.now()}`;
        this.setState({sku: newSKU})
    }

    async handleSubmit(event) {
        event.preventDefault();
        const type_id = parseInt(this.state.typeOptions[this.state.typeValue].value);
        const type_properties = this.state.typeOptionsState[this.state.typeValue].properties
        const productProperties = [];
        let inputFieldsNotEmpty = true;

        for (const typeProperty of type_properties) {
            inputFieldsNotEmpty &= this.state.textFields[typeProperty.property].length !== 0
            productProperties.push({
                "type_id": this.state.typeOptionsState[this.state.typeValue].properties[0]['type_id'],
                "property_id": typeProperty.id,
                "value": this.state.textFields[typeProperty.property]
            })
        }


        const {name, sku, price} = this.state;
        this.setState({isPosted: false});
        if (
            name.length !== 0 &&
            sku.length !== 0 &&
            price.length !== 0 &&
            inputFieldsNotEmpty
        ) {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                        "SKU": sku,
                        "name": name,
                        "price": price,
                        "type": type_id,
                        "productProperties": productProperties
                    }
                ),
                mode: 'no-cors',

            };

            try {
                const response = fetch(process.env.BACKEND_SERVER+'/addProduct', requestOptions)
                const data = await response;
                this.setState({isPosted: true});
            } catch (e) {
            }
        }
    }

    handleTypeSwitching(e) {
        if(e.target.value == null ){
            e.preventDefault();
        }
        this.setState({typeValue: "", typeAttr: [], enteredData: {},});
        this.state.typeValue = e.target.value;
        this.setState({typeValue: this.state.typeValue});
    }
    render() {
        return (
            <>
                {this.state.isPosted && <Navigate to="/"/>}
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

                                type="number"

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
                                value={`${this.state.typeValue}`}
                                onChange={this.handleTypeSwitching}
                            >
                                {this.state.typeValue}
                                {Object.keys(this.state.typeOptions).map((option, i) => (
                                    <option key={i} id={`${this.state.typeOptions[option].label}`} value={this.state.typeOptions[option].value}>
                                        {this.state.typeOptions[option].value}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {this.state.typeValue != 0 ? this.state.typeOptionsState[this.state.typeValue > 0 ? this.state.typeValue - 1 : this.state.typeValue].properties.map(e => {
                            return (
                                <HandleErrors>
                                    <label key={e.property}>
                                        <p>
                                            {e.property}: <strong>({e.unit})</strong>
                                        </p>
                                        <input
                                            id={e.property}
                                            name={e.property}
                                            type="number"

                                            value={this.state.textFields[Object.keys(this.state.textFields).find(element => element === e.property.toString())]}
                                            onChange={this.handleAttrChange}
                                        />
                                    </label>
                                </HandleErrors>
                            )
                        }) : ""

                        }
                    </div>
                </form>
            </>
        );
    }
}

export default ProductAdd;
