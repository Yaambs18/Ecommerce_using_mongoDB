const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addToCart(product) {
    let db = getDb();
    const userCart = this.cart;
    const cartProductIndex = userCart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [ ...this.cart.items ];

    if(cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity = updatedCartItems[cartProductIndex].quantity + 1;
    }
    else{
      const newItem = { productId: new mongodb.ObjectId(product._id), quantity: 1 };
      updatedCartItems.push(newItem);
    }
    const updatedCart = { items: updatedCartItems };
    return db.collection('users').updateOne(
      { _id: new mongodb.ObjectId(this._id )},
      { $set: { cart: updatedCart }}
    );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: new mongodb.ObjectId(userId)})
      .next()
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
