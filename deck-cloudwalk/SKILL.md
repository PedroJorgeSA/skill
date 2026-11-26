---
name: deck-cloudwalk
description: Cria um deck de pitch em HTML no estilo visual da CloudWalk (fundo quase preto, texto osso, acento lima, terreno de partículas 3D em three.js, logos oficiais da CloudWalk, InfinitePay e JIM), com narrativa de pitch e demos do produto em vídeo. Use quando alguém pedir slides, deck, pitch ou apresentação para a CloudWalk, InfinitePay ou JIM, ou "no estilo da CloudWalk", mesmo sem citar esta skill.
---

# Deck CloudWalk

Um deck é uma pasta estática: `index.html` com os slides, `deck.css` com a marca, `scene.js` com o 3D, `deck.js` com a navegação. Você copia `template/`, apaga os slides que não servem e troca o texto. Não reescreva o motor.

## 1. Antes de escrever: a história

Pergunte o que faltar, em uma rodada só. Sem isso o deck vira uma lista de segmentos técnicos.

- **Plateia e decisão**: quem assiste e o que deve decidir no fim.
- **A mudança**: o que mudou no mundo da CloudWalk e criou vencedores e perdedores. Ancore em fontes reais (cloudwalk.io, infinitepay.io, relatórios). Nunca invente citação.
- **Terra prometida**: como fica depois, em uma frase.
- **Obstáculos**: de 3 a 5 coisas que impedem chegar lá. Cada uma vira um capítulo "Como chegar · N".
- **Provas**: números medidos, capturas e demos do que já roda.
- **Pedido**: até três coisas concretas que a plateia pode fazer.

A ordem dos slides segue esse arco (Andy Raskin): mudança → o que está em jogo → terra prometida → obstáculos com a solução de cada um → arquitetura → provas → pedido. Veja `references/narrativa.md`.

## 2. Montar

1. Copie `template/` para a pasta do deck.
2. Em `index.html`, ajuste `window.DECK` (nome no rodapé, rótulos do 3D) e a `<title>`.
3. Para cada slide, escolha um molde do catálogo em `references/moldes.md` e o fundo 3D (`data-scene`).
4. `data-ch` é o capítulo no rodapé. Use "Como chegar · 2 confiabilidade", não rótulos em caixa alta acima do título.
5. Entradas: `class="in"` com `style="--d:250"` (ms). Escalone de 150 em 150, até uns 1000 ms.
6. Ícones: Lucide, `<i data-lucide="nome"></i>` dentro de `.ico`. Use só os que dizem algo, sempre com rótulo de texto ao lado.

Fundos 3D (`data-scene`):

| Modo | O que mostra | Quando |
|---|---|---|
| `cover` | terreno de partículas forte | capa |
| `drift` | terreno de lado, mais fraco | a mudança, citações |
| `block` | bloco de pontos âmbar | o jeito antigo, o que está em jogo |
| `layers` | o bloco se desfaz em três camadas (lima) | terra prometida, logo depois de `block` |
| `flow` | 6 trilhas com mensagens coloridas por chave | filas, partições, pipelines; texto à esquerda com `class="slide side"` |
| `fail` | uma mensagem falha, vai para a fila de erro e volta no replay | confiabilidade, recuperação |
| `quiet` | terreno bem fraco | slides com diagrama ou código |
| `off` | só o fundo | arquitetura, números, demos |
| `end` | terreno baixo | pedido final |

## 3. Marca

- Cores em `deck.css` (`:root`). O 3D lê as mesmas variáveis (`--s1..--s3`, `--accent`, `--text`, `--danger`, `--bg`).
- Fontes: Gabarito (texto) e IBM Plex Mono (números, código, marcas de tempo).
- Logos oficiais em `template/brands/` (cloudwalk, infinitepay, jim), em osso sobre fundo escuro. Use do tamanho do texto ao redor, nunca esticados nem recoloridos. Um separador `<i class="sep"></i>` entre a CloudWalk e as marcas dela.
- `mark.svg` é o símbolo do seu projeto. Troque pelo seu; o deck é seu **para** a CloudWalk, não da CloudWalk.

## 4. Regras contra cara de IA

Leia `references/anti-slop.md` antes de entregar. O essencial:

- O título diz a conclusão do slide ("A conversa tem um dono por vez"), não o assunto ("Gestão de estados").
- Uma ideia por slide. Se precisa de dois títulos, são dois slides.
- Números só se você mediu, com unidade, vírgula decimal e tabular (`.mono`).
- Sem gradiente em texto, emoji, brilho, "✨", rótulo em caixa alta acima do título, cartões dentro de cartões.
- Português direto: sem "revolucionário", "robusto", "solução completa", "potencializar".

## 5. Demos em vídeo

Demo vale mais que captura. Grave o produto rodando, 16:10, sem áudio, até 30 s por ideia, e use o molde `demo`.

- Automático: `scripts/gravar-demo.ts` (Playwright, cursor visível, digitação no ritmo de uma pessoa). Edite as cenas e rode `bun scripts/gravar-demo.ts <url> <cena>`. Precisa de `playwright-core` e `ffmpeg`.
- Manual: grave no Recordly ou no QuickTime e exporte para `video/<nome>.mp4`. Faça um pôster com `ffmpeg -ss 2 -i video/x.mp4 -frames:v 1 video/poster-x.jpg`.
- Marque 3 ou 4 momentos com o tempo exato em `.beats`.

## 6. Conferir e entregar

1. Sirva a pasta (módulos ES não abrem em `file://`): `python3 -m http.server 4399` dentro dela.
2. Gere uma captura de cada slide com `scripts/capturar.sh <pasta-do-deck>` e olhe uma por uma: texto cortado, texto sobre partícula forte, logo esticado, slide vazio.
3. Teclas: setas, S sem animação, R repetir, F tela cheia. `?static` congela no quadro final (bom para PDF e capturas).
4. Para mandar: a pasta inteira, ou publique como página estática (Vercel, GitHub Pages, artefato do Claude).
