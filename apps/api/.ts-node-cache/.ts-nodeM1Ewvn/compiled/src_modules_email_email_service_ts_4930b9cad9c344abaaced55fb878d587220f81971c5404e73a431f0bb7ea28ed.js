"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.example.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            name: process.env.SMTP_EHLO_DOMAIN, // Optional: useful for EHLO/HELO
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendEmail(to, subject, html, text) {
        const info = await this.transporter.sendMail({
            from: process.env.SMTP_FROM || '"MeetEzri" <noreply@meetezri.com>',
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>?/gm, ''), // fallback text generation
        });
        return info;
    }
}
exports.EmailService = EmailService;
exports.emailService = new EmailService();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9lbWFpbC9lbWFpbC5zZXJ2aWNlLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9tb2R1bGVzL2VtYWlsL2VtYWlsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQW9DO0FBRXBDLE1BQWEsWUFBWTtJQUd2QjtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsb0JBQVUsQ0FBQyxlQUFlLENBQUM7WUFDNUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLGtCQUFrQjtZQUNqRCxJQUFJLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQztZQUM5QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEtBQUssTUFBTSxFQUFFLHNDQUFzQztZQUNsRixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxpQ0FBaUM7WUFDckUsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVM7Z0JBQzNCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVM7YUFDNUI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFVLEVBQUUsT0FBZSxFQUFFLElBQVksRUFBRSxJQUFhO1FBQ3RFLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7WUFDM0MsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLG1DQUFtQztZQUNsRSxFQUFFO1lBQ0YsT0FBTztZQUNQLElBQUk7WUFDSixJQUFJLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFLDJCQUEyQjtTQUMxRSxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQTFCRCxvQ0EwQkM7QUFFWSxRQUFBLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5vZGVtYWlsZXIgZnJvbSAnbm9kZW1haWxlcic7XG5cbmV4cG9ydCBjbGFzcyBFbWFpbFNlcnZpY2Uge1xuICBwcml2YXRlIHRyYW5zcG9ydGVyOiBub2RlbWFpbGVyLlRyYW5zcG9ydGVyO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudHJhbnNwb3J0ZXIgPSBub2RlbWFpbGVyLmNyZWF0ZVRyYW5zcG9ydCh7XG4gICAgICBob3N0OiBwcm9jZXNzLmVudi5TTVRQX0hPU1QgfHwgJ3NtdHAuZXhhbXBsZS5jb20nLFxuICAgICAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuU01UUF9QT1JUIHx8ICc1ODcnKSxcbiAgICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuU01UUF9TRUNVUkUgPT09ICd0cnVlJywgLy8gdHJ1ZSBmb3IgNDY1LCBmYWxzZSBmb3Igb3RoZXIgcG9ydHNcbiAgICAgIG5hbWU6IHByb2Nlc3MuZW52LlNNVFBfRUhMT19ET01BSU4sIC8vIE9wdGlvbmFsOiB1c2VmdWwgZm9yIEVITE8vSEVMT1xuICAgICAgYXV0aDoge1xuICAgICAgICB1c2VyOiBwcm9jZXNzLmVudi5TTVRQX1VTRVIsXG4gICAgICAgIHBhc3M6IHByb2Nlc3MuZW52LlNNVFBfUEFTUyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzZW5kRW1haWwodG86IHN0cmluZywgc3ViamVjdDogc3RyaW5nLCBodG1sOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBpbmZvID0gYXdhaXQgdGhpcy50cmFuc3BvcnRlci5zZW5kTWFpbCh7XG4gICAgICBmcm9tOiBwcm9jZXNzLmVudi5TTVRQX0ZST00gfHwgJ1wiTWVldEV6cmlcIiA8bm9yZXBseUBtZWV0ZXpyaS5jb20+JyxcbiAgICAgIHRvLFxuICAgICAgc3ViamVjdCxcbiAgICAgIGh0bWwsXG4gICAgICB0ZXh0OiB0ZXh0IHx8IGh0bWwucmVwbGFjZSgvPFtePl0qPj8vZ20sICcnKSwgLy8gZmFsbGJhY2sgdGV4dCBnZW5lcmF0aW9uXG4gICAgfSk7XG4gICAgcmV0dXJuIGluZm87XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGVtYWlsU2VydmljZSA9IG5ldyBFbWFpbFNlcnZpY2UoKTtcbiJdfQ==