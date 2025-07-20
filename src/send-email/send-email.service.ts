import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendEmail(options: { email: string; subject: string; message: string }) {
    try {
      const mailOptions = {
        to: options.email,
        subject: options.subject,
        text: options.message, // استخدام text بدلاً من template
      };

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${options.email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.email}`, error.stack);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}