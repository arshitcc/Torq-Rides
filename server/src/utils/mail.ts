import nodemailer from "nodemailer";
import {
  MAILTRAP_SMTP_HOST,
  MAILTRAP_SMTP_PORT,
  MAILTRAP_SMTP_USERNAME,
  MAILTRAP_SMTP_PASSWORD,
  CLIENT_URL,
  COMPANY_NAME,
} from "./env";
import MailGen, { Content } from "mailgen";
import logger from "../loggers/winston.logger";
import { IBooking } from "../models/bookings.model";

interface EmailVerificationTemplate {
  username: string;
  emailVerificationToken: string;
}

interface ResetPasswordTemplate {
  username: string;
  resetPasswordToken: string;
}

interface BookingConfirmationTemplate {
  username: string;
  booking: IBooking;
  totalAmount: number;
}

interface MailConfig {
  email: string;
  subject: string;
  template: Content;
}

const emailVerificationTemplate = ({
  username,
  emailVerificationToken,
}: EmailVerificationTemplate): Content => {
  return {
    body: {
      name: username,
      intro: `Welcome to ${COMPANY_NAME}! We’re excited to have you on board.`,
      action: {
        instructions:
          "To verify your email address, please click the button below:",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: `${CLIENT_URL}/verify?token=${emailVerificationToken}`,
        },
      },
      outro: `If you did not sign up for a ${COMPANY_NAME} account, you can safely ignore this email.`,
    },
  };
};

const resetPasswordTemplate = ({
  username,
  resetPasswordToken,
}: ResetPasswordTemplate): Content => {
  return {
    body: {
      name: username,
      intro:
        "You have requested to reset your password. Click the button below to proceed.",
      action: {
        instructions: "To reset your password, please click the button below:",
        button: {
          color: "#D9534F",
          text: "Reset Your Password",
          link: `${CLIENT_URL}/reset-password?token=${resetPasswordToken}`,
        },
      },
      outro:
        "If you did not request a password reset, no further action is required. Your account is safe.",
    },
  };
};

const bookingConfirmationTemplate = ({
  username,
  booking,
  totalAmount,
}: BookingConfirmationTemplate) => {
  return {
    body: {
      name: username,
      email: "",
      intro: "🎉 Your booking has been confirmed!",
      table: {
        data: booking.items.map((b) => ({
          Motorcycle: b.motorcycle?.make + " " + b.motorcycle?.vehicleModel,
          "Pickup Date": b.pickupDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          "Return Date": b.dropoffDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          Days:
            1 +
            Math.ceil(
              ((b.dropoffDate.getTime() - b.pickupDate.getTime()) /
                1000 ** 60) *
                60 *
                24,
            ),
          "Rate/Day": `INR ${b.motorcycle?.rentPerDay}/-`,
          Quantity: b.quantity,
          "Item Total": `INR ${b.motorcycle?.rentPerDay! * b.quantity * ((b.dropoffDate.getTime() - b.pickupDate.getTime()) / (1000 * 60 * 60 * 24))}/-`,
        })),
        columns: {
          // adjust widths as needed
          customWidth: {
            Motorcycle: "25%",
            "Pickup Date": "15%",
            "Return Date": "15%",
            Days: "10%",
            "Rate/Day": "15%",
            Quantity: "10%",
            "Item Total": "10%",
          },
          customAlignment: {
            "Rate/Day": "right",
            Quantity: "right",
            "Item Total": "right",
          },
        },
      },
      outro: [
        `**Total Booking Cost:** INR ${totalAmount}/-`,
        "If you have any questions, just reply to this email—we’re here to help!",
      ],
    },
  };
};

const sendEmail = async (mailConfig: MailConfig) => {
  const mailGenerator = new MailGen({
    theme: "default",
    product: {
      name: `${COMPANY_NAME}`,
      link: "https://torq-rides.vercel.app",
    },
  });

  const emailHTML = mailGenerator.generate(mailConfig.template);
  const emailText = mailGenerator.generatePlaintext(mailConfig.template);

  const mailer = nodemailer.createTransport({
    host: MAILTRAP_SMTP_HOST,
    port: MAILTRAP_SMTP_PORT,
    auth: {
      user: MAILTRAP_SMTP_USERNAME,
      pass: MAILTRAP_SMTP_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  const emailData = {
    from: "server@gmail.com",
    to: mailConfig.email,
    subject: mailConfig.subject,
    text: emailText,
    html: emailHTML,
  };

  try {
    await mailer.sendMail(emailData);
  } catch (error) {
    /*
      As sending email is not strongly coupled to the business logic it is not worth to raise an error when email sending fails
      So it's better to fail silently rather than breaking the app
    */

    logger.error(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file",
    );
    logger.error("Error: ", error);
  }
};

export {
  sendEmail,
  emailVerificationTemplate,
  resetPasswordTemplate,
  bookingConfirmationTemplate,
};
