import { Conversation } from "./../models/conversation.model.js";
import { Message } from "./../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (!newMessage) {
      return res.status(500).json({
        success: false,
        message: "some internal error occour while saving message!",
      });
    }

    // SOCKET FUNCTIONALITY HERE

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await Promise.all([conversation.save(), newMessage.save()]);
    }

    return res.status(201).json({
      success: true,
      message: "successfully send the message!",
      newMessage,
    });
  } catch (error) {
    console.log("ram", error);
    return res.status(500).json({
      success: false,
      message: "Some internal server error!",
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        converation: [],
      });
    }
    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "some internal error occur while getting message!",
    });
  }
};
