module.exports = {
  subject: `Reset Your Password - Verification Code`,
  html: (name, code) => `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        /* Base styles */
        body {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
          font-size: 16px;
          line-height: 1.5;
        }
        #wrapper {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 24px;
          border: 1px solid #ccc;
          text-align: left;
        }
          #reviewButton{
           color: white;
           background-color: #006778;
           height: 39px;
           font-size: 16px;
           padding: 8px;
           border: none;
           border-radius: 6px;
           border-color: #000000;
        }
        .code {
          font-size: 48px;
          color: #333;
          margin-top: 40px;
          display: block;
          padding: 30px 0;
          letter-spacing: 10px; /* Add space between digits */
        }
        h1 {
          font-size: 24px;
          margin-bottom: 16px;
        }
        p {
          margin-bottom: 16px;
        }
        a {
          color: #1e90ff;
          text-decoration: underline;
        }
        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
          margin-bottom: 24px;
        }
        .logo {
          margin-top: 24px;
          margin-bottom: 24px;
        }
  
        /* Media queries */
        @media (max-width: 600px) {
          h1 {
            font-size: 20px;
            margin-bottom: 12px;
          }
          p {
            margin-bottom: 12px;
          }
          .logo {
            margin-top: 12px;
            margin-bottom: 12px;
          }
        }
        @media (max-width: 400px) {
          h1 {
            font-size: 16px;
            margin-bottom: 8px;
          }
          p {
            margin-bottom: 8px;
          }
          .logo {
            margin-top: 8px;
            margin-bottom: 8px;
          }
        }
      </style>
    </head>
<body>
  <div id="wrapper">
    <p>Dear ${name},</p>
    
    <p>
      You recently requested to reset your password. Please use the following 6-digit code to verify your account:
    </p>
    <div class="code">
      ${code}
    </div>

    <p>If you did not request this, please ignore this email.</p>

    <p>Best regards,</p>
    <p>The Swapify Team</p>
  </div>
</body>
  </html>`
}
