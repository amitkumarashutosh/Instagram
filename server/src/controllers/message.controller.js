import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";

const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message) {
      return res
        .status(401)
        .json({ message: "Message is required", success: false });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    //stablish conversation
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    // await conversation.save()
    // await newMessage.save()
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json({ newMessage, success: true });
  } catch (error) {
    console.log(error);
  }
};

const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    let conversation = await Conversation.find({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(200).json({ success: true, message: [] });
    }

    return res
      .status(200)
      .json({ success: true, message: conversation.messages });
  } catch (error) {
    console.log(error);
  }
};

export { sendMessage, getMessage };
