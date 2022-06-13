import React from "react";

const Card = ({sku, name, price, Attributes}) => {
    return (<div className="product-list__card">
            <input type="checkbox" name="" className="delete-checkbox"/>
            <h2>{sku}</h2>
            <h2>{name}</h2>
            <h2>{price}$</h2>
            <h2>{Attributes.map(e => {
                return (<div >
                        <h3> {e.property} : {e.value} {e.unit} </h3>
                    </div>);
            })}:</h2>
        </div>);
};

export default Card;
