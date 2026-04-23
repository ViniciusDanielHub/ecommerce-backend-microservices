export const getEmailVerificationTemplate = (name: string, verificationLink: string) => {
  const content = `
    <p>Olá, <strong>${name}</strong>!</p>
    <p>Obrigado por se cadastrar! Para ativar sua conta, clique no botão abaixo:</p>
    <div style="text-align: center;">
      <a href="${verificationLink}" class="button">Verificar Email</a>
    </div>
    <p>Ou copie e cole este link no seu navegador:</p>
    <p class="link-box">${verificationLink}</p>
    <div class="warning">
      <strong>⚠️ Importante:</strong>
      <ul>
        <li>Este link é válido por <strong>24 horas</strong></li>
        <li>Se você não criou esta conta, ignore este email</li>
      </ul>
    </div>
    <p>Atenciosamente,<br>Equipe MarketPlace</p>
  `;
  return content;
};

export const getEmailVerificationTextTemplate = (name: string, verificationLink: string) => `
Olá, ${name}!

Para ativar sua conta, acesse o link abaixo:
${verificationLink}

Este link é válido por 24 horas.

Atenciosamente,
Equipe MarketPlace
`;

export const getAccountFullyVerifiedTemplate = (name: string) => `
  <p>Olá, <strong>${name}</strong>!</p>
 
  <p>🎉 Sua conta está <strong>100% verificada</strong> e totalmente ativa!</p>
 
  <div style="background-color: #e8f5e9; border-left: 4px solid #4CAF50; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <strong>✅ Verificações concluídas:</strong>
    <ul style="margin-top: 10px;">
      <li>✉️ Email verificado</li>
      <li>📱 Telefone verificado</li>
    </ul>
  </div>
 
  <p>Você já pode aproveitar todas as funcionalidades da plataforma:</p>
 
  <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <ul style="margin-top: 10px;">
      <li>🛒 Comprar produtos</li>
      <li>📦 Acompanhar pedidos</li>
      <li>⭐ Avaliar compras</li>
      <li>💬 Entrar em contato com vendedores</li>
    </ul>
  </div>
 
  <p>Atenciosamente,<br>
  <strong>Equipe MarketPlace</strong></p>
`;

export const getAccountFullyVerifiedTextTemplate = (name: string) => `
Olá, ${name}!
 
Sua conta está 100% verificada e totalmente ativa!
 
Verificações concluídas:
- Email verificado
- Telefone verificado
 
Você já pode aproveitar todas as funcionalidades da plataforma.
 
Atenciosamente,
Equipe MarketPlace
`;