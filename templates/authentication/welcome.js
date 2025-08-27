module.exports = {
  subject: `Welcome to Swapify!`,
  html: (name) => `<!DOCTYPE html>
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
  
           .buttonClass{
          text-align: center;
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
          We are thrilled to have you on board as a new user of Swapify! 
        </p>
        <p>
        If you have any questions or need assistance, please do not hesitate to reach out to our customer support team. We are always here to help. 
        </p>
    
          <p>Best regards,</p>
        <div style="display: inline-block">
          <p style="display: inline-block; margin: 0">The Swapify Team</p>
        </div>
      </div>
    </body>
  </html>`
}
