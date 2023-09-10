import {Router} from "express";
import { editPartner, forgotPartnerPassword, getAllPartners, getPartner, logoutPartner, partnerLogin, partnerRegister, resetPartnerPassword } from "../controllers/partnerAuthenticationController";
import uploadFile from "../middlewares/uploadImage";
import { forgotPasswordValidationRules, loginPartnerValidationRules, registrationPartnerValidationRules, resetPasswordValidationRules, updatePartnerValidationRules } from "../validations/partnerValidation";
import { fetchPartnerUsingAuthToken } from "../middlewares/fetchPartnerUsingAuthToken";

export default (router: Router) => {
    router.post('/partner/register' , uploadFile , registrationPartnerValidationRules , partnerRegister);
    router.post('/partner/login' , loginPartnerValidationRules , partnerLogin);
    router.get('/partner/get' , fetchPartnerUsingAuthToken , getPartner);
    router.get('/getallpartners' , getAllPartners);
    router.patch('/editpartnerbyid/id=:partnerid', uploadFile , updatePartnerValidationRules, fetchPartnerUsingAuthToken , editPartner);
    router.delete('/logoutpartner' , logoutPartner);
    router.post('/forgotpassword/partner' ,forgotPasswordValidationRules , forgotPartnerPassword);
    router.get('/resetPartnerPassword/:id/:token', resetPasswordValidationRules , resetPartnerPassword);
};