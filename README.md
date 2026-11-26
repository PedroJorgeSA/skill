# deck-cloudwalk

Skill do Claude Code para criar decks de pitch em HTML no estilo visual da CloudWalk:

- **Marca:** fundo quase preto, texto osso, acento lima e logos oficiais da CloudWalk, InfinitePay e JIM.
- **3D:** terreno de partículas em three.js.
- **Narrativa:** arco de pitch, em vez de segmentos técnicos soltos.
- **Demos:** vídeos do produto rodando.

## Instalar

```bash
git clone https://github.com/PedroJorgeSA/skill.git
mkdir -p ~/.claude/skills && cp -R skill/deck-cloudwalk ~/.claude/skills/
```

Para usar só em um projeto, copie `deck-cloudwalk` para `.claude/skills/` dentro dele.

## Usar

No Claude Code, peça algo como:

> Monta um deck de pitch para a CloudWalk sobre <seu projeto>, com uma demo do app rodando.

O Claude pergunta pela história: plateia, o que mudou, a terra prometida, os obstáculos, as provas e o pedido. Depois copia o template, escolhe os moldes, grava as demos e confere slide por slide.

## Ver o exemplo

```bash
cd deck-cloudwalk/template && python3 -m http.server 4399
```

Abra http://127.0.0.1:4399. O exemplo tem 14 slides, um por molde, e cada texto explica quando usar aquele molde.

**Teclas:**

| Tecla | Ação |
|---|---|
| setas | navegar |
| S | sem animação |
| R | repetir |
| F | tela cheia |

## O que tem

| Caminho | Conteúdo |
|---|---|
| `deck-cloudwalk/SKILL.md` | o processo que o Claude segue |
| `deck-cloudwalk/template/` | o deck: `index.html`, `deck.css` (marca), `scene.js` (3D), `deck.js` (navegação), logos, three.js e Lucide |
| `deck-cloudwalk/references/` | narrativa de pitch, catálogo de moldes, checklist contra cara de IA |
| `deck-cloudwalk/scripts/capturar.sh` | captura de cada slide para revisão |
| `deck-cloudwalk/scripts/gravar-demo.ts` | grava demos com Playwright, cursor visível e digitação humana |

## Requisitos

| Para | Precisa de |
|---|---|
| Ver o deck | qualquer servidor estático, como `python3 -m http.server` |
| Capturas | Chrome ou Chromium |
| Gravar demos | [Bun](https://bun.sh), `playwright-core` e `ffmpeg` |

## Marcas

Os logos em `template/brands/` são da CloudWalk, InfinitePay e JIM, tirados dos sites oficiais. Use-os só em material apresentado para a CloudWalk ou sobre ela.

O cenário 3D foi desenhado do zero, inspirado na linguagem visual da cloudwalk.io. three.js (MIT) e Lucide (ISC) estão em `template/vendor/`.
