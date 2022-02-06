const mongoose = require('mongoose');
const { Schema } = mongoose;

const DrinkSchema = new Schema({
    amount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    list: { type: Schema.Types.ObjectId, ref: 'List' }
}, { timestamps: true });

const DrinkModel = mongoose.model('Drink', DrinkSchema);
module.exports = DrinkModel;
