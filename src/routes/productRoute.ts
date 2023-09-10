import {Router} from 'express'
import { addProduct, deleteProduct, editProduct, getAllProducts, getProduct } from '../controllers/productcontrollers'
import uploadProductFile from '../middlewares/uploadProductImages'
import { addProductValidationRules, editProductValidationRules } from '../validations/productValidation'
import { fetchPartnerUsingAuthToken } from '../middlewares/fetchPartnerUsingAuthToken'

export default (router: Router) => {
    router.post('/post/addproduct', uploadProductFile, fetchPartnerUsingAuthToken , addProductValidationRules , addProduct)
    router.get('/get/products' , fetchPartnerUsingAuthToken , getProduct);
    router.get('/get/allproducts' , getAllProducts);
    router.patch('/edit/product/:id', uploadProductFile, fetchPartnerUsingAuthToken , editProductValidationRules , editProduct);
    router.delete('/delete/product/:id' , fetchPartnerUsingAuthToken , deleteProduct);
}