# Mama Maendeleo Resort Website

A modern accommodation website for Mama Maendeleo Resort, Lamu.
Features booking, services, rates, and location info.

## Features

- Responsive landing page with hero section and navigation
- Booking enquiry form (integrated with server)
- Services and rates showcase
- Swahili dining, free Wi-Fi, and more
- Node.js/Express backend for booking submissions

## Structure

- home.html — Main landing page
- index.html — Alternate homepage
- services .html — Services details
- css/style.css — Custom styles
- images/ — Resort images
- script.js — Handles booking form and navbar
- server.js — Express server for booking form
- package.json — Project dependencies

## Usage

1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   node server.js
   ```
3. Open home.html or index.html in your browser.

## Booking

- Fill the booking form on the website.
- Data is sent to /book endpoint (handled by Express).
