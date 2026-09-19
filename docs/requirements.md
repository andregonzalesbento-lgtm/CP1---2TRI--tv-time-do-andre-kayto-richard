# Requirements — A Escolha Certa

## 1. Objetivo

Criar um MVP web inspirado na proposta do TV Time, permitindo ao usuário descobrir, organizar e acompanhar filmes e séries em uma única aplicação.

O projeto busca ajudar o usuário a encontrar novos conteúdos, organizar o que deseja assistir e o que já assistiu, acompanhar episódios de séries, descobrir onde assistir, registrar avaliações e compartilhar opiniões através de uma área de comunidade.

## 2. Público-alvo

Pessoas que assistem regularmente a filmes e séries e desejam uma ferramenta para descobrir novos títulos, organizar o que assistem e acompanhar seu progresso.

A aplicação foi desenvolvida para funcionar de forma responsiva, permitindo utilização em diferentes tamanhos de tela.

## 3. User Stories

### Descobrir filmes e séries

- Como usuário, quero pesquisar filmes e séries pelo nome.
- Como usuário, quero visualizar conteúdos populares para descobrir novos títulos.
- Como usuário, quero encontrar conteúdos organizados por categorias, como ação, comédia e anime.
- Como usuário, quero visualizar lançamentos de filmes.
- Como usuário, quero acessar informações detalhadas sobre um filme ou série.
- Como usuário, quero assistir ao trailer de um título quando estiver disponível.
- Como usuário, quero visualizar o elenco e acessar informações sobre as pessoas participantes da produção.

### Organizar o que quero assistir

- Como usuário, quero adicionar um filme ou série à lista "quero assistir".
- Como usuário, quero marcar um filme ou série como "já assistido".
- Como usuário, quero visualizar separadamente os títulos que quero assistir e os que já assisti.
- Como usuário, quero remover um título da minha lista caso tenha marcado por engano.

### Acompanhar séries e episódios

- Como usuário, quero visualizar temporadas e episódios de uma série.
- Como usuário, quero marcar episódios individuais como assistidos.
- Como usuário, quero acompanhar visualmente meu progresso nos episódios.

### Descobrir onde assistir

- Como usuário, quero visualizar os serviços de streaming disponíveis para um filme ou série quando essa informação estiver disponível na API.
- Como usuário, quero encontrar essa informação na página de detalhes do título.

### Registrar avaliações e opiniões

- Como usuário, quero dar uma nota para um filme ou série.
- Como usuário, quero registrar um comentário sobre o conteúdo que assisti.
- Como usuário, quero consultar minhas avaliações junto aos títulos salvos.

### Participar da comunidade

- Como usuário, quero publicar uma opinião sobre um filme ou série.
- Como usuário, quero localizar o título sobre o qual estou publicando através de uma busca.
- Como usuário, quero visualizar publicações relacionadas a filmes e séries.
- Como usuário, quero interagir com publicações através de curtidas.

## 4. Critérios de aceitação

- A busca deve retornar filmes e séries reais obtidos através da API do TMDB.
- Os resultados devem apresentar informações que permitam identificar os títulos, como nome e pôster quando disponível.
- A Home deve apresentar conteúdos organizados em diferentes seções.
- Deve existir uma página específica para lançamentos.
- A página de detalhes deve apresentar informações do título, como sinopse, gêneros, avaliação do TMDB e outras informações disponíveis.
- Quando disponível, deve ser possível visualizar o trailer do título.
- O elenco deve ser apresentado na página de detalhes.
- Ao selecionar uma pessoa do elenco, o usuário deve conseguir acessar uma página com informações sobre ela e seus trabalhos conhecidos.
- Deve ser possível adicionar títulos às listas "quero assistir" e "já assisti".
- Os dados das listas devem permanecer disponíveis através do `localStorage`.
- Para séries, deve ser possível navegar pelos episódios e registrar o progresso.
- Quando disponível na API, a página de detalhes deve informar onde o conteúdo pode ser assistido.
- Deve ser possível registrar avaliações e comentários.
- A página Comunidade deve permitir criar publicações relacionadas a filmes ou séries.
- As publicações da comunidade devem permitir interação através de curtidas.
- A navegação entre as principais páginas deve utilizar React Router.
- A aplicação deve possuir rotas dinâmicas para conteúdos identificados pela API.
- Chamadas à API devem possuir tratamento adequado para carregamento, ausência de dados e falhas quando necessário.

## 5. Estados da aplicação

| Estado | Onde aparece | Comportamento esperado |
|---|---|---|
| Carregando | Busca, detalhes, lançamentos, pessoas e episódios | Exibir indicação de carregamento enquanto a aplicação aguarda a resposta da API |
| Vazio | Busca sem resultados, listas sem itens ou ausência de determinadas informações | Exibir uma mensagem informando que não existem dados disponíveis |
| Erro | Chamadas à API que apresentarem falha | Exibir uma mensagem de erro sem impedir o funcionamento das demais partes da interface |
| Com dados | Páginas que receberam dados corretamente | Renderizar normalmente as informações obtidas |
| Persistido | Listas, avaliações, progresso e informações locais | Recuperar os dados armazenados localmente quando a aplicação for utilizada novamente |

## 6. Regras do produto

- Um título pode ser organizado entre as opções "quero assistir" e "já assisti".
- As informações sobre filmes, séries, pessoas, elenco, vídeos, lançamentos e disponibilidade são obtidas através da API do TMDB.
- As informações recebidas da API são utilizadas apenas para consulta e apresentação ao usuário.
- O progresso dos episódios é atualizado de acordo com os episódios marcados pelo usuário.
- As listas, avaliações e progresso são armazenados localmente utilizando `localStorage`.
- A comunidade do MVP utiliza armazenamento local e não possui um servidor próprio ou sistema de contas.
- Não há sistema de login ou cadastro de usuários no MVP.
- A aplicação utiliza rotas diferentes para as principais páginas e rotas dinâmicas para detalhes de títulos e pessoas.