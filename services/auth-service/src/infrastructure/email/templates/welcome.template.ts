export const getWelcomeTemplate = (name: string) => {
  const content = `
    <p>Olá, <strong>${name}</strong>!</p>
    
    <p>Seja muito bem-vindo(a) ao <strong>Seu App</strong>!</p>
    
    <p>Estamos muito felizes em tê-lo(a) conosco. Sua conta foi criada com sucesso e você já pode começar a usar nossa plataforma.</p>
    
    <p>Se precisar de ajuda, nossa equipe de suporte está sempre disponível.</p>
    
    <p>Atenciosamente,<br>Equipe Seu App</p>
  `;

  return content;
};

export const getWelcomeTextTemplate = (name: string) => `
Olá, ${name}!

Seja muito bem-vindo(a) ao Seu App!

Estamos muito felizes em tê-lo(a) conosco. Sua conta foi criada com sucesso e você já pode começar a usar nossa plataforma.

Se precisar de ajuda, nossa equipe de suporte está sempre disponível.

Atenciosamente,
Equipe Seu App
`;