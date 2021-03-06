import ProductList from "./pages/ProductList";
import "./App.css";
import {Route, Routes} from "react-router-dom";
import ProductAdd from "./pages/ProductAdd";
import React, {Component} from "react";



export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applicationData: [],
        };
    }

    async componentWillMount() {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/getApplicationData` , {mode: 'no-cors',})
        const data = await response.json()
        this.setState({applicationData: data})



    }

    render() {
        return (

            <div className="App">
                <Routes>
                    <Route path="/" element={
                        <ProductList/>
                    }

                    />
                    <Route path="/add-product" element={<ProductAdd applicationData = {this.state.applicationData} />}/>
                </Routes>
            </div>
        )
            ;
    }
}

export default App;
