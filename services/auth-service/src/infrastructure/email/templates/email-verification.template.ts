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