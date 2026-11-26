# Catálogo de moldes

O HTML de cada molde está em `template/index.html`, no slide indicado. Copie a `<section>` inteira e troque o texto. O palco tem 1920×1080 px; as medidas em `deck.css` já estão nessa escala.

| Molde | Slide do template | Classes principais | Limite de conteúdo |
|---|---|---|---|
| Capa | 1 | `.cover`, `.brand`, `h1`, `.lede`, `.logos` | título de até 2 linhas |
| Citações | 2 | `.voices > .voice > q + .src` | 2 citações de até 25 palavras |
| Antes e depois | 3 | `.cols`, `.col.bad`, `.col.good`, `.rule` | 2 blocos, 2 linhas cada |
| Lista com ícones | 4 | `.items > li > .ico + .t > b` | 3 ou 4 itens |
| Cadeia + contratos | 5 | `.chain > .node(.new)`, `.contract` | 5 nós, 2 contratos de 3 linhas |
| Passos ao lado do 3D | 6 e 7 | `.slide.side`, `.steps > li(.red)`, `.keybox` | 3 ou 4 passos; use com `flow` ou `fail` |
| Estados | 8 | `.states > .st.ai / .st.q / .st.h`, `.callout` | 3 a 5 estados |
| Processo + código | 9 | `.flow > div(.on)`, `.rulebox` | 4 etapas, código de até 12 linhas |
| Arquitetura de software | 10 | `.arch-grid > .arch-col(.core) > .arch-i`, `.arch-bar` | 4 colunas, até 4 itens cada |
| Arquitetura de IA | 11 | `.ai-grid`, `.ai-path` com `.tag.det` / `.tag.llm`, `.chainrow`, `.mrow` | 5 passos, 3 métricas |
| Números + captura | 12 | `.proof`, `.num > .v + .l`, `.shot` | 3 números |
| Demo em vídeo | 13 | `.slide.demo`, `.beats`, `.screen > video[data-demo]` | 3 ou 4 marcas de tempo |
| Pedido | 14 | `.asks > li > .n + h3 + p` | 3 pedidos |

## Utilitários

- `.accent` texto no acento · `.dim` e `.faint` texto secundário · `.mono` números e código.
- `.ico.accent` ícone no acento · `.ico.red` ícone de falha.
- Títulos longos: `style="font-size:64px"` no `h2` (o padrão é 76 px). Abaixo de 56 px, corte o texto.
- `.placeholder` marca uma captura ou vídeo que ainda falta. Não entregue deck com placeholder.
