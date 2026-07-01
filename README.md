# Locum Management System

This repository contains the front end application for the Locum Management System, a specialized web portal designed for healthcare agencies and medical facilities to manage locum professionals, shift schedulers, compliance tracking, and automated timesheet billing.

## Core Architecture

The system is structured as a single page application with two primary viewport scopes:

1. Agency Administrator Dashboard: The main portal where staffing agents oversee all locum profiles, client accounts, open shifts, compliance vetting, and invoicing.
2. Client Whitelabel Portal: A customized view context co-branded for specific hospitals (such as St. James Hospital or Beaumont Hospital). It renders localized roster stats, invoices, shift bookings, and custom brand assets based on system settings.

Navigation state and URL parameter values are managed via React state hooks synchronized directly with browser history state.

## System Modules

The portal comprises 13 integrated management modules:

### 1. Dashboard Overview
Provides aggregate statistics (filled rates, unfilled urgent shifts, active timesheets) and renders time-series metrics. Contains the Upcoming Bookings card displaying scheduled placements.

### 2. Locum Professionals Directory
Manages locum directories and the recruitment pipeline. Facilitates adding applicants, advancing recruiting stages, promoting candidates to active locums, and viewing detailed profiles with personal, professional, and financial attributes.

### 3. Clients and Facilities
Tracks client hospital accounts, custom contract rates, localized contact information, and active co-branded whitelabel settings.

### 4. Shifts and Booking
A shift board supporting calendar and list view layouts. Administrators can create new shifts, allocate compliance requirements, filter by status, specialty, or department, and assign locums.

### 5. Timesheets and Attendance
Records check-in and checkout times. Locum professionals submit digital timesheets which client managers approve or contest.

### 6. Payroll and Invoicing
Generates invoices for hospitals and payment remittances for locums based on hours approved and contract rates.

### 7. Compliance and Credentialing
Vets professional credentials (medical license, Garda vetting, CPR certificate). Tracks expiry dates and blocks bookings if compliance items expire.

### 8. Communications
Central hub for email notifications, instant messages, and notification alerts.

### 9. Performance and Ratings
Aggregates locum rating stats and client feedback scores. Displays distribution charts and trends.

### 10. Reports and Analytics
Generates insights on shift fill rates, average fill times, and recruitment retention rates.

### 11. Alerts and Risk Management
Monitors system exceptions, critical document expiries, and scheduling violations.

### 12. AI and Automation
Employs smart match suggestions to pair open shifts with qualified locums. Provides demand forecasting charts to predict vacancy spikes by specialty and department.

### 13. System Settings
Manages default values for payment rates, agency commissions, region codes, and global whitelabel configurations.

## Data Workflows

A standard placement follows this automated lifecycle:

1. Creation: A client facility requests coverage, creating an open shift specifying specialty, department, date, and rate.
2. Matching: The system suggests top qualified locum candidates based on match weights (proximity, rating, compliance, availability).
3. Assignment: A candidate is assigned, and the booking moves from open to confirmed.
4. Roster: The locum completes the shift, submits checking times, and drafts a timesheet.
5. Invoicing: Approved timesheet hours trigger payroll calculations, generating facility invoices and payment orders.

## Technologies Used

- Core UI: React with TypeScript
- Build Tool: Vite
- CSS Styling: Tailwind CSS version 4
- Chart Visualization: Recharts
- Icon Library: Lucide React

## Getting Started

To run this application locally, follow these steps:

1. Install dependencies:
   npm install

2. Start the development server:
   npm run dev

3. Build the production package:
   npm run build
