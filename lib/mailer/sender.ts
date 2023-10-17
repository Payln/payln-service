import nodemailer from "nodemailer";
import { SentMessageInfo } from "nodemailer";
import logger from "../logger/logger";

// Define an interface for the EmailSender
interface EmailSender {
  sendEmail(
    subject: string,
    content: string,
    to: string[],
    cc: string[],
    bcc: string[],
    attachFiles: string[]
  ): Promise<void>;
}

// Define the GmailSender class that implements the EmailSender interface
class GmailSender implements EmailSender {
  private transporter: nodemailer.Transporter;

  constructor(
    private name: string,
    private fromEmailAddress: string,
    private fromEmailPassword: string
  ) {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: fromEmailAddress,
        pass: fromEmailPassword,
      },
    });
  }

  async sendEmail(
    subject: string,
    content: string,
    to: string[],
    cc: string[],
    bcc: string[],
    attachFiles: string[]
  ): Promise<void> {
    const mailOptions = {
      from: `"${this.name}" <${this.fromEmailAddress}>`,
      to: to.join(", "),
      cc: cc.join(", "),
      bcc: bcc.join(", "),
      subject: subject,
      html: content,
      attachments: attachFiles.map((file) => ({ path: file })),
    };

    try {
      const info: SentMessageInfo = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.response}`);
    } catch (error) {
      throw new Error(`Failed to send email: ${error}`);
    }
  }
}



export default GmailSender;
