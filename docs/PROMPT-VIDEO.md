# Prompts de vídeo — Barbearia Bigode Italia

Guia para gerar a animação do logo e os vídeos da marca num app de vídeo com IA (Runway, Kling, Google Veo/Flow,
Sora, Hailuo, Luma, Pika…). Os prompts estão em **inglês** porque esses apps entendem melhor em inglês; a
explicação está em português.

## Antes de começar: 6 regras para não dar erro

1. **IA de vídeo estraga letras.** Ela entorta e inventa textos. Por isso:
   - gere a animação usando **só o símbolo** (`public/marca/logo-simbolo-transparente.png`) ou use o logo completo
     apenas como **último quadro** (*end frame*);
   - coloque o nome "Barbearia Bigode Italia" **depois, no editor** (CapCut, Canva, InShot), por cima do vídeo.
2. **Use "imagem para vídeo"** (*image to video*), não "texto para vídeo". Envie o arquivo do logo como imagem de
   referência. Sem a imagem, a IA inventa outro logo.
3. **Uma ideia por vídeo, de 5 a 8 segundos.** Vídeos longos perdem a forma do logo. Para um vídeo maior, gere
   várias cenas curtas e junte no editor.
4. **Cole o prompt negativo** (seção abaixo) no campo *negative prompt*, se o app tiver. Se não tiver, cole no
   fim do prompt principal, depois de "Avoid:".
5. **Formato certo para cada lugar:** 16:9 para o site e YouTube; 9:16 para Reels, Stories, TikTok e status do
   WhatsApp; 1:1 para o feed do Instagram.
6. **Gere 3 ou 4 versões** e escolha a melhor. Se uma versão ficou boa, anote o *seed* (número da geração) para
   repetir o estilo.

### Arquivos para enviar ao app

| Para quê | Arquivo |
|---|---|
| Animação do símbolo | `public/marca/logo-simbolo-transparente.png` (1024×1024, fundo transparente) |
| Último quadro com o nome (horizontal) | `public/marca/logo-horizontal-fundo-escuro.png` |
| Último quadro com o nome (vertical, Reels) | `public/marca/logo-vertical-fundo-escuro.png` |
| Vetor para designer/gráfica | `public/marca/logo-simbolo.svg` |

### Identidade visual (cole sempre que o app pedir "estilo")

- Cores: dourado `#D4A940` (degradê de `#F3D98A` a `#A87A22`), preto quente `#0D0B09`, detalhe da bandeira
  italiana: verde `#1F8A4C`, branco `#F5EFE4`, vermelho `#C8352E`.
- Símbolo: selo redondo dourado com uma **coroa** em cima e um **bigode clássico enrolado nas pontas** no centro,
  com uma faixa pequena verde-branco-vermelho embaixo.
- Clima: barbearia clássica de luxo, iluminação de estúdio, reflexos de metal dourado, fumaça leve, elegante e
  masculino. Nada de desenho animado.

### Prompt negativo (use em todos)

```
text, letters, words, typography, watermark, logo distortion, warped shapes, melting, morphing into other objects,
extra crowns, extra mustaches, asymmetrical mustache, changing colors, blue, purple, neon, cartoon, anime, 3D cartoon,
low quality, blurry, jitter, flicker, fast camera shake, people, faces, hands, cluttered background
```

---

## Vídeo 1 — Abertura com o logo (5 a 6 s)

Para o começo dos vídeos, o site e o Instagram.

- **Modo:** imagem para vídeo
- **Imagem:** `logo-simbolo-transparente.png` (ou como *end frame*, se o app permitir início e fim)
- **Formato:** 16:9 (e uma segunda versão em 9:16)
- **Duração:** 5 s
- **Movimento da câmera:** baixo ou médio (*motion* 3 a 5 de 10)

```
Cinematic logo reveal of a luxury barbershop emblem: a round gold seal with a gold crown on top and a classic
curled handlebar mustache in the center, with a tiny green-white-red Italian stripe below it. Pure black studio
background with warm soft light. The emblem starts in darkness, a thin beam of golden light sweeps across from
left to right revealing the polished metallic gold surface, subtle sparkles glint on the crown tips and on the
mustache curls, light smoke drifts slowly at the bottom. Slow push-in camera, the emblem stays perfectly centered,
symmetric and sharp, its shape does not change. Elegant, premium, classic Italian barbershop mood. Ends on a
clean, still, perfectly lit frame of the emblem.
```

**Depois, no editor:** nos últimos 1,5 s, coloque o texto "Barbearia Bigode Italia" na fonte **Playfair Display
Bold**, em dourado, entrando com *fade* de baixo para cima, e o som de uma tesoura ou navalha no momento do brilho.

## Vídeo 2 — Bigode se desenhando (5 s)

Variação mais artística da abertura.

- **Modo:** imagem para vídeo, com o logo como **último quadro** (*end frame*)
- **Formato:** 1:1 ou 9:16

```
Liquid gold flows on a black background and elegantly draws a classic curled handlebar mustache, the gold strokes
curl at the tips, then a small gold crown rises above it and a round gold ring closes around both, forming a
luxury barbershop seal. Molten metal texture, warm reflections, slow and smooth motion, perfectly symmetric.
Final frame matches the reference image exactly.
```

## Vídeo 3 — Fundo animado do site (loop de 8 s, sem logo)

Para usar atrás do título "Onde Estilo Encontra Tradição" no topo do site. **Sem texto e sem logo**, porque o
site já escreve o título por cima.

- **Modo:** texto para vídeo (ou imagem para vídeo com uma foto real da barbearia, que fica ainda melhor)
- **Formato:** 16:9, 1080p
- **Duração:** 8 s, pedindo *loop* (início igual ao fim)

```
Slow cinematic dolly shot through a dark luxury classic barbershop at night: vintage leather barber chairs, warm
golden pendant lights, polished chrome and brass details, straight razors and scissors on a dark wooden counter,
soft haze in the air with light rays. Very slow camera movement, shallow depth of field, rich black and warm gold
color palette, moody and elegant. Seamless loop, the last frame matches the first frame. No people, no text.
```

**Regras para o site aceitar o vídeo:** MP4 (H.264), 1920×1080, no máximo **8 MB**, **sem áudio**, de 8 a 12 s.
No CapCut: Exportar → 1080p, 30 fps, taxa de bits "Recomendada" ou "Baixa". Me mande o arquivo que eu coloco no
site, com uma imagem de capa para quem tem internet lenta.

## Vídeo 4 — Reels/Stories da barbearia (15 a 20 s, 9:16)

Gere **cada cena separadamente** (5 s cada) e junte no editor, nesta ordem:

| # | Cena | Prompt (9:16, 5 s) |
|---|---|---|
| 1 | Abertura | Use o **Vídeo 1** na versão 9:16 |
| 2 | Navalha | `Extreme close-up of a barber's straight razor gliding along a perfectly lined beard edge, warm golden light, shallow depth of field, slow motion, luxury barbershop, black and gold palette, no text` |
| 3 | Degradê | `Close-up of electric clippers creating a smooth skin fade haircut on the side of a man's head, tiny hair particles in the golden backlight, slow motion, cinematic, dark background, no text` |
| 4 | Toalha quente | `Steam rising from a hot white towel being folded by a barber in a classic dark barbershop, warm golden lamps, slow motion, cozy and premium atmosphere, no text` |
| 5 | Final | Use o **Vídeo 2** ou a imagem `logo-vertical-fundo-escuro.png` parada por 3 s |

**Melhor ainda:** nas cenas 2 a 4, use **vídeos reais** gravados na barbearia com o celular (vertical, boa luz,
câmera parada) e deixe a IA só para a abertura e o final. Cortes reais vendem mais do que cortes inventados.

**Textos para colocar no editor** (em Playfair Display ou Inter, dourado `#D4A940`):
- Cena 2: "Acabamento na navalha"
- Cena 3: "Degradê perfeito"
- Cena 4: "Experiência completa"
- Final: "Agende pelo WhatsApp · (15) 99964-8684" e "@barbearia_bigode_italia"

**Música:** instrumental lo-fi/jazz ou trap leve, sem direitos autorais (biblioteca do próprio CapCut ou do
Instagram).

---

## Se der errado

| Problema | Como resolver |
|---|---|
| O logo virou outra coisa / derreteu | Diminua o movimento (*motion*) para 2 ou 3 e gere de novo. Use o logo como *end frame*. |
| Apareceram letras estranhas | Confira o prompt negativo. Tire qualquer palavra do prompt que a IA possa tentar escrever. |
| O bigode ficou torto | Acrescente `perfectly symmetric mustache, mirror symmetry` no começo do prompt. |
| Cores erradas (azul, roxo) | Acrescente `only black and warm gold colors` no começo do prompt. |
| Vídeo tremendo | Peça `static camera` ou `very slow push-in` e tire `dynamic`/`fast` do prompt. |
| Ficou com cara de desenho | Acrescente `photorealistic, cinematic, studio product shot`. |

---

# Versão para o Google Flow (Veo)

O Flow gera clipes de **8 segundos** e o Veo 3 também cria o **som** a partir do prompt. Não existe campo de prompt
negativo: o que não pode aparecer vai escrito no próprio prompt, como no fim de cada um abaixo.

**Configuração (ícone de ajustes ao lado do campo do prompt):**
- **Modelo:** Veo 3 *Quality* para o resultado final; Veo 3 *Fast* para testar ideias gastando menos créditos
- **Proporção:** 16:9 para o site; 9:16 para Reels e Stories
- **Resultados por prompt:** 2 a 4, para escolher o melhor

**Modos do Flow usados aqui:**
- **Frames to Video:** você envia a imagem do **último quadro** (*end frame*) e o Veo anima até chegar nela. É o
  melhor modo para o logo sair perfeito.
- **Text to Video:** só o texto, para cenas sem logo (ambiente da barbearia).
- **Scenebuilder:** junta os clipes em sequência (botão **Add to scene**) e exporta tudo num vídeo só.

## Flow 1 — Intro do logo (Frames to Video, 8 s)

- **Modo:** Frames to Video
- **Último quadro:** `public/marca/intro-final-16x9.png` (16:9) ou `public/marca/intro-final-9x16.png` (9:16).
  A imagem precisa ter a mesma proporção do vídeo; os logos horizontal/vertical comuns seriam cortados.
- **Primeiro quadro:** deixe vazio

```
A cinematic luxury logo reveal for a classic barbershop. Open on total darkness with faint warm haze. A thin beam of
golden light sweeps slowly from left to right and reveals a polished gold emblem on a black background: a round gold
seal with a gold crown on top and a classic curled handlebar mustache in the center, with a tiny green, white and red
stripe below it. Small golden sparkles glint on the crown tips and on the mustache curls, soft smoke drifts at the
bottom of the frame. The camera slowly pushes in and settles, ending exactly on the provided final frame, perfectly
centered and still. The emblem keeps its exact shape and colors the whole time, perfectly symmetric, never morphing.
Black and warm gold palette, premium, elegant, photorealistic studio lighting.
Audio: a deep cinematic whoosh as the light sweeps, the crisp metallic "shing" of a straight razor when the emblem
shines, then a short low ambient tone. No music with vocals, no dialogue.
Do not add any extra text, letters, watermarks, people or other objects.
```

## Flow 2 — Ambiente da barbearia para o fundo do site (Text to Video, 8 s, 16:9)

Inspirado nas referências: ambiente escuro, lâmpadas aparentes, cadeiras de couro preto, detalhes dourados.

```
A slow, smooth cinematic dolly shot gliding through an empty luxury classic barbershop at night. Black leather and
chrome vintage barber chairs, dark wood counters with rows of amber grooming product bottles, large mirrors with thin
gold frames, warm Edison bulb pendant lights and soft golden LED strips under the shelves, dark textured walls,
black and white checkered floor reflecting the lights, light haze in the air catching soft light rays. Very slow
forward camera movement, shallow depth of field, rich black, brown and warm gold color palette, moody, elegant,
photorealistic. The camera movement is calm and steady so the clip can loop.
Audio: quiet room ambience only.
No people, no visible text, signs, letters or logos anywhere.
```

**Para o site:** baixe o vídeo, tire o som e mande para mim (MP4, até 8 MB). O site já escreve o título por cima.

## Flow 3 — Reels (3 clipes de 8 s, 9:16) montados no Scenebuilder

Gere cada um com **Text to Video** em 9:16 e junte na ordem com **Add to scene**. Termine com o **Flow 1** em 9:16.

**Clipe A — Navalha**
```
Extreme close-up, slow motion: a barber's straight razor with a black handle glides along the clean edge of a
man's beard, a little white shaving foam, warm golden side light against a dark background, shallow depth of field,
luxury classic barbershop, photorealistic. Audio: the soft scrape of the razor, calm ambience.
No visible text or letters.
```

**Clipe B — Degradê**
```
Close-up, slow motion: black and gold electric clippers create a smooth skin fade on the side of a man's head, tiny
hair particles float in the warm golden backlight, dark moody barbershop background with blurred Edison bulbs,
photorealistic, cinematic. Audio: the steady buzz of clippers. No visible text or letters, the face stays out of frame.
```

**Clipe C — Toalha quente**
```
Medium close-up, slow motion: a barber's hands fold a steaming hot white towel next to a black leather barber chair,
steam swirls in warm golden light, dark wood and chrome details in the background, cozy premium atmosphere,
photorealistic. Audio: soft steam and quiet ambience. No visible text or letters.
```

**Depois, no CapCut:** coloque os textos ("Acabamento na navalha", "Degradê perfeito", "Experiência completa") e, no
final, "Agende pelo WhatsApp · (15) 99964-8684" e "@barbearia_bigode_italia".

## Se o Flow errar

| Problema | O que fazer |
|---|---|
| O logo mudou de forma | Use **Frames to Video** com o logo como *último quadro* e gere de novo. Encurte a descrição do emblema. |
| Apareceram letras inventadas | Confira se o prompt termina com a frase "Do not add any extra text…". Gere de novo. |
| Movimento rápido demais | Troque "pushes in" por "stays almost still with a very subtle push-in". |
| O som ficou ruim | Tire o som no CapCut e use uma música da biblioteca dele. |
