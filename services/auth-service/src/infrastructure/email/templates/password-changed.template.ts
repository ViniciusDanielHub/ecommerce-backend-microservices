export const getPasswordChangedTemplate = (name: string) => {
  const content = `
    <p>Olá, <strong>${name}</strong>!</p>
    
    <p>Sua senha foi alterada com sucesso em <strong>${new Date().toLocaleString('pt-BR')}</strong>.</p>
    
    <div class="warning">
      <strong>⚠️ Não foi você?</strong><br>
      Se você não realizou esta alteração, entre em contato com nosso suporte imediatamente para proteger sua conta.
    </div>
    
    <p>Atenciosamente,<br>Equipe Seu App</p>
  `;

  return content;
};

export const getPasswordChangedTextTemplate = (name: string) => `
Olá, ${name}!

Sua senha foi alterada com sucesso em ${new Date().toLocaleString('pt-BR')}.

Se você não realizou esta alteração, entre em contato com nosso suporte imediatamente para proteger sua conta.

Atenciosamente,
Equipe Seu App
`;