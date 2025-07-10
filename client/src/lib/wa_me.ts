const WA_BASE = "https://wa.me/";
const whatsappNumber = "+919560198483";
const encode = (text: string) => encodeURIComponent(text);

export const sendWhatsappMessage = () => {
  const msg = [
    "Hey *TORQ Rides*",
    "",
    "I have a query about your rental services. Could you please assist me?",
    "",
    "Thanks!",
  ].join("\n");

  const url = `${WA_BASE}${whatsappNumber}?text=${encode(msg)}`;
  return url;
};
