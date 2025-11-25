export const getResetPasswordTemplate = (resetLink: string, expirationTime: string = '1 hora') => {
  const content = `
    <p>Olá!</p>
    
    <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
    
    <p>Para criar uma nova senha, clique no botão abaixo:</p>
    
    <div style="text-align: center;">
      <a href="${resetLink}" class="button">Redefinir Senha</a>
    </div>
    
    <p>Ou copie e cole este link no seu navegador:</p>
    <p class="link-box">${resetLink}</p>
    
    <div class="warning">
      <strong>⚠️ Importante:</strong>
      <ul>
        <li>Este link é válido por apenas <strong>${expirationTime}</strong></li>
        <li>Se você não solicitou esta redefinição, ignore este email</li>
        <li>Sua senha atual permanecerá inalterada</li>
      </ul>
    </div>
    
    <p>Se tiver alguma dúvida, entre em contato com nosso suporte.</p>
    
    <p>Atenciosamente,<br>Equipe Seu App</p>
  `;

  return content;
};

export const getResetPasswordTextTemplate = (resetLink: string, expirationTime: string = '1 hora') => `
Recuperação de Senha

Recebemos uma solicitação para redefinir a senha da sua conta.

Para criar uma nova senha, acesse o link abaixo:
${resetLink}

Este link é válido por apenas ${expirationTime}.

Se você não solicitou esta redefinição, ignore este email.

Atenciosamente,
Equipe Seu App
`;