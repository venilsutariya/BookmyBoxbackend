import {Router} from "express";
import { editPartner, forgotPartnerPassword, forgotPassOtpValidation, getAllPartners, getPartner, logoutPartner, otpValidationPartner, partnerLogin, partnerRegister, resetPartnerPassword, sendOtpToPartner } from "../controllers/partnerAuthenticationController";
import uploadFile from "../middlewares/uploadImage";
import { forgotPasswordValidationRules, loginPartnerValidationRules, registrationPartnerValidationRules, resetPasswordValidationRules, sendOtpToPartnerValidationRules, updatePartnerValidationRules } from "../validations/partnerValidation";
import { fetchPartnerUsingAuthToken } from "../middlewares/fetchPartnerUsingAuthToken";

export default (router: Router) => {
    router.post('/send/otptopartner', sendOtpToPartnerValidationRules , sendOtpToPartner)
    router.post('/validate/otptopartner' , otpValidationPartner)
    router.post('/partner/register' , uploadFile , registrationPartnerValidationRules , partnerRegister);
    router.post('/partner/login' , loginPartnerValidationRules , partnerLogin);
    router.get('/partner/get' , fetchPartnerUsingAuthToken , getPartner);
    router.post('/getallpartners' , getAllPartners);
    router.patch('/editpartnerbyid/id=:partnerid', uploadFile , updatePartnerValidationRules, fetchPartnerUsingAuthToken , editPartner);
    router.delete('/logoutpartner' , logoutPartner);
    router.post('/forgotpassword/partner' ,forgotPasswordValidationRules , forgotPartnerPassword);
    router.post('/forgotpassword/otpvalidation' , forgotPassOtpValidation);
    router.post('/resetPartnerPassword/:id/:token', resetPasswordValidationRules , resetPartnerPassword);
};