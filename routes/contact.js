import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create a reusable transporter using SMTP
const createTransporter = () => {
    const email = process.env.SMTP_EMAIL;
    const password = process.env.SMTP_PASSWORD;

    if (!email || !password) {
        throw new Error('Missing SMTP credentials. Please check your .env file.');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password
        }
    });
};

// Validate form data
const validateFormData = (data) => {
    const requiredFields = [
        'name', 'email', 'phone', 'industry', 'targetAudience',
        'businessName', 'yourRole', 'problemStatement'
    ];

    // Check required fields
    for (const field of requiredFields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            console.log(`Validation failed: Missing or empty required field: ${field}`);
            return false;
        }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        console.log('Validation failed: Invalid email format');
        return false;
    }

    // Phone validation (basic check for digits)
    const phoneRegex = /^\d{10,}$/; // At least 10 digits
    const cleanPhone = data.phone.replace(/\D/g, ''); // Remove non-digits
    if (!phoneRegex.test(cleanPhone)) {
        console.log('Validation failed: Invalid phone format');
        return false;
    }

    return true;
};

// Helper function to format array or string data
const formatArrayOrString = (data) => {
    if (Array.isArray(data)) {
        return data.join(', ');
    }
    if (typeof data === 'string' && data.trim()) {
        return data;
    }
    return 'None';
};

// Format email HTML
const formatEmailHTML = (formData) => {
    return `
<h2>New Contact Form Submission</h2>
<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
    <tr style="background-color: #f2f2f2;">
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Name:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.name}</td>
    </tr>
    <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Email:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.email}</td>
    </tr>
    <tr style="background-color: #f2f2f2;">
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Phone:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.phone}</td>
    </tr>
    <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">WhatsApp:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.whatsapp || 'Not provided'}</td>
    </tr>
    <tr style="background-color: #f2f2f2;">
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Industry:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.industry}${formData.customIndustry ? ` (${formData.customIndustry})` : ''}</td>
    </tr>
    <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Services Interested:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formatArrayOrString(formData.services)}</td>
    </tr>
    <tr style="background-color: #f2f2f2;">
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Target Audience:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.targetAudience}${formData.customTargetAudience ? ` (${formData.customTargetAudience})` : ''}</td>
    </tr>
    <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Business Name:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.businessName}</td>
    </tr>
    <tr style="background-color: #f2f2f2;">
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Your Role:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.yourRole}</td>
    </tr>
    <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Social Platforms:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formatArrayOrString(formData.socialPlatforms)}</td>
    </tr>
    <tr style="background-color: #f2f2f2;">
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">How Did You Know:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.howDidYouKnow || 'Not specified'}</td>
    </tr>
    <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Meeting Time:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.meetingTime || 'Not specified'}</td>
    </tr>
    <tr style="background-color: #f2f2f2;">
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Problem Statement:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${formData.problemStatement}</td>
    </tr>
</table>
    `;
};

// POST route for contact form submission
router.post('/', async (req, res) => {
    try {
        console.log('POST request received at /api/contact');

        const formData = req.body;
        console.log('Form data received:', JSON.stringify(formData, null, 2));

        // Validate the form data
        if (!validateFormData(formData)) {
            console.log('Form validation failed');
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Please fill in all required fields correctly'
            });
        }

        console.log('Form validation passed');

        // Create transporter
        const transporter = createTransporter();
        console.log('Transporter created');

        // Prepare email content
        const emailHTML = formatEmailHTML(formData);

        // Email configuration
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: process.env.SMTP_EMAIL, // Send to yourself
            subject: `New Contact Form Submission from ${formData.name}`,
            html: emailHTML,
            replyTo: formData.email
        };

        console.log('Sending email...');
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        res.status(200).json({
            success: true,
            message: 'Form submitted successfully!',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error processing form submission:', error);

        if (error.message.includes('Missing SMTP credentials')) {
            return res.status(500).json({
                error: 'Server Configuration Error',
                message: 'SMTP credentials are not configured. Please contact the administrator.'
            });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to submit form. Please try again later.'
        });
    }
});

// GET route for testing
router.get('/', (req, res) => {
    res.json({
        message: 'Contact Form API Endpoint',
        method: 'POST',
        contentType: 'application/json',
        requiredFields: [
            'name', 'email', 'phone', 'industry', 'targetAudience',
            'businessName', 'yourRole', 'problemStatement'
        ],
        optionalFields: [
            'whatsapp', 'customIndustry', 'services', 'customTargetAudience',
            'socialPlatforms', 'howDidYouKnow', 'meetingTime'
        ]
    });
});

export default router;
