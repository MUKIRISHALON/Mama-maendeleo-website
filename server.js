console.log("THIS IS THE REAL SERVER FILE");

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// CORS Middleware to allow requests from file:///
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Serve home.html for the root route instead of index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Serve other static files from this folder
app.use(express.static(__dirname));

// Booking form submission
app.post('/book', async (req, res) => {
  console.log("Booking received:", req.body);

  const { guest_name, guest_email, guest_phone, room_type, check_in, check_out, num_guests, purpose, message } = req.body;

  // Create transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mamamaendeleoresort.co.ke@gmail.com',
      pass: 'vhfifkkbidnboukg' // Replace this with your Google App Password
    }
  });

  const mailOptions = {
    from: 'mamamaendeleoresort.co.ke@gmail.com',
    to: 'mamamaendeleoresort.co.ke@gmail.com',
    replyTo: guest_email,
    subject: `New Booking Enquiry from ${guest_name}`,
    text: `
      You have received a new booking enquiry!

      Guest Name: ${guest_name}
      Email: ${guest_email}
      Phone: ${guest_phone}
      
      Room Type: ${room_type}
      Check-In: ${check_in}
      Check-Out: ${check_out}
      Number of Guests: ${num_guests}
      Purpose of Visit: ${purpose}
      
      Special Requests / Message:
      ${message}
    `
  };

  const guestMailOptions = {
    from: '"Mama Maendeleo Resort" <mamamaendeleoresort.co.ke@gmail.com>',
    to: guest_email,
    subject: `Booking Confirmed – Mama Maendeleo Resort`,
    text: `Dear ${guest_name}, thank you for your enquiry!
      
We have received your booking request for ${room_type},
Check-In: ${check_in}, Check-Out: ${check_out}.

Our team will contact you shortly at ${guest_phone} to finalise your reservation.

— Mama Maendeleo Resort, +254 723 692 630`
  };

  try {
    await transporter.sendMail(mailOptions); // To the resort
    await transporter.sendMail(guestMailOptions); // To the guest
    res.status(200).json({ success: true, message: "Booking received and email sent successfully!" });
  } catch (error) {
    console.error("Error sending email via Nodemailer:", error);
    res.status(500).json({ success: false, message: "Failed to send booking email." });
  }
});

// ==========================================
// IVR (Interactive Voice Response) Endpoints
// ==========================================

// 1. Main Voice Menu
app.post('/voice', (req, res) => {
  const isActive = req.body.isActive;
  const callbackUrl = req.protocol + '://' + req.get('host') + '/voice/action';
  let response = '';

  if (isActive === '1' || isActive === 1) {
    response = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <GetDigits timeout="30" numDigits="1" callbackUrl="${callbackUrl}">
        <Say>Welcome to Mama Maendeleo Resort. For Room Bookings, press 1. To speak to reception, press 2.</Say>
      </GetDigits>
    </Response>`;
  } else {
    response = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say>Goodbye.</Say>
    </Response>`;
  }

  res.set('Content-Type', 'application/xml');
  res.send(response);
});

// 2. Handle Menu Selection
app.post('/voice/action', (req, res) => {
  const digits = req.body.dtmfDigits;
  let response = '';

  if (digits === '1') {
    response = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say>Please visit our website at Mama Maendeleo dot com to complete your booking. We look forward to hosting you. Goodbye.</Say>
    </Response>`;
  } else if (digits === '2') {
    response = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say>Please hold while we connect you to reception.</Say>
      <Dial phoneNumbers="+254723692630" />
    </Response>`;
  } else {
    response = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say>Invalid choice. Goodbye.</Say>
    </Response>`;
  }

  res.set('Content-Type', 'application/xml');
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`SERVER IS LIVE ON PORT ${PORT}`);
});