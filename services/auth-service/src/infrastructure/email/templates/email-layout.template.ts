export const getEmailLayout = (content: string, headerColor: string = '#4CAF50', title: string = '') => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: ${headerColor};
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 5px 5px 0 0;
      }
      .content {
        background-color: #f9f9f9;
        padding: 30px;
        border-radius: 0 0 5px 5px;
      }
      .button {
        display: inline-block;
        padding: 12px 30px;
        margin: 20px 0;
        background-color: #4CAF50;
        color: white !important;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        color: #666;
        font-size: 12px;
      }
      .warning {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 10px;
        margin: 20px 0;
      }
      .link-box {
        word-break: break-all;
        background-color: #e9ecef;
        padding: 10px;
        border-radius: 3px;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${title}</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>Este é um email automático, por favor não responda.</p>
        <p>&copy; ${new Date().getFullYear()} Seu App. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
</html>
`;