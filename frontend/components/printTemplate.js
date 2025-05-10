// printTemplate.js

const generateHtml = (name, message) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Dynamic Print</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      h1 {
        color: #007AFF;
      }
    </style>
  </head>
  <body>
    <h1>Hello, ${name}!</h1>
    <p>${message}</p>
  </body>
</html>
`;

export default generateHtml;
