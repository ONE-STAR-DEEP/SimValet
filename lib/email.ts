'use server';
import jwt from "jsonwebtoken";

import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY!,
});

/* Verification Email */

export const sendEmail = async (name: string, email: string) => {
    try {

        const encodedEmail = Buffer.from(email).toString("base64");

        const token = jwt.sign(
            { encodedEmail },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        const verification_link =
            `https://kt.thavertech.com/api/verify?token=${token}`;


        await brevo.transactionalEmails.sendTransacEmail({
            subject: "Verification Mail",
            sender: {
                name: "KT Travels",
                email: "info@kt.thavertech.com",
            },
            to: [{ email: email }],

            htmlContent: `
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KT Travel - Email Verification</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
            padding: 40px 30px;
            text-align: center;
            color: #ffffff;
        }

        .header-icon {
            font-size: 50px;
            margin-bottom: 15px;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .header p {
            font-size: 14px;
            opacity: 0.95;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 16px;
            color: #333;
            margin-bottom: 20px;
        }

        .message {
            font-size: 14px;
            color: #666;
            margin-bottom: 30px;
        }

        .cta-section {
            margin: 35px 0;
            text-align: center;
        }

        .verify-btn {
            display: inline-block;
            background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
            color: #ffffff;
            padding: 14px 40px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
        }

        .security-info {
            background-color: #f0f9ff;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
            font-size: 13px;
            color: #444;
        }

        .alternative-text {
            font-size: 13px;
            color: #999;
            margin-top: 20px;
        }

        .link-text {
            font-size: 12px;
            color: #2563eb;
            word-break: break-all;
            margin-top: 8px;
            background-color: #f3f4f6;
            padding: 10px;
            border-radius: 4px;
        }

        .footer {
            background-color: #f9fafb;
            padding: 25px 30px;
            border-top: 1px solid #eee;
            text-align: center;
        }

        .footer-text {
            font-size: 12px;
            color: #888;
        }

        .footer-links {
            margin-top: 12px;
            font-size: 12px;
        }

        .footer-links a {
            color: #2563eb;
            text-decoration: none;
            margin: 0 8px;
        }

        .timestamp {
            font-size: 11px;
            color: #bbb;
            margin-top: 10px;
        }

        @media (max-width: 480px) {
            .content {
                padding: 25px 20px;
            }

            .header {
                padding: 30px 20px;
            }
        }
    </style>
</head>

<body>

    <div class="email-container">

        <!-- Header -->
        <div class="header">
            <div class="header-icon">🌍✈️</div>
            <h1>Welcome to KT Travel</h1>
            <p>Your journey begins here</p>
        </div>

        <!-- Content -->
        <div class="content">

            <p class="greeting">Dear ${name},</p>

            <p class="message">
                We’re excited to have you join our B2C travel
                platform, where you can explore, compare, and book the best travel experiences with ease.
            </p>
            <p class="message">
                To activate your account and start exploring, comparing, and booking amazing travel experiences, please
                verify your email address below.
            </p>

            <!-- CTA -->
            <div class="cta-section">
                <a href="${verification_link}" class="verify-btn">
                    Verify My Email
                </a>
            </div>

            <div class="security-info">
                <strong>This verification helps us keep your account secure and ensures you receive important booking
                    updates and travel notifications.</strong><br>
                If you did not create an account with KT Travel, you can safely ignore this email.
            </div>

            <div class="alternative-text">

                <!-- Closing Message -->
                <div style="margin-top: 35px; font-size: 14px; color: #555; line-height: 1.6;">

                    <p style="margin-bottom: 20px;">
                        We look forward to helping you plan your next journey!
                    </p>

                    <p style="margin: 0;">
                        Warm regards,<br>
                        <strong>Team KT Travel</strong><br>
                        <span style="color: #2563eb; font-weight: 500;">Your Travel Partner</span>
                    </p>

                    <div style="margin-top: 18px; font-size: 13px;">
                        🌐 <a href={{website_email}} style="color: #2563eb; text-decoration: none;">
                            {{website_url}}
                        </a>
                        <br>
                        📩 <a href="mailto:{{support_email}}" style="color: #2563eb; text-decoration: none;">
                            {{support_email}}
                        </a>
                        <br>
                        📞 <span style="color: #444;">{{support_phone}}</span>
                    </div>

                </div>

            </div>

        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                KT Travel – Your Trusted Travel Partner
            </p>

            <div class="footer-links">
                <a href="{{website_url}}">Website</a>
                <a href="{{privacy_link}}">Privacy Policy</a>
                <a href="{{terms_link}}">Terms</a>
                <a href="mailto:{{support_email}}">Support</a>
            </div>

            <p class="timestamp">
                © 2026 KT Travel. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
            `,
        });

        return {
            success: true,
            errorCode: "EMAIL_SENT",
            message: "Verification mail has been sent to your email address.",
        };

    } catch (error) {

        console.log(error)

        return {
            success: false,
            errorCode: "EMAIL_FAILED",
            message: "Failed to send verification mail",
        }
    }
}

/* Login OTP Email */
export const sendLoginOtpEmail = async (
    email: string,
    otp: string
) => {

    try {
        await brevo.transactionalEmails.sendTransacEmail({
            subject: "Login OTP Mail",
            sender: {
                name: "KT Travels",
                email: "info@kt.thavertech.com",
            },
            to: [{ email: email }],
            htmlContent: `
          <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f7f9fc;
                line-height: 1.6;
                color: #333;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                text-align: center;
                color: #ffffff;
            }
            
            .header h1 {
                font-size: 28px;
                font-weight: 600;
                margin-bottom: 8px;
            }
            
            .header p {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            
            .greeting {
                font-size: 16px;
                color: #555;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            
            .otp-container {
                margin: 30px 0;
                padding: 30px;
                background: linear-gradient(135deg, #1a1f3a 0%, #2d2e4f 100%);
                border-radius: 8px;
                border: 2px solid #667eea;
            }
            
            .otp-label {
                font-size: 13px;
                color: #a0a0c0;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 12px;
                font-weight: 600;
            }
            
            .otp-code {
                font-size: 42px;
                font-weight: 700;
                color: #ffffff;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                word-spacing: 10px;
                margin: 15px 0;
            }
            
            .otp-info {
                font-size: 12px;
                color: #b0b0d0;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(160, 160, 192, 0.2);
            }
            
            .security-notice {
                margin-top: 30px;
                padding: 15px;
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                border-radius: 4px;
                text-align: left;
                font-size: 13px;
                color: #856404;
            }
            
            .security-notice strong {
                display: block;
                margin-bottom: 8px;
                color: #333;
            }
            
            .instructions {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-top: 25px;
                text-align: left;
                font-size: 14px;
                color: #555;
            }
            
            .instructions h3 {
                font-size: 14px;
                margin-bottom: 12px;
                color: #333;
            }
            
            .instructions ol {
                padding-left: 20px;
            }
            
            .instructions li {
                margin-bottom: 8px;
                color: #666;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                font-size: 12px;
                color: #888;
                border-top: 1px solid #eee;
            }
            
            .footer-links a {
                color: #667eea;
                text-decoration: none;
                margin: 0 10px;
            }
            
            .footer-links a:hover {
                text-decoration: underline;
            }
            
            .divider {
                height: 1px;
                background-color: #eee;
                margin: 20px 0;
            }
            
            .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                margin-top: 20px;
            }
            
            .button:hover {
                opacity: 0.9;
            }
            
            @media (max-width: 600px) {
                .container {
                    border-radius: 0;
                }
                
                .content {
                    padding: 25px 20px;
                }
                
                .header {
                    padding: 30px 15px;
                }
                
                .otp-code {
                    font-size: 32px;
                    letter-spacing: 5px;
                    word-spacing: 5px;
                }
                
                .instructions {
                    font-size: 13px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>🔐 Verify Your Identity</h1>
                <p>Your One-Time Password (OTP)</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                <div class="greeting">
                    Hi there! We've sent you this code to verify your account. This code will expire in <strong>5 minutes</strong>.
                </div>
                
                <!-- OTP Code -->
                <div class="otp-container">
                    <div class="otp-label">Your OTP Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="otp-info">⏱️ Valid for 5 minutes only</div>
                </div>
                
                <!-- Security Notice -->
                <div class="security-notice">
                    <strong>🛡️ Security Alert</strong>
                    Never share this code with anyone, including our team members. We will never ask you for this code via email or phone.
                </div>
                
                <!-- Instructions -->
                <div class="instructions">
                    <h3>How to verify your account:</h3>
                    <ol>
                        <li>Copy the OTP code above</li>
                        <li>Go back to the verification page</li>
                        <li>Paste the code and click "Verify"</li>
                        <li>You're all set!</li>
                    </ol>
                </div>
                
                <!-- Didn't Request This -->
                <div class="divider"></div>
                <div style="font-size: 13px; color: #888;">
                    If you didn't request this code, please <a href="#" style="color: #667eea;">ignore this email</a> or <a href="#" style="color: #667eea;">contact support</a>.
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p style="margin-bottom: 12px;">© 2026 Your Company. All rights reserved.</p>
                <div class="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Contact Support</a>
                </div>
            </div>
        </div>
    </body>
    </html>
        `,
        });

        return {
            success: true,
            message: "OTP Sent"
        }
    } catch (error: any) {
        
        return {
            success: false,
            message: error
        }
    }
};
