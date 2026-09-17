# Requirements — A Escolha Certa


## 1. Objetivo

Criar um MVP web que substitua parte do vácuo deixado pelo fim do TV Time, focado em ajudar o usuário a **organizar o que já assistiu**, **acompanhar séries e episódios em andamento**, **descobrir onde assistir** um conteúdo e **registrar suas opiniões** sobre filmes e séries — sem exigir cadastro/comunidade, focando na experiência individual de acompanhamento.

## 2. Público-alvo

Pessoas que assistem regularmente séries e filmes e perderam sua ferramenta de tracking com o fim do TV Time — usuários que já tinham o hábito de registrar o que assistem e querem retomar esse controle, em qualquer dispositivo (mobile-first, mas responsivo para desktop).

## 3. User Stories

### Organizar o que já assistiu
- Como usuário, quero marcar um filme/série como "assistido" para manter um histórico do meu consumo.
- Como usuário, quero ver minha lista de "já assistidos" separada da minha lista de "quero assistir".
- Como usuário, quero remover um item da minha lista caso tenha marcado por engano.

### Acompanhar séries e episódios
- Como usuário, quero ver todas as temporadas e episódios de uma série que estou acompanhando.
- Como usuário, quero marcar episódios individuais como assistidos e ver meu progresso (ex: "12/24 episódios").
- Como usuário, quero saber qual é o próximo episódio que falta assistir em cada série.

### Descobrir onde assistir
- Como usuário, quero ver em quais serviços de streaming um filme/série está disponível na minha região.
- Como usuário, quero que essa informação apareça tanto na busca quanto na página de detalhes do título.

### Registrar opiniões
- Como usuário, quero dar uma nota pessoal (ex: 1 a 5 estrelas) para um filme/série que assisti.
- Como usuário, quero escrever um comentário curto sobre o que achei.
- Como usuário, quero ver minhas notas e comentários junto com o item na minha lista de assistidos.

## 4. Critérios de aceitação

- Buscar um título retorna resultados reais vindos da API (TMDB), com pôster, nome e ano.
- A página de detalhes de um título mostra sinopse, elenco principal, nota da própria API e (quando disponível) onde assistir.
- Marcar como assistido / adicionar à lista / dar nota **persiste** durante a sessão (no mínimo em estado local da aplicação; persistência entre sessões — ex. localStorage — é um adicional, não obrigatório no MVP salvo decisão do trio).
- Para séries, é possível navegar por temporada e marcar episódios individualmente, com o progresso refletido visualmente (ex: barra ou contador).
- Todas as telas tratam pelo menos 3 estados: carregando, vazio (sem resultados/sem itens salvos) e erro (falha na API).
- Navegação entre páginas usa rotas reais (URL muda), incluindo pelo menos uma rota dinâmica (ex: `/titulo/:id`).

## 5. Estados da aplicação

| Estado | Onde aparece | Comportamento esperado |
|---|---|---|
| Loading | Busca, detalhes, lista de episódios | Skeleton ou spinner enquanto aguarda resposta da API |
| Vazio | Lista "assistidos"/"quero assistir" sem itens; busca sem resultados | Mensagem clara + call-to-action (ex: "Você ainda não assistiu nada por aqui — que tal buscar um título?") |
| Erro | Qualquer chamada à API que falhe | Mensagem de erro amigável, sem quebrar a tela |
| Com dados | Todas as telas | Conteúdo renderizado normalmente |

## 6. Regras do produto

- Um título só pode estar em **uma** das listas principais por vez: "quero assistir" ou "já assistido" (mover de uma para outra substitui o estado anterior).
- Uma nota/opinião só pode ser registrada para um título que já esteja marcado como assistido (não faz sentido avaliar algo que não foi visto).
- O progresso de uma série é calculado como (episódios marcados / total de episódios da série), agregando todas as temporadas.
- A informação de "onde assistir" vem diretamente da API e não é editável pelo usuário — apenas exibida.
- Não há sistema de contas/login no MVP (fora do escopo dos 4 problemas escolhidos); os dados vivem no estado da aplicação.

---

**Próximo passo:** validar este documento com o trio, ajustar o que fizer sentido, e então seguir para o `architecture.md` (páginas, rotas, componentes, props e onde entram `useState`/`useEffect`).
