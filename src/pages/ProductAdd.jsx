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
            isposted: false,
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
            // {label: "DVD", value: "dvd"},
            // {label: "Furniture", value: "furniture"},
            // {label: "Book", value: "book"},
        ];
        const tempTextFields = {};
        let applicationDataTemp = {};
        let applicationDataUsed = {};
        if (this.props.applicationData.length == 0) {

            const response2 = await fetch('https://mostafa.osharif.xyz/getApplicationData');
            const data2 = await response2.json()
            // this.setState({applicationData: data2})
            applicationDataTemp = data2;
            console.log("this.props   " , applicationDataTemp)

        } else {

            applicationDataTemp = this.props.applicationData;


        }
        applicationDataTemp.map(e => {

            // typeOptions1.push(
            //     // {label: e.type_name.toString(), value: e.id.toString()}
            //     {label: e.type_name.toString(), value: e.type_name.toString()}
            // );
            applicationDataUsed[e.type_name.toString()]  = e;

            typeOptions1[e.type_name.toString()] = {label: e.type_name.toString(), value: e.type_name.toString()}



            e.properties.map(e1 => {
                this.state.textFields[e1.property] = "";
                this.setState({textFields: this.state.textFields})


            })

        })
        this.setState({typeOptions: typeOptions1})
        this.setState({typeOptionsState: applicationDataUsed})
        // this.state.typeValue == 0 ? 1
        // console.log(
        //     "not nulll ",
        //     // this.state.typeOptionsState  ,
        //     // this.state.typeOptions ,
        //     // applicationDataUsed,
        //     this.state.textFields
        //     )


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
        const typeAttrributes = this.state.typeValue;

        // console.log("handle property value change  ", val, name, typeAttrributes ,   this.state.textFields)

        this.state.textFields[Object.keys(this.state.textFields).find(element => element === name.toString())] = val;

        this.setState({textFields: this.state.textFields})


        // typeAttrributes.length > 0 &&
        // typeAttrributes.some((item) => item.name === name)
        //     ? this.setState((state) => {
        //         const typeAttr = state.typeAttr.map((item) => {
        //             if (item.name === name) {
        //                 return {name, val};
        //             } else {
        //                 return item;
        //             }
        //         });
        //         return {
        //             typeAttr,
        //         };
        //     })
        //     : this.setState((state) => {
        //         const typeAttr = [...state.typeAttr, {name, val}];
        //         return {
        //             typeAttr,
        //         };
        //     });

        let newSKU = `${this.state.name}${this.state.typeValue}${Date.now()}`;
        this.setState({sku: newSKU})
        // console.log("event   ", event.target);


    }

    async handleSubmit(event) {

        event.preventDefault();
        // {console.log("this state typevalue  " ,
        //     this.state.typeValue ,
        //     // this.state.typeOptionsState[   this.state.typeValue > 0 ? this.state.typeValue-1 :this.state.typeValue].properties ,
        //     this.state.typeOptionsState[this.state.typeValue].properties
        //
        // )}
        const type_id = parseInt(this.state.typeOptions[this.state.typeValue].value);
        // const type_properties = this.state.typeOptionsState[type_id - 1].properties
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

            console.log("this state typevalue  ",
                // this.state.typeValue ,
                // type_id,
                this.state.typeOptions[this.state.typeValue],
                typeProperty.id,
                "input value  ",   this.state.textFields[typeProperty.property].length !== 0,
                // this.state.typeOptionsState[   this.state.typeValue > 0 ? this.state.typeValue-1 :this.state.typeValue].properties ,
                this.state.typeOptionsState[this.state.typeValue].properties[0]['type_id']
            )
        }


        const {name, sku, price, typeAttr} = this.state;
        this.setState({isposted: false});
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
                const response = fetch('https://mostafa.osharif.xyz/addProduct', requestOptions)
                // .then(response => response.json())
                // .then(data => {
                //     console.log(data)
                //     this.setState({isposted: true})  name+type+attr
                // });
                const data = await response;
                console.log("post request");
                console.log("post request", data.json());
                this.setState({isposted: true});
            } catch (e) {
                console.log("error happened is ", e)
            }

        }
        else {
            console.log("came here, an error happened" ,    name.length !== 0 &&
                sku.length !== 0 &&
                price.length !== 0 )
        }
    }

    handleTypeSwitching(e) {
        if(e.target.value == null ){
            e.preventDefault();

        }

        this.setState({typeValue: "", typeAttr: [], enteredData: {},});

        this.state.typeValue = e.target.value;

        this.setState({typeValue: this.state.typeValue});
        console.log(e.target.value, "asdf sdfasd fdf asdf", this.state.typeValue)


    }

    render() {
        // console.log(" EEEEEEEEEEEEEEEEEE is ", this.state);

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
                                // inputMode={"numeric"}
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
                                // value={
                                //     this.state.typeValue
                                // }
                                value={`${this.state.typeValue}`}
                                onChange={this.handleTypeSwitching}
                            >
                                {this.state.typeValue}

                                {/*{Object.keys(this.state.typeOptions)}*/}
                                {Object.keys(this.state.typeOptions).map((option, i) => (
                                    <option key={i} id={`#${this.state.typeOptions[option].label}`} value={this.state.typeOptions[option].value}>
                                        {this.state.typeOptions[option].value}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {/*{console.log("error with updating properties     ", this.state.typeValue,  this.state.typeOptionsState)}*/}
                        {this.state.typeValue != 0 ? this.state.typeOptionsState[this.state.typeValue > 0 ? this.state.typeValue - 1 : this.state.typeValue].properties.map(e => {
                            return (
                                <HandleErrors>
                                    <label>
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
                                        {/*{console.log("looking for an element in the array that is the state object ", e.property.toString(), this.state.textFields[Object.keys(this.state.textFields).find(element => element === e.property.toString())] ) }*/}

                                    </label>
                                </HandleErrors>
                            )
                        }) : ""

                        }

                        {/*{this.state.typeValue === "" ? (*/}
                        {/*    ""*/}
                        {/*) : this.state.typeValue === "dvd" ? (*/}

                        {/*    <>*/}
                        {/*        <label>*/}
                        {/*            <p>*/}
                        {/*                Size: <strong>(MB)</strong>*/}
                        {/*            </p>*/}
                        {/*            <input*/}
                        {/*                id="size"*/}
                        {/*                name="price"*/}
                        {/*                onChange={this.handleAttrChange}*/}
                        {/*            />*/}
                        {/*        </label>*/}
                        {/*        <h2>Please provide the DVD size</h2>*/}
                        {/*    </>*/}
                        {/*) : this.state.typeValue === 3 ? (*/}
                        {/*    <>*/}
                        {/*        <label>*/}
                        {/*            <p>*/}
                        {/*                Height:<strong> (CM)</strong>*/}
                        {/*            </p>*/}
                        {/*            <input*/}
                        {/*                id="height"*/}
                        {/*                name="price"*/}
                        {/*                onChange={this.handleAttrChange}*/}
                        {/*            />*/}
                        {/*        </label>*/}
                        {/*        <label>*/}
                        {/*            <p>*/}
                        {/*                width:<strong> (CM)</strong>*/}
                        {/*            </p>*/}
                        {/*            <input*/}
                        {/*                id="width"*/}
                        {/*                name="price"*/}
                        {/*                onChange={this.handleAttrChange}*/}
                        {/*            />*/}
                        {/*        </label>*/}
                        {/*        <label>*/}
                        {/*            <p>*/}
                        {/*                Length:<strong> (CM)</strong>*/}
                        {/*            </p>*/}
                        {/*            <input*/}
                        {/*                id="lenght"*/}
                        {/*                name="price"*/}
                        {/*                onChange={this.handleAttrChange}*/}
                        {/*            />*/}
                        {/*        </label>*/}
                        {/*        <h2>Please provide the furniture dimentions</h2>*/}
                        {/*    </>*/}
                        {/*) : this.state.typeValue === "book" ? (*/}
                        {/*    <>*/}
                        {/*        <label>*/}
                        {/*            <p>*/}
                        {/*                Weight:<strong> (KG)</strong>*/}
                        {/*            </p>*/}
                        {/*            <input*/}
                        {/*                id="weight"*/}
                        {/*                name="price"*/}
                        {/*                onChange={this.handleAttrChange}*/}
                        {/*            />*/}
                        {/*        </label>*/}
                        {/*        <h2>Please provide the book weight</h2>*/}
                        {/*    </>*/}
                        {/*) : (*/}
                        {/*    ""*/}
                        {/*)}*/}
                    </div>
                </form>
            </>
        );
    }
}

export default ProductAdd;
