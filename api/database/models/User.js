const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')({ defaultHidden: { __v: true } })
const crypto = require('crypto');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hash: { type: String, hide: true },
    salt: { type: String, hide: true },
    token: { type: String, hide: true },
    total: { type: Number, default:0 }
})

UserSchema.virtual("password")
    .get(() => this.hash)
    .set(function (password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        this.set({ salt: salt, hash: hash });
    })

UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

UserSchema.plugin(mongooseHidden, { virtuals: { password: "hide" } });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
module.exports.UserSchema = UserSchema;
