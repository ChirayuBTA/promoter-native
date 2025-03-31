interface ISendOTPRequestBody {
  phone: string;
}

interface IVerifyOTPRequestBody extends ISendOTPRequestBody {
  otp: string;
}
