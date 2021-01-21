const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  book: {
    items: [
      {
        programId: {
          type: Schema.Types.ObjectId,
          ref: "Program",
          required: true
        }
      }
    ]
  },
  resetToken : String,
  resetTokenExpiration : Date,
});

userSchema.methods.addToBook = function (id) {
  const updatedItems = [
    ...this.book.items,
    {
      programId: id,
    }
  ];
  this.book.items = updatedItems;
  return this.save();
};

userSchema.methods.deleteProgram = function(id){
    const updatedItems = this.book.items.filter(function(pro){
    return pro.programId.toString() !== id.toString();
  });
  this.book.items = updatedItems;
  return this.save();
}

module.exports = mongoose.model("User", userSchema);
