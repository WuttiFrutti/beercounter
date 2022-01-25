const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuid } = require('uuid');
const mongooseHidden = require('mongoose-hidden')({ defaultHidden: { __v: true } })


const DrinkSchema = new Schema({
    amount:{ type:Number, required: true },
},{ timestamps:true });

const ListSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    users: [{ user:{ type: Schema.Types.ObjectId, ref: 'User' }, drinks:[DrinkSchema] }],
    shareId: { type: String, default: uuid, hide: true}
});


ListSchema.plugin(mongooseHidden);

const ListModel = mongoose.model('List', ListSchema);
const DrinkModel = mongoose.model('Drink', DrinkSchema);
const EndedListModel = mongoose.model('EndedList', ListSchema);


module.exports = ListModel;
module.exports.EndedList = EndedListModel;
module.exports.Drink = DrinkModel;
module.exports.ListSchema = ListSchema;

