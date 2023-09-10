import { productModel } from '../model/productModel';

export const findAllProduct = () => productModel.find();
// create product
export const createProduct = async(values: Record<string , any>) => {
    return new productModel(values).save().then((product) => product.toObject());
}
// get product for admin
export const getProductofAdmin = (adminId: string) => productModel.find({adminId});
// get product by boxname
export const getProductByBoxName = (boxName: string) => productModel.findOne({boxName});
// get all products
export const getAllProductsService = () => productModel.find();
// get product by id
export const getProductById = (_id: string) => productModel.findById(_id);
// update product
export const updateProductById = (_id: string , values: Record<string , any>) => productModel.findByIdAndUpdate(_id , values ); 
// delete product
export const deleteProductById = (_id: string) => productModel.findByIdAndDelete(_id);