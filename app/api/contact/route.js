import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { name, email, message } = await request.json()

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['appuafzal777@gmail.com'],
      subject: `🎯 Target Acquired: Message from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 10px;">
          <h1 style="color: #ef4444; margin-bottom: 20px;">🎯 New Target Contact</h1>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
            <p style="margin: 10px 0;"><strong style="color: #ef4444;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #ef4444;">Email:</strong> <a href="mailto:${email}" style="color: #22c55e;">${email}</a></p>
            <p style="margin: 10px 0;"><strong style="color: #ef4444;">Message:</strong></p>
            <p style="margin: 10px 0; padding: 15px; background: #0a0a0a; border-radius: 5px; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
            Sent from your portfolio contact form
          </p>
        </div>
      `
    })

    if (error) {
      console.error('Resend error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: error.message || 'Failed to send email' },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data)

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
