# Multiplayer server (Cloudflare Worker)

Netlify umí jen statické stránky, ne trvalé spojení mezi hráči. Proto multiplayer na webu běží přes
tento malý server na Cloudflare Workers (free plán). Každá herní místnost (kód hry) je jeden Durable Object,
který si pamatuje stav připojených hráčů a rozesílá změny ostatním. Žádná data se neukládají natrvalo.

## Nasazení

Server je nasazený přes **Cloudflare → Workers & Pages → Import a repository** z tohoto repozitáře
(projekt `utek-ze-koly`, Root directory `/relay`, Deploy command `npx wrangler deploy`).
Každý push do `main` ho na Cloudflare sestaví znovu. Adresa: `https://utek-ze-koly.dfkartkitchen.workers.dev`.
Název projektu na Cloudflare musí odpovídat `name` ve `wrangler.toml`.

### Alternativa: nasazení z vlastního počítače (Node.js 18+)

```bash
cd relay
npm install
npx wrangler login      # otevře prohlížeč, přihlas se / zaregistruj na Cloudflare (zdarma)
npx wrangler deploy
```

Wrangler na konci vypíše adresu, např. `https://utek-ze-koly.tvuj-ucet.workers.dev`.
Otevři ji v prohlížeči – má se ukázat „Útěk ze školy relay OK“.

Pak v kořeni projektu uprav `mp-config.js`:

```js
window.UTEK_RELAY = "wss://utek-ze-koly.tvuj-ucet.workers.dev";
```

(pozor: `wss://` místo `https://`). Commit + push a Netlify hru nasadí s funkčním multiplayerem.

## Zabezpečení (doporučeno)

V `wrangler.toml` nastav `ALLOWED_ORIGINS` na adresy, kde hra běží, a znovu spusť `npx wrangler deploy`:

```toml
ALLOWED_ORIGINS = "https://utek-ze-skoly.netlify.app,https://hra.dfkstudio.cz"
```

Pak se k serveru nepřipojí cizí weby. Prázdná hodnota povoluje všechny.

## Lokální test

```bash
cd relay && npx wrangler dev --port 8787
```

a v `mp-config.js` dočasně `window.UTEK_RELAY = "ws://127.0.0.1:8787";`, hru pak otevři přes lokální web server
(např. `python3 -m http.server 8080` v kořeni projektu) ve dvou oknech.

## Limity

Free plán Cloudflare Workers stačí pro běžné hraní s kamarády nebo třídou. Každý hráč posílá svůj stav 10× za sekundu;
server přijme nejvýš 24 spojení na místnost (hra sama pustí 20 hráčů). Aktuální limity free plánu ověř
v dokumentaci Cloudflare (Workers → Pricing).
