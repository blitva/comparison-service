import React from 'react';
import Name from './name.jsx';
import Brand from './brand.jsx';
import Price from './price.jsx';
import Photo from './photo.jsx';
import Rating from './rating.jsx';
import StarRating from './starRating.jsx';

const ItemList = (props) => (
  //should be a table
  //need to filter out photos, name, brand, price, number of ratings, star rating

  <table>
    <tr>
      <th></th>
      {props.photos.map(photo => <Photo photo={photo} />)}
    </tr>
    <br></br>
    <tr>
      <th>Name</th>
      {props.names.map(name => <Name name={name}/>)}
    </tr>
    <br></br>
    <tr>
      <th>Brand</th>
      {props.brands.map(brand => <Brand brand={brand}/>)}
    </tr>
    <br></br>
    <tr>
      <th>Price</th>
      {props.prices.map(price => <Price price={price} />)}
    </tr>
    <br></br>
    <tr>
      <th>Number of Ratings</th>
      {props.ratings.map(rating => <Rating rating={rating} />)}
    </tr>
    <br></br>
    <tr>
      <th>Star Rating</th>
      {props.starRatings.map(starRating => <StarRating starRating={starRating}/>)}
    </tr>
  </table>
);


export default ItemList;