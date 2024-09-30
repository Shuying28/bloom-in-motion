import * as functions from "firebase-functions";
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// Set your SendGrid API key
sgMail.setApiKey("YOUR_SENDGRID_API_KEY");

interface SendEmailData {
    name: string;
    studentID: string;
    campusEmail: string;
    selectedSeats: string[];
    totalPrice: number;
    paymentMethod: string;
}

interface SendEmailResponse {
    success: boolean;
    error?: string;
}

exports.sendEmail = functions.https.onCall((request: functions.https.CallableRequest<SendEmailData>): Promise<SendEmailResponse> => {
    const { name, studentID, campusEmail, selectedSeats, totalPrice, paymentMethod } = request.data;

    const msg = {
        to: campusEmail,
        from: "bloominmotionxxum@gmail.com", // Use the email address or domain you verified with SendGrid
        subject: "Payment Confirmation",
        text: `Hello ${name},

        Thank you for your payment.

        Here are your details:
        Name: ${name}
        Student ID: ${studentID}
        Selected Seats: ${selectedSeats.join(", ")}
        Total Price: ${totalPrice}
        Payment Method: ${paymentMethod}

        Best regards,
        Your Company`,
    };

    return sgMail
        .send(msg)
        .then(() => {
            return { success: true };
        })
        .catch((error: any) => {
            console.error("Error sending email:", error);
            return { success: false, error: error.message };
        });
});
