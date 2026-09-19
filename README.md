# A Escolha Certa

MVP web inspirado no desafio de criar uma alternativa ao TV Time, reunindo descoberta, organização e acompanhamento de filmes e séries em uma única aplicação.

## Integrantes

- Andre
- Kayto
- Richard

## Problema

Com o encerramento do TV Time, usuários que utilizavam a plataforma para acompanhar filmes e séries precisam de alternativas para descobrir conteúdos, organizar o que querem assistir, acompanhar episódios e registrar suas opiniões.

## Solução

O A Escolha Certa é um MVP desenvolvido em React que permite pesquisar e descobrir filmes e séries, organizar títulos em listas pessoais, acompanhar episódios, consultar onde assistir, visualizar lançamentos e registrar avaliações e opiniões.

O projeto também possui uma área de comunidade para publicação e interação com opiniões sobre filmes e séries.

## Tecnologias

- React
- Vite
- JavaScript
- CSS
- React Router DOM
- React Icons
- TMDB API
- `fetch`
- `useState`
- `useEffect`
- `localStorage`

## API usada

O projeto utiliza a API do **TMDB — The Movie Database** para obter informações sobre filmes, séries, pessoas, elenco, vídeos, lançamentos e serviços de streaming.

A chave da API é configurada através da variável de ambiente:

`VITE_TMDB_API_KEY`

## Funcionalidades

- Busca de filmes e séries
- Exibição de conteúdos populares
- Categorias de ação, comédia e anime
- Seção de lançamentos
- Página exclusiva com mais lançamentos
- Página de detalhes de filmes e séries
- Sinopse, gêneros, duração e nota do TMDB
- Trailer dos títulos
- Informações sobre onde assistir
- Exibição do elenco
- Página de atores e outras pessoas do elenco
- Biografia e trabalhos conhecidos das pessoas
- Marcar títulos como "quero assistir"
- Marcar títulos como "já assisti"
- Página Minha Lista
- Avaliação com nota e comentário
- Acompanhamento de episódios por temporada
- Progresso dos episódios assistidos
- Página Comunidade
- Publicação de opiniões sobre filmes e séries
- Interação com publicações através de curtidas
- Persistência local de listas, avaliações e progresso

## Rotas principais

- `/` — página inicial
- `/titulo/:mediaType/:id` — detalhes de filme ou série
- `/pessoa/:id` — detalhes de uma pessoa do elenco
- `/minha-lista` — lista pessoal
- `/lancamentos` — lançamentos
- `/comunidade` — comunidade

## Uso de IA

A inteligência artificial foi utilizada como ferramenta de apoio durante o desenvolvimento do projeto.

Ela auxiliou no esclarecimento de dúvidas, organização e revisão do código, identificação e correção de erros, sugestões de melhorias na interface e apoio na elaboração e atualização da documentação.

As funcionalidades, referências visuais e decisões finais do projeto foram analisadas, testadas e escolhidas pelo grupo.

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` utilizando o `.env.example` como referência e informe a chave da API do TMDB:

```text
VITE_TMDB_API_KEY=sua_chave_aqui
```

3. Inicie o projeto:

```bash
npm run dev
```

4. Abra no navegador o endereço informado pelo Vite no terminal.