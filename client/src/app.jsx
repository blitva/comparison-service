import React from 'react';
import ReactDOM from 'react-dom';
import { Heading } from '../style.js';
import ItemList from './components/itemList.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      ids: [],
      photos: [],
      names: [],
      prices: [],
      brands: [],
      ratings: [],
      starRatings: []
    };
    this.getSimilarItems = this.getSimilarItems.bind(this);
    this.getItemDescription = this.getItemDescription.bind(this);
    this.getItemNames = this.getItemNames.bind(this);
    this.getItemBrands = this.getItemBrands.bind(this);
    this.getPrices = this.getPrices.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
    this.getRatings = this.getRatings.bind(this);
  }

  //get item info
  getItemDescription (productIds) {
    let item1 = productIds[0];
    let item2 = productIds[1];
    let item3 = productIds[2];
    let item4 = productIds[3];
    let item5 = productIds[4];
    let item6 = productIds[5];
    axios.get(`http://ec2-18-217-85-161.us-east-2.compute.amazonaws.com:4004/descriptions/multiple?${item1}=${item1}&${item2}=${item2}&${item3}=${item3}&${item4}=${item4}&${item5}=${item5}&${item6}=${item6}`)
      .then((response) => {
        let itemDescriptions = response.data;
        this.getItemNames(itemDescriptions);
        this.getItemBrands(itemDescriptions);
        this.getPrices();
        this.getPhotos();
        this.getRatings();
      })
      .catch(err => {
        console.log(err);
      });
  }

  //get ItemNames
  getItemNames (items) {
    let itemNames = [];
    for (let i = 0; i < items.length; i++) {
      itemNames.push(items[i].itemName);
    }
    this.setState({
      names: itemNames
    });
  }
  //get Item Brands
  getItemBrands (items) {
    let itemBrands = [];
    for (let i = 0; i < items.length; i++) {
      itemBrands.push(items[i].brand);
    }
    this.setState({
      brands: itemBrands
    });
  }

  //get price
  getPrices () {
    let multipleIds = { ids: this.state.ids};
    axios.post('http://localhost:4003/priceandinventory/id/multiple', multipleIds.ids)
      .then(response => {
        let itemPrices = [];
        for (let i = 0; i < response.data.length; i++) {
          itemPrices.push(response.data[i].price);
        }
        this.setState({prices: itemPrices});
      })
      .catch(err => {
        console.log(err);
      });
  }

  //get photos
  getPhotos () {
    let productIds = { ids: this.state.ids};
    axios.post('http://localhost:4002/photos/product/primary/multiple', productIds.ids)
      .then(response => {
        let itemPhotos = Object.values(response.data);
        this.setState({
          photos: itemPhotos
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  //get ratings
  getRatings () {
    let productIds = this.state.ids;
    for (let i = 0; i < productIds.length; i++) {
      axios.get(`http://localhost:4006/Reviews/getReviewSummary/${productIds[i]}`)
        .then(response => {
          let numOfRatings = response.data.totalRatings;
          let starRating = response.data.averageRating;
          starRating = parseInt(starRating);
          let newRatings = this.state.ratings;
          newRatings.push(numOfRatings);
          let newStarRatings = this.state.starRatings;
          newStarRatings.push(starRating);
          this.setState({
            ratings: newRatings,
            starRatings: newStarRatings
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }


  //get items from comparison/getSimilarItems/comparison
  getSimilarItems (id) {
    let productId = id;
    let productIds = [];
    productIds.push(productId);
    this.setState({
      ids: productIds
    });
    axios.get(`http://localhost:4005/comparison/getSimilarItems/${productId}`)
      .then((response) => {
        let similarIds = response.data;
        this.setState({
          ids: productIds.concat(similarIds)
        });
        this.getItemDescription(this.state.ids);
      })
      .catch(err => {
        console.log(err);
      });
  }

  //get info for each item by sending request to description service, price service


  //componentDidMount shall call getSimilarItems
  componentDidMount () {
    //get productId from url or 1000
    let url = window.location.href;
    let productId = url.split('/')[3] || 1000;
    //call getSimilarItems with productId
    this.getSimilarItems(productId);
  }

  render () {
    return (
      <div>
        <div>
          <Heading>Compare Devices</Heading>
        </div>
        <ItemList names={this.state.names} brands={this.state.brands} prices={this.state.prices} photos={this.state.photos} ratings={this.state.ratings} starRatings={this.state.starRatings}></ItemList>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('comparison'));