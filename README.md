# Contact Form API

A Node.js Express API server for handling contact form submissions with email notifications using nodemailer.

## Features

- ✅ Express.js server with modern ES6+ syntax
- ✅ Email sending functionality using nodemailer
- ✅ Form validation with comprehensive field checking
- ✅ Rate limiting to prevent spam
- ✅ CORS configuration for frontend integration
- ✅ Security headers with helmet
- ✅ Environment-based configuration
- ✅ Structured error handling
- ✅ Health check endpoint

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your SMTP credentials:
```env
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
PORT=3000
NODE_ENV=development
```

### 3. Gmail Setup (Recommended)

For Gmail, you need to use App Password:
1. Enable 2-Factor Authentication on your Google account
2. Go to [Google Account settings](https://myaccount.google.com/) > Security > 2-Step Verification > App passwords
3. Generate a new app password
4. Use this app password as `SMTP_PASSWORD` in your `.env` file

### 4. Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and uptime information.

### Contact Form Submission
```
POST /api/contact
Content-Type: application/json
```

**Required Fields:**
- `name` (string)
- `email` (string, valid email format)
- `phone` (string, minimum 10 digits)
- `industry` (string)
- `targetAudience` (string)
- `businessName` (string)
- `yourRole` (string)
- `problemStatement` (string)

**Optional Fields:**
- `whatsapp` (string)
- `customIndustry` (string)
- `services` (array or string)
- `customTargetAudience` (string)
- `socialPlatforms` (array or string)
- `howDidYouKnow` (string)
- `meetingTime` (string)

**Example Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "industry": "Technology",
  "targetAudience": "Small Businesses",
  "businessName": "Tech Solutions Inc",
  "yourRole": "CEO",
  "problemStatement": "We need help with digital marketing",
  "services": ["Web Development", "SEO"],
  "socialPlatforms": ["Facebook", "LinkedIn"]
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully!",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Project Structure

```
contact-form-api/
├── routes/
│   └── contact.js          # Contact form route handler
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
├── .env                   # Environment variables (create this)
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Security Features

- **Rate Limiting**: General API calls limited to 100/15min, form submissions to 5/15min
- **CORS Protection**: Configurable allowed origins
- **Security Headers**: Applied via helmet middleware
- **Input Validation**: Comprehensive form data validation
- **Error Handling**: Structured error responses without sensitive data exposure

## Development

### Scripts

- `npm start` - Run in production mode
- `npm run dev` - Run in development mode with nodemon
- `npm test` - Run tests (placeholder)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SMTP_EMAIL` | Email address for sending emails | Yes |
| `SMTP_PASSWORD` | SMTP password/app password | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment mode | No |

## Testing

You can test the API using curl, Postman, or any HTTP client:

```bash
# Health check
curl http://localhost:3000/health

# Test contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "industry": "Technology",
    "targetAudience": "Developers",
    "businessName": "Test Company",
    "yourRole": "Developer",
    "problemStatement": "Testing the API"
  }'
```

## Deployment

### Railway / Heroku / Vercel
1. Set environment variables in your platform's dashboard
2. Deploy the repository
3. The server will start automatically

### VPS / Docker
1. Clone the repository
2. Set up environment variables
3. Install dependencies: `npm install`
4. Start the server: `npm start`

## License

MIT License - feel free to use this in your projects!

## Support

If you encounter any issues:
1. Check your `.env` configuration
2. Verify SMTP credentials are correct
3. Check server logs for detailed error messages
4. Ensure all required fields are being sent in requests

---

**Happy coding! 🚀**
