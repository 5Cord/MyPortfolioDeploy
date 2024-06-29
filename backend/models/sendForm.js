import mongoose from "mongoose";

const formFeedback = new mongoose.Schema({
    nameUser: {
        type: String,
        required: true,
    },
    emailUser: {
        type: String,
        required: true,
        unique: true
    },
    messageUser: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
},
)

export default mongoose.model('formFeedback', formFeedback);
