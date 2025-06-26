import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  ToUserName: String,
  FromUserName: String,
  MsgType: String,
  Content: String,
  CreateTime: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("User", messageSchema);

export default Message;
