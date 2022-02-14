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

UserSchema.virtual("messageToken")
    .get(function () {
        return this.messagingTokens.reduce((a, b) => {
            const fourMonthsAgo = new Date();
            fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
            if (+fourMonthsAgo < +new Date(b.updatedAt)) {
                a.push(b.token);
            }
            return a;
        }, []);
    })
    .set(function (token) {
        const found = this.messagingTokens.find(t => t.token === token)
        if (found) {
            found.updatedAt = Date.now();
        } else {
            this.messagingTokens.push({ token });
        }
    });

UserSchema.virtual("password")
    .get(() => this.hash)
    .set(function (password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        this.set({ salt: salt, hash: hash });
    })

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

UserSchema.plugin(mongooseHidden, { virtuals: { password: "hide", messageTokens: "hide" }, hidden: { messagingTokens: true } });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
module.exports.UserSchema = UserSchema;
