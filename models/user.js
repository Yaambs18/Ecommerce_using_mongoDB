const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true}, 
        quantity: { type: Number, required: true}
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
    const userCart = this.cart;
    const cartProductIndex = userCart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [ ...this.cart.items ];
    if(cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity = updatedCartItems[cartProductIndex].quantity + 1;
    }
    else{
      const newItem = { productId: product._id, quantity: 1 };
      updatedCartItems.push(newItem);
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteCartItem = function(prodId) {
    const userCart = this.cart;
    const updatedCartItems = userCart.items.filter(cp => {
      return cp.productId.toString() !== prodId.toString();
    });

    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = { items: []};
  return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addToCart(product) {
//     let db = getDb();
//     const userCart = this.cart;
//     const cartProductIndex = userCart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     const updatedCartItems = [ ...this.cart.items ];

//     if(cartProductIndex >= 0) {
//       updatedCartItems[cartProductIndex].quantity = updatedCartItems[cartProductIndex].quantity + 1;
//     }
//     else{
//       const newItem = { productId: new mongodb.ObjectId(product._id), quantity: 1 };
//       updatedCartItems.push(newItem);
//     }
//     const updatedCart = { items: updatedCartItems };
//     return db.collection('users').updateOne(
//       { _id: new mongodb.ObjectId(this._id )},
//       { $set: { cart: updatedCart }}
//     );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(
//       (cartProduct) => {
//         return cartProduct.productId
//       }
//     );
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then( products => {
//         return products.map((prod) => {
//           return {
//             ...prod,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === prod._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   deleteCartItem(prodId) {
//     let db = getDb();
//     const userCart = this.cart;
//     const updatedCartItems = userCart.items.filter(cp => {
//       return cp.productId.toString() !== new mongodb.ObjectId(prodId).toString();
//     });

//     const updatedCart = { items: updatedCartItems };
//     return db.collection('users').updateOne(
//       { _id: new mongodb.ObjectId(this._id )},
//       { $set: { cart: updatedCart }}
//     );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items : [] };
//         return db
//           .collection("users")
//           .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({'user._id': new mongodb.ObjectId(this._id)})
//       .toArray()
//       .then(products => {
//         console.log(products)
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .find({ _id: new mongodb.ObjectId(userId)})
//       .next()
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
