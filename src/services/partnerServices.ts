import { PartnerModel } from "../model/partnerModel";

// get all partners
export const getPartners = () => PartnerModel.find().select("-password");
// create partners
export const createPartners = async(values: Record<string , any>) => {
    return new PartnerModel(values).save().then((partner) => partner.toObject());
}
//get partner by email
export const getPartnerByEmail = (email: string) => PartnerModel.findOne({email});
// get partner by adminName
export const getPartnerByadminName = (adminName: string) => PartnerModel.findOne({adminName});
// get partner by authtoken
export const getPartnerByAuthToken = (token: string) => PartnerModel.findOne({token});
// get partner by id
export const getPartnerById = (_id: string) => PartnerModel.findById(_id);
// delete partner by id
export const deletePartnerById = (id: string) => PartnerModel.findByIdAndDelete(id);
// update partner by id
export const updatePartnerById = (id: string , values: Record<string , any>) => PartnerModel.findByIdAndUpdate(id , values);
// update password of partner
export const updatePartnerPassword = (id: string , newPassword: string) => PartnerModel.updateOne(
    {_id : id} , {$set : {password : newPassword}}
) 