import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  ToUserName: {
    type: String,
  },
  FromUserName: {
    type: String,
  },
  CreateTime: {
    type: Number,
  },
  MsgType: {
    type: String,
  },
  MediaId: {
    type: String,
  },
  ThumbMediaId: {
    type: String,
  },
  PicUrl: {
    type: String,
  },
  MsgId: {
    type: Number,
  },
  Content: {
    type: String,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
