import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(20),
  privacy: z.boolean().refine((v) => v === true),
  honeypot: z.string().max(0),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Honeypot-Feld gefüllt → Spam, stillen Erfolg vortäuschen
    if (data.honeypot) {
      return NextResponse.json({ success: true })
    }

    const apiKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL

    if (!apiKey || !contactEmail) {
      console.error('RESEND_API_KEY oder CONTACT_EMAIL nicht gesetzt')
      return NextResponse.json({ error: 'Serverkonfiguration unvollständig' }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'Kontaktformular <kontakt@wunderlich-elektrotechnik.de>',
      to: [contactEmail],
      replyTo: data.email,
      subject: `[Kontaktformular] ${data.subject} – ${data.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a2332; border-bottom: 3px solid #1d6ec8; padding-bottom: 10px;">
            Neue Kontaktanfrage
          </h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 30%;">Name:</td>
              <td style="padding: 8px 0; color: #1f2937;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">E-Mail:</td>
              <td style="padding: 8px 0; color: #1f2937;">
                <a href="mailto:${data.email}" style="color: #1d6ec8;">${data.email}</a>
              </td>
            </tr>
            ${
              data.phone
                ? `<tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Telefon:</td>
              <td style="padding: 8px 0; color: #1f2937;">
                <a href="tel:${data.phone}" style="color: #1d6ec8;">${data.phone}</a>
              </td>
            </tr>`
                : ''
            }
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Betreff:</td>
              <td style="padding: 8px 0; color: #1f2937;">${data.subject}</td>
            </tr>
          </table>

          <div style="background: #f9fafb; border-left: 4px solid #1d6ec8; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <h3 style="color: #1a2332; margin: 0 0 10px 0;">Nachricht:</h3>
            <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.message}</p>
          </div>

          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            Diese E-Mail wurde über das Kontaktformular von wunderlich-elektrotechnik.de gesendet.
            Datenschutz-Einwilligung wurde erteilt.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Formulardaten' }, { status: 400 })
    }

    console.error('Fehler beim E-Mail-Versand:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
