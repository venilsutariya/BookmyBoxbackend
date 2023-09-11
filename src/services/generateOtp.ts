import otpGenerator from 'otp-generator'

const generateOtp = () => {
    const OTP = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets : false , upperCaseAlphabets: false, specialChars: false });

    return OTP;
}

export default generateOtp;