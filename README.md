# A Escolha Certa

MVP web inspirado no TV Time — organizar o que já assistiu, acompanhar séries/episódios, descobrir onde assistir e registrar opiniões.

## Integrantes

- Andre
- Kayto
- Richard

## Problema

O TV Time encerrou as atividades em 2026 e apagou os dados de todos os usuários, deixando quem tinha o hábito de acompanhar filmes/séries sem uma ferramenta de tracking.

## Solução

Um MVP web (React) focado em 4 funcionalidades: organizar o que já foi assistido, acompanhar o progresso de episódios de séries, descobrir em quais serviços de streaming um título está disponível, e registrar nota/opinião pessoal sobre o que foi assistido.

## Tecnologias

- React + Vite
- React Router (rotas, incluindo rota dinâmica `/titulo/:mediaType/:id`)
- react-icons
- TMDB API (`fetch` + `useEffect`)
- `localStorage` para persistir listas, notas e progresso de episódios

## API usada

[TMDB — The Movie Database](https://developer.themoviedb.org/docs/getting-started)

## Funcionalidades

- Busca de filmes/séries e grade de populares
- Página de detalhes com sinopse, onde assistir, e opinião pessoal
- Marcar como "quero assistir" / "já assisti"
- Acompanhamento de episódios por temporada, com progresso
- Avaliação (nota + comentário) de títulos assistidos

## Uso de IA

_(preencher com o relato real do processo — os trechos gerados com apoio de IA estão sinalizados com comentários `// [IA] Motivo: ... | O que faz: ...` no código, para facilitar a explicação do que foi pedido e por quê.)_

## Como rodar o projeto

\`\`\`bash
npm install
cp .env.example .env   # depois preencher VITE_TMDB_API_KEY
npm run dev
\`\`\`
