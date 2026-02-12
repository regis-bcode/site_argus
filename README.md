# Site institucional — BAUMGRATZ CODE | ARGUS Watch

Site corporativo em HTML/CSS/JS vanilla, pronto para GitHub Pages (Project Pages).

## Rodar localmente
- Opção 1: abrir `index.html` no navegador.
- Opção 2 (recomendado): servidor local simples.

```bash
python3 -m http.server 8080
```

Acesse: `http://localhost:8080`.

## Publicar no GitHub Pages
1. Vá em **Settings → Pages**.
2. Em **Build and deployment**, selecione **Deploy from branch**.
3. Escolha a branch `main` e pasta `/root`.
4. Salve e aguarde a publicação.

## Nota sobre subdiretório (/repo)
O JavaScript implementa `BASE_PATH` + função `href(path)` para montar links internos/recursos sem quebrar em Project Pages (`https://usuario.github.io/repo`).

## Checklist de go-live
- Substituir placeholders `[PREENCHER: ...]`.
- Inserir logos finais em `assets/img/`.
- Trocar `assets/img/og-cover.svg` e `assets/img/hero.svg` pelas artes finais.
- Revisar `sitemap.xml` e `robots.txt` com URL final.
- Validar contatos comerciais e conteúdo jurídico da página de privacidade.
