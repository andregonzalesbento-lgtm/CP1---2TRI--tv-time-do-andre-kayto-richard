# Architecture — A Escolha Certa

## 1. Estrutura geral

O projeto foi desenvolvido com React e Vite.

A navegação entre as páginas utiliza React Router DOM, enquanto o acesso aos dados externos é centralizado no arquivo `src/services/tmdb.js`.

Os dados pessoais da utilização do aplicativo, como listas, avaliações e progresso, são armazenados localmente através do `localStorage`.

## 2. Páginas e rotas

| Rota | Página | Descrição |
|---|---|---|
| `/` | `Home` | Página inicial com busca, conteúdos populares, categorias e lançamentos |
| `/titulo/:mediaType/:id` | `TitleDetails` | Rota dinâmica para detalhes de filmes e séries |
| `/pessoa/:id` | `PersonDetails` | Rota dinâmica com informações de uma pessoa do elenco e seus trabalhos |
| `/minha-lista` | `MyList` | Exibe os títulos salvos pelo usuário |
| `/lancamentos` | `Upcoming` | Exibe uma quantidade maior de filmes em lançamento |
| `/comunidade` | `Community` | Área para publicação e interação com opiniões sobre filmes e séries |

As rotas principais são declaradas no componente `App`.

## 3. Componentes

### Navbar

Componente responsável pela navegação principal da aplicação.

Possui links para:

- Início
- Minha Lista
- Lançamentos
- Comunidade

### Footer

Componente exibido na parte inferior da aplicação.

### Hero

Componente utilizado na área de destaque da página inicial.

### MovieCard

**Prop principal:** `{ item }`

Recebe os dados de um filme ou série e apresenta o conteúdo em formato de card.

O card permite acessar a rota dinâmica de detalhes do título.

### RatingStars

**Props:** `{ rating, onRate }`

Apresenta o sistema visual de avaliação por estrelas.

`rating` representa a avaliação atual e `onRate` é utilizado para registrar uma nova avaliação.

### ProviderList

**Prop:** `{ providers }`

Recebe as informações dos serviços de streaming disponíveis para o título e apresenta os provedores quando disponíveis.

### EpisodeTracker

**Props:** `{ seriesId, seasons, progress, onToggleEpisode }`

Responsável pelo acompanhamento dos episódios de séries.

Permite selecionar temporadas, consultar episódios e registrar quais episódios foram assistidos.

## 4. Estado com useState e efeitos com useEffect

### Home

Utiliza estados para controlar:

- texto da busca
- resultados encontrados
- carregamento
- erros
- conteúdos exibidos nas diferentes seções

Os efeitos são utilizados para carregar conteúdos da API e atualizar os resultados da pesquisa.

### TitleDetails

Utiliza estados para armazenar informações relacionadas ao título, como:

- detalhes
- serviços de streaming
- vídeos/trailer
- elenco
- carregamento
- erros

O `useEffect` realiza as consultas necessárias quando os parâmetros da rota mudam.

Os parâmetros `mediaType` e `id` são obtidos através da rota dinâmica.

### PersonDetails

Utiliza estados para armazenar:

- informações da pessoa
- trabalhos conhecidos
- carregamento
- erros

O `useEffect` consulta a API sempre que o `id` da pessoa muda.

### Upcoming

Utiliza estados para controlar os filmes em lançamento e o carregamento dos dados.

As informações são obtidas através da API do TMDB.

### Community

Utiliza estados para controlar:

- dados do formulário
- busca de filmes e séries
- título selecionado
- publicações
- avaliações
- interações através de curtidas

A busca utilizada durante a criação de uma publicação consulta títulos através da API do TMDB.

As informações da comunidade são armazenadas localmente.

### EpisodeTracker

Utiliza estados para controlar a temporada selecionada, os episódios e o carregamento.

O `useEffect` consulta os episódios quando a temporada selecionada é alterada.

### useLibrary

Hook customizado localizado em:

`src/hooks/useLibrary.js`

Gerencia dados como:

- `wantToWatch`
- `watched`
- `reviews`
- `episodeProgress`

O hook utiliza `localStorage` para manter os dados disponíveis entre utilizações da aplicação.

## 5. Consumo da API

As chamadas externas são centralizadas em:

`src/services/tmdb.js`

A aplicação utiliza a TMDB API através de `fetch`.

A chave da API é obtida através da variável de ambiente:

`VITE_TMDB_API_KEY`

Entre as consultas realizadas pelo projeto estão:

- pesquisa de filmes e séries
- conteúdos populares
- filmes de ação
- filmes de comédia
- animes
- lançamentos
- detalhes de filmes e séries
- temporadas e episódios
- serviços de streaming
- vídeos e trailers
- elenco
- informações de pessoas
- trabalhos conhecidos das pessoas
- datas de lançamento

## 6. Persistência local

A API do TMDB fornece os dados externos relacionados aos filmes, séries e pessoas.

Os dados criados pelo usuário não são enviados ao TMDB.

Listas, avaliações, progresso de episódios e informações locais da comunidade são mantidos no navegador utilizando `localStorage`.

O MVP não possui backend próprio nem sistema de login.

## 7. Organização principal do projeto

```text
src/
├── assets/
├── components/
├── hooks/
├── pages/
├── services/
├── App.jsx
├── App.css
└── index.css