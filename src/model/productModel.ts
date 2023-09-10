import { Schema , model } from "mongoose";

const productSchema = new Schema({
    boxName: {
      type: String,
      required: true,
      unique : true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    discription: {
        type: String,
        required: false,
        trim: true,
    },
    thingsToProvide: {
        type: Array,
        items: String,
        required: true,
        trim: true,
        default: [],
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    officeContact : {
        type: Number,
        required: true,
        trim : true,
    },
    priceForAnHour : {
        type : Number,
        required : true,
        trim : true,
    },
    productImages : {
        type : Array,
        items : String,
        require : true,
        trim : true,
    },
    adminId : {
        type : String,
        require : true,
        trim : true,
    }
},
{
    timestamps: true,
}
)

export const productModel = model('products' , productSchema);