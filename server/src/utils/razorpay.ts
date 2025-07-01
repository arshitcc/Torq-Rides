import Razorpay from "razorpay";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "./env";


let razorpayInstance: Razorpay | undefined;

try {
  razorpayInstance = new Razorpay({
    key_id:    RAZORPAY_KEY_ID,
    key_secret:RAZORPAY_KEY_SECRET,
  });
} catch (error) {
  console.error("RAZORPAY ERROR: ", error);
}

export default razorpayInstance;
