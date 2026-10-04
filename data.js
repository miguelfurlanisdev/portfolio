/* ==========================================================
   DADOS DO SITE — é aqui que você edita o conteúdo.
   Nada abaixo é inventado: são placeholders para você trocar.
   ========================================================== */

window.SITE = {
  user: 'miguelfurlanisdev',
  links: {
    github: 'https://github.com/miguelfurlanisdev',
    linkedin: 'https://www.linkedin.com/in/miguel-voticoski-543b29403',
    email: 'mailto:miguel25voticoski@gmail.com'
  },

  /* ---------- TECH STACK ----------
     glyph: texto curto exibido no ícone (ou '#i-github' para usar um ícone do sprite)
     note:  descrição curta
     Para adicionar uma tecnologia, copie uma linha e mude os valores.
     Para remover o card pontilhado "[ Adicionar tecnologia ]", use showAddTile: false. */
  showAddTile: true,
  stack: [
    { name: 'HTML',       glyph: '</>',      note: 'Estrutura' },
    { name: 'CSS',        glyph: '{ }',      note: 'Estilo e layout' },
    { name: 'JavaScript', glyph: 'JS',       note: 'Interação' },
    { name: 'Git',        glyph: 'git',      note: 'Versionamento' },
    { name: 'GitHub',     glyph: '#i-github', note: 'Código no ar' }
  ],

  /* ---------- PROJETOS ----------
     Troque os 3 placeholders pelos seus projetos reais:
       title:       nome do projeto
       desc:        descrição curta
       tech:        lista de tecnologias
       demo:        link do projeto no ar (GitHub Pages, Vercel...)
       code:        link do repositório
       image:       (opcional) caminho de uma imagem, ex: 'assets/projeto-1.jpg'
                    — se vazio, aparece um preview ilustrativo
       placeholder: true  => mostra o selo "exemplo". Mude para false quando preencher.
     O primeiro da lista vira o card em destaque. */
  projects: [
    {
      title: 'Site Oficina CenterFix',
      desc: 'Desenvolvimento de um site para oficina do meu sogro',
      tech: ['HTML', 'CSS'],
      demo: 'https://centerfixsorocaba.netlify.app',
      code: 'https://github.com/miguelfurlanisdev',
      image: 'assets/centerfix.img.png',
      placeholder: false
    },
    {
      title: 'Site IZV Mídia',
      desc: 'Desenvolvimento de um site para a agência da minha prima',
      tech: ['HTML', 'CSS'],
      demo: 'https://izvmidia.netlify.app',
      code: 'https://github.com/miguelfurlanisdev',
      image: 'assets/izv.cap.png',
      placeholder: false
    },
    
  ]
};
