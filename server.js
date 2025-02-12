const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
})

// Demo request API
app.post("/demo", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message, demoProducts } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !message || !demoProducts || demoProducts.length === 0) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Email content for the user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Requesting a Demo!",
      text: `
        Hi ${firstName},
    
        Thank you for reaching out to us! We have received your demo request and our team will get back to you shortly.
    
        Here are the details of your request:
        - Name: ${firstName} ${lastName}
        - Email: ${email}
        - Phone: ${phone}
        - Message: ${message}
        - Demo Products: ${demoProducts.join(", ")}
    
        If you have any urgent queries, feel free to reply to this email.
    
        Best regards,  
        Opsin
      `,
    }

    // Send email to user
    await transporter.sendMail(userMailOptions)

    res.status(201).json({ message: "Demo request submitted successfully" })
  } catch (error) {
    console.error("Error processing demo request:", error)
    res.status(500).json({ error: "An error occurred while processing your request" })
  }
})

// Contact form API
app.post("/contact", async (req, res) => {
  try {
    const { firstName,
      lastName,
      email, phone, message } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Email content for admin (send to your email)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to your email
      subject: "New Contact Form Submission",
      text: `
        New contact form submission:

        - Name: ${firstName}
        - Email: ${email}
        - Phone: ${phone}
        - Message: ${message}
      `,
    }

    // Send email to admin
    await transporter.sendMail(adminMailOptions)

    res.status(201).json({ message: "Contact form submitted successfully" })
  } catch (error) {
    console.error("Error processing contact form:", error)
    res.status(500).json({ error: "An error occurred while processing your request" })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
