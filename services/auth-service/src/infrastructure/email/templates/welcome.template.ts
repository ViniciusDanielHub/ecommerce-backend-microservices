export const getWelcomeTemplate = (name: string) => {
  const content = `
    <p>Olá, <strong>${name}</strong>!</p>
    
    <p>🎉 Seja muito bem-vindo(a) ao <strong>MarketPlace</strong>!</p>
    
    <p>Estamos muito felizes em tê-lo(a) conosco. Sua conta foi criada com sucesso e você já pode começar a aproveitar todas as funcionalidades da nossa plataforma.</p>
    
    <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <strong>✨ Próximos passos:</strong>
      <ul style="margin-top: 10px;">
        <li>Complete seu perfil com informações adicionais</li>
        <li>Explore nosso catálogo de produtos</li>
        <li>Configure suas preferências de notificações</li>
      </ul>
    </div>
    
    <p>Se tiver alguma dúvida ou precisar de ajuda, nossa equipe de suporte está sempre disponível para atendê-lo(a).</p>
    
    <p style="margin-top: 30px;">
      Atenciosamente,<br>
      <strong>Equipe MarketPlace</strong>
    </p>
  `;

  return content;
};

export const getWelcomeTextTemplate = (name: string) => `
Olá, ${name}!

Seja muito bem-vindo(a) ao MarketPlace!

Estamos muito felizes em tê-lo(a) conosco. Sua conta foi criada com sucesso e você já pode começar a usar nossa plataforma.

Próximos passos:
- Complete seu perfil com informações adicionais
- Explore nosso catálogo de produtos
- Configure suas preferências de notificações

Se precisar de ajuda, nossa equipe de suporte está sempre disponível.

Atenciosamente,
Equipe MarketPlace
`;