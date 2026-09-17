# Architecture — A Escolha Certa

## Páginas e rotas

| Rota | Página | Descrição |
|---|---|---|
| `/` | `Home` | Busca de títulos + grade de populares (trending) |
| `/titulo/:mediaType/:id` | `TitleDetails` | Rota dinâmica. `mediaType` é `movie` ou `tv`. Detalhes, onde assistir, opinião, e (se série) episódios |
| `/minha-lista` | `MyList` | Listas "quero assistir" e "já assisti" |

## Componentes e props

- **Navbar** — sem props, só links de navegação (`Home`, `Minha lista`).
- **MovieCard** `{ item }` — recebe um título (filme/série vindo da API) e renderiza um card clicável para `TitleDetails`.
- **RatingStars** `{ rating, onRate }` — mostra 5 estrelas; `onRate(valor)` é chamado quando o usuário clica.
- **ProviderList** `{ providers }` — recebe a lista de serviços de streaming e renderiza os logos.
- **EpisodeTracker** `{ seriesId, seasons, progress, onToggleEpisode }` — busca os episódios da temporada selecionada e permite marcar cada um.

## Estado (useState) e efeitos (useEffect)

- **Home**: `query` (texto da busca), `results`, `loading`, `error`. `useEffect` #1 carrega os populares ao montar a página; `useEffect` #2 refaz a busca (com debounce) sempre que `query` muda.
- **TitleDetails**: `details`, `providers`, `loading`, `error`, `comment`. `useEffect` busca detalhes + onde assistir sempre que `mediaType`/`id` mudam (via `useParams`).
- **EpisodeTracker**: `selectedSeason`, `episodes`, `loading`. `useEffect` busca os episódios sempre que a temporada selecionada muda.
- **useLibrary** (hook customizado): `library` (objeto com `wantToWatch`, `watched`, `reviews`, `episodeProgress`). `useEffect` salva no `localStorage` sempre que `library` muda.

## Consumo de API

Todas as chamadas passam por `src/services/tmdb.js`, que usa a TMDB API (`fetch`) com a key vinda de `import.meta.env.VITE_TMDB_API_KEY`. Endpoints usados: `/search/multi`, `/trending/all/week`, `/{movie|tv}/{id}`, `/tv/{id}/season/{n}`, `/{movie|tv}/{id}/watch/providers`.

## Persistência local

O progresso do usuário (listas, notas, episódios assistidos) não vem da API — fica no `localStorage`, gerenciado pelo hook `useLibrary` (`src/hooks/useLibrary.js`), já que o MVP não tem login/backend próprio.
