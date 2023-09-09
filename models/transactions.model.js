const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema(
  {
    //every transaction is linked with a user
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", //FOREIGN KEY!!
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    transaction_type: {
      type: String,
      required: true,
      enum: ["income", "expense"], // transaction_type can ONLY hold TWO VALUES, income and expense    },
      // and because of enum, if you oprovide another string it will throw a validation exception
    },
    //So we want to ask the user what is this transaction about?
    remarks: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const transactionsModel = mongoose.model("transactions", transactionsSchema);

module.exports = transactionsModel;
