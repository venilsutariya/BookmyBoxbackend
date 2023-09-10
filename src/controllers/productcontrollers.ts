import {Request , Response} from 'express'
import {validationResult} from 'express-validator';
import { createProduct, deleteProductById, getAllProductsService, getProductByBoxName, getProductById, getProductofAdmin, updateProductById } from '../services/productServices';
import fs from 'fs';

// for add product
export const addProduct = async(req: any , res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ isSuccess: false, errors: errors.array()});
        }
        const {boxName , address , location , city , state , thingsToProvide , priceForAnHour , officeContact} = req.body;
        if(!(boxName && address && location && city && state && thingsToProvide && priceForAnHour && officeContact)){
            return res.status(400).json({isSuccess : false , message : 'all fields are require'});
        }
        const existedBoxName = await getProductByBoxName(boxName);
        if(existedBoxName){
            return res.status(400).json({isSuccess : false , message : 'this boxName already exist'});
        }
        const files = req.files
        if(!files || files.length === 0){
            return res.status(400).json({isSuccess : false , message : 'image is require'});
        }
        const filePaths = [];
        for(const file of files){
            filePaths.push("http://localhost:"+process.env.PORT+'/productImages/'+file?.originalname);
        }
        await createProduct({
            boxName , address , city , state , location , thingsToProvide , priceForAnHour , officeContact , adminId : req.partner.id , productImages : filePaths
        });
        res.status(200).json({isSuccess : true , message : 'product add successfully'}).end();
    } catch (error) {
        console.log({error});
        return res.status(500).send({message : 'internal server error.'});
    }
};

// for get product of admin
export const getProduct = async(req: any , res: Response) => {
    try {
        const adminProducts =  await getProductofAdmin(req.partner.id);
        res.status(200).json({isSuccess : true , message : 'product get successFully' , products : adminProducts})
    } catch (error) {
       console.log({error});
       return res.status(500).send({message : 'internal server error.'});
    }
}

// for get all product
export const getAllProducts = async(req: Request , res: Response) => {
    try {
        const {bookmyboxname , bookmyboxpassword} = req.body;
        if(!bookmyboxname || !bookmyboxpassword){
            return res.status(400).json({isSuccess : false , message : 'ourusername and ourpassword require'});
        }
        if(bookmyboxname === process.env.ourusername && bookmyboxpassword === process.env.ourpassword){
            const getAllProduct = await getAllProductsService();
            return res.status(200).json({isSuccess : true , message : 'products get successfully' , allProducts : getAllProduct}).end();
        }
        return res.status(401).json({isSuccess : false , message : 'not allowed'}).end();
    } catch (error) {
       console.log({error});
       return res.status(500).send({message : 'internal server error.'});   
    }
}

// for edit product
export const editProduct = async(req: Request , res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ isSuccess: false, errors: errors.array()});
        }
        if(!req.params.id){
            return res.status(400).json({ isSuccess: false, message : 'id of product is require' });
        }
        const currentProduct = await getProductById(req.params.id);
        if(!currentProduct){
            return res.status(400).json({ isSuccess: false, message : 'product with this id not found' });
        }
        const editProductObj = req.body;
        const newFilePaths = [];
        const files = req.files
        if(Array.isArray(files)){
            for(const file of files){
                newFilePaths.push("http://localhost:"+process.env.PORT+'/productImages/'+file?.originalname);
            }
            currentProduct.productImages.forEach((productImage) => {
                fs.unlinkSync('src/uploads/'+productImage.split(process.env.PORT+'/')[1]);    
            })
            editProductObj.productImages = newFilePaths;
        } else{
            console.log(currentProduct.productImages);
            editProductObj.productImages = currentProduct.productImages;
        }
        const editedProduct = await updateProductById(req.params.id , editProductObj);
        res.status(200).json({isSuccess : true , message : 'product updated successFully'});
    } catch (error) {
       console.log({error});
       return res.status(500).send({message : 'internal server error.'});       
    }
}

// for remove product
export const deleteProduct = async(req: Request , res: Response) => {
    try {
        if(!req.params.id || req.params.id.length !== 24){
            return res.status(400).json({ isSuccess: false, message : 'product id is require or should be valid' });
        }
        const productExist = await getProductById(req.params.id);
        if(!productExist){
            return res.status(400).json({ isSuccess: false, message : 'product with this id not found' });
        }
        await deleteProductById(req.params.id);
        res.status(200).json({ isSuccess: true, message : 'deleted Successfully' });
    } catch (error) {
        console.log({error});
        return res.status(500).send({message : 'internal server error.'});       
    }
}