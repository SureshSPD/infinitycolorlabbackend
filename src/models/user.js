
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const orderInformationSchema = new Schema({
    orderNumber: String,
    date: String,
    salesPerson: String,
    inchargePerson: String,
    clientDetails: String,
    deliveryDate: String,
    status: String,
    finalStatus: String,
  });
  
  const UserSchema = new Schema({
    orderInformation: [orderInformationSchema],
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    accessRole: { type: String, required: true },
    
  });

// const User = mongoose.model("UsersList", UserSchema);
const User = mongoose.model("Loveship", UserSchema);



module.exports = User;