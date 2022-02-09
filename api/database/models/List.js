const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuid } = require('uuid');
const mongooseHidden = require('mongoose-hidden')({ defaultHidden: { __v: true } })




const ListSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    users: [{ user:{ type: Schema.Types.ObjectId, ref: 'User' }, drinks:[{ type: Schema.Types.ObjectId, ref: 'Drink' }], total: { type: Number, default:0 } }],
    shareId: { type: String, default: uuid, hide: true},
    total: { type: Number, default:0 }
});


ListSchema.plugin(mongooseHidden);

const ListModel = mongoose.model('List', ListSchema);
const EndedListModel = mongoose.model('EndedList', ListSchema);


module.exports = ListModel;
module.exports.EndedList = EndedListModel;
module.exports.ListSchema = ListSchema;

