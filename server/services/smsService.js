const sendOtp = async (mobile, otp) => {
  console.log(`\n==============================`);
  console.log(`📱 Mobile : ${mobile}`);
  console.log(`🔐 OTP    : ${otp}`);
  console.log(`==============================\n`);
};

module.exports = {
  sendOtp,
};