# Portfólio — Miguel Voticoski

Site estático (HTML, CSS e JS puro). Sem build, sem backend.

## Publicar no GitHub Pages
1. Crie um repositório chamado `miguelfurlanisdev.github.io` (fica em https://miguelfurlanisdev.github.io) ou qualquer outro nome.
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.

## Como editar
- **Projetos e tecnologias:** tudo em `data.js`. Troque os placeholders, preencha `demo` e `code` e mude `placeholder` para `false`.
- **Imagem de um projeto:** salve em `assets/` e coloque o caminho em `image` no `data.js`.
- **Textos:** `index.html` (seção Sobre, hero, contato).
- **Cores:** variáveis no topo do `style.css` (`--ac` é a cor de destaque).
- **Fotos:** `assets/miguel-1.jpg` (P&B, seção Sobre) e `assets/miguel-2.jpg` (hero).

A seção GitHub busca seus repositórios públicos reais pela API do GitHub (sem números inventados).
