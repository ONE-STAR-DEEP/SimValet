"use server"

import { headers } from "next/headers";
import { isRateLimited } from "../rateLimiter";
import { ContactFormData } from "../types/types";
import db from "../dbPool";
import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY!,
});

export const submitContactForm = async (data: ContactFormData, formStart: number) => {
    try {
        const headersList = await headers();

        const forwarded = headersList.get("x-forwarded-for");
        const ip =
            forwarded?.split(",")[0]?.trim() ||
            headersList.get("x-real-ip") ||
            "unknown";

        let score = 0;
        // Rate limit check
        if (isRateLimited(ip)) {
            score += 3;
        }

        const timeTaken = Date.now() - formStart;
        const tooFast = timeTaken < 1500;


        if (data.website) score += 3;
        if (data.idea) score += 3;
        if (tooFast) score += 2;

        if (score >= 3) {
            return { success: true };
        }

        const userAgent = headersList.get("user-agent");

        const query = `
            INSERT INTO contact_messages 
            (first_name, last_name, email, phone, subject, message, ip_address, user_agent)
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const res = await db.execute(query, [
            data.firstName,
            data.lastName,
            data.email,
            data.phone,
            data.subject,
            data.message,
            ip,
            userAgent
        ]);

        await brevo.transactionalEmails.sendTransacEmail({
            subject: "Thank You!",
            sender: {
                name: "SimValet Pvt. Ltd.",
                email: "park@simvalet.com",
            },
            to: [{ email: data.email }],

            htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>SimValet</title>
</head>

<body style="margin:0; padding:0; background:#f9fafb; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px 10px;">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" 
          style="max-width:500px; background:#ffffff; border-radius:12px; padding:28px;">

          <!-- Brand -->
          <tr>
            <td style="text-align:center; padding-bottom:20px;">
              <span style="font-size:22px; font-weight:700; color:#000;">
                Sim<span style="color:#c61047;">Valet</span>
              </span>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="text-align:center;">
              <p style="font-size:20px; font-weight:600; margin:0;">
                Thank you 🙌
              </p>
              <p style="font-size:14px; color:#666; margin-top:8px;">
                We’ve received your request and will contact you shortly.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:20px 0;">
              <div style="height:1px; background:#eee;"></div>
            </td>
          </tr>

          <!-- User Data -->
          <tr>
            <td>
              <p style="font-size:14px; font-weight:600; margin-bottom:10px; color:#111;">
                Your Submission
              </p>

              <table width="100%" style="font-size:14px; color:#333;">

                <tr>
                  <td style="padding:6px 0; color:#888;">Name</td>
                  <td style="padding:6px 0; text-align:right;">
                    ${data.firstName} ${data.lastName}
                  </td>
                </tr>

                <tr>
                  <td style="padding:6px 0; color:#888;">Email</td>
                  <td style="padding:6px 0; text-align:right;">
                    ${data.email}
                  </td>
                </tr>

                <tr>
                  <td style="padding:6px 0; color:#888;">Phone</td>
                  <td style="padding:6px 0; text-align:right;">
                    ${data.phone}
                  </td>
                </tr>

                <tr>
                  <td style="padding:6px 0; color:#888;">Subject</td>
                  <td style="padding:6px 0; text-align:right;">
                    ${data.subject}
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 0; color:#888; vertical-align:top;">
                    Message
                  </td>
                  <td style="padding:10px 0; text-align:right;">
                    ${data.message}
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:20px 0;">
              <div style="height:1px; background:#eee;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center; font-size:12px; color:#888;">
              © ${new Date().getFullYear()} SimValet
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
        });

        await brevo.transactionalEmails.sendTransacEmail({
            subject: "New Enquiry",
            sender: {
                name: "SimValet Pvt. Ltd.",
                email: "park@simvalet.com",
            },
            to: [{ email: "park@simvalet.com" }],

            htmlContent: `
            <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Enquiry - SimValet</title>
</head>

<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px 10px;">

        <!-- Container -->
        <table width="100%" cellpadding="0" cellspacing="0" 
          style="max-width:600px; background:#ffffff; border-radius:10px; padding:24px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:15px;">
              <span style="font-size:20px; font-weight:700; color:#000;">
                Sim<span style="color:#c61047;">Valet</span>
              </span>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td>
              <p style="font-size:18px; font-weight:600; margin:0;">
                📩 New Enquiry Received
              </p>
              <p style="font-size:13px; color:#666; margin-top:5px;">
                A new contact form submission has been received.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:15px 0;">
              <div style="height:1px; background:#eee;"></div>
            </td>
          </tr>

          <!-- User Info -->
          <tr>
            <td>
              <p style="font-size:14px; font-weight:600; margin-bottom:8px;">
                User Details
              </p>

              <table width="100%" style="font-size:14px; color:#333;">

                <tr>
                  <td style="padding:6px 0; color:#888;">Name</td>
                  <td style="padding:6px 0; text-align:right;">
                    ${data.firstName} ${data.lastName}
                  </td>
                </tr>

                <tr>
                  <td style="padding:6px 0; color:#888;">Email</td>
                  <td style="padding:6px 0; text-align:right;">
                    ${data.email}
                  </td>
                </tr>

                <tr>
                  <td style="padding:6px 0; color:#888;">Phone</td>
                  <td style="padding:6px 0; text-align:right;">
                    ${data.phone}
                  </td>
                </tr>

                <tr>
                  <td style="padding:6px 0; color:#888;">Subject</td>
                  <td style="padding:6px 0; text-align:right;">
                    ${data.subject}
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding-top:15px;">
              <p style="font-size:14px; font-weight:600; margin-bottom:6px;">
                Message
              </p>

              <div style="background:#f9fafb; padding:12px; border-radius:6px; font-size:14px; color:#333; line-height:1.5;">
                ${data.message}
              </div>
            </td>
          </tr>

          <!-- Technical Info -->
          <tr>
            <td style="padding-top:20px;">
              <p style="font-size:13px; font-weight:600; margin-bottom:6px; color:#666;">
                Technical Details
              </p>

              <table width="100%" style="font-size:12px; color:#666;">

                <tr>
                  <td style="padding:4px 0;">IP Address</td>
                  <td style="padding:4px 0; text-align:right;">
                    ${ip}
                  </td>
                </tr>

                <tr>
                  <td style="padding:4px 0;">User Agent</td>
                  <td style="padding:4px 0; text-align:right;">
                    ${userAgent}
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:20px; font-size:12px; color:#aaa; text-align:center;">
              SimValet • Internal Notification
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
        });


        return { success: true };

    } catch (error) {
        console.log(error)
        return { success: false }
    }
}