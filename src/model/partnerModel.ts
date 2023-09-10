import {Schema , model} from "mongoose";

const PartnerSchema = new Schema(
  {
    adminName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required : true,
    },
    confirmPassword: {
      type: String, 
      trim: true,
      select: false,
    },
    profileImage: {
      type: String,
      trim: true,
      required: true,
    },
    officeContact: {
      type: Number,
      required : true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

export const PartnerModel = model("partners", PartnerSchema);
