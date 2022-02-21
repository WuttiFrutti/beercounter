const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')({ defaultHidden: { __v: true } })
const crypto = require('crypto');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hash: { type: String, hide: true },
    salt: { type: String, hide: true },
    total: { type: Number, default: 0 },
    tokens: [{
        type: new Schema(
            {
                token: { type:String, required: true },
                messageToken: { type:String },
                expire: { type:Boolean, required: true }
            },
            { timestamps: true }
        )
    }]
});   

UserSchema.virtual("password")
    .get(() => this.hash)
    .set(function (password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        this.set({ salt: salt, hash: hash });
    });

UserSchema.methods.getTokens = function () {
    return this.tokens.filter((token) => !(token.expire && (Date.now() - Date.parse(token.updatedAt)) > process.env.SESSION_REFRESH_TIME))
}

UserSchema.methods.getMessageTokens = function () {
    return this.tokens.reduce((a, token) => {
        if(token.messageToken !== undefined && !(token.expire && (Date.now() - Date.parse(token.updatedAt)) > process.env.SESSION_REFRESH_TIME)){
            a.push(token.messageToken);
        }
        return a;
    },[])
}

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

UserSchema.plugin(mongooseHidden, { virtuals: { password: "hide", messageTokens: "hide" }, hidden: { messagingTokens: true } });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
module.exports.UserSchema = UserSchema;
