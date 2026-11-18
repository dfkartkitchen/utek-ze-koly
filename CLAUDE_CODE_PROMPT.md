# Prompt pro Claude Code: Útěk ze školy → GitHub + Netlify

Zkopíruj celý text pod čarou do Claude Code. Spusť ho ve složce, kam jsi rozbalil ZIP
(ve složce `utek-ze-skoly`, kde leží `index.html`, `netlify.toml`, `README.md`, `.gitignore`).

---

Jsi v kořeni projektu **Útěk ze školy**. Je to hotová 3D hra v prohlížeči v jediném souboru `index.html`
(asi 7 MB, Three.js, fonty, zvuky a textury jsou vložené uvnitř, žádné externí domény). Projekt nemá build ani npm závislosti.
Ve složce už jsou připravené soubory `netlify.toml` (publish = ".", bez buildu, index.html bez dlouhé cache), `.gitignore` a `README.md`.

Cíl: dostat hru na GitHub a nasadit ji na Netlify tak, aby se každý push do `main` automaticky nasadil
a hru šlo hrát kliknutím na veřejný odkaz bez přihlášení.

Pravidla:
- Komunikuj česky, věcně a v krocích. U každého příkazu řekni, v jaké složce se spouští.
- Kroky v prohlížeči (GitHub, Netlify, registrátor domény) dělám já ručně. Napiš mi přesně, kam kliknout.
- Před akcemi s dopadem na produkci (první push do `main`, propojení s Netlify, změna DNS) se zeptej a počkej na potvrzení.
- Tajné hodnoty (tokeny, hesla) nikdy nevypisuj ani necommituj.
- Soubor `index.html` upravuj jen když o to požádám (obsahuje i napojení multiplayeru `relayNS`), jinak ho jen verzuj a nasazuj. Pokud něco v něm vypadá jako chyba, řekni mi to a počkej.
- Víc změn dávej do jednoho commitu, protože každé nasazení na Netlify spotřebuje kredity.
- Co se mohlo změnit (rozhraní Netlify, IP adresy pro DNS, tarify), ověř v aktuální dokumentaci a neber z hlavy.

Postup:

1. **Kontrola projektu.** Ověř, že ve složce je `index.html`, `netlify.toml`, `.gitignore`, `README.md`.
   Zkontroluj, že `index.html` neodkazuje na externí skripty ani fonty (hledej `http://` a `https://` v atributech `src` a `href`)
   a vypiš mi výsledek. Zjisti, jestli mám nainstalované `git`, `gh` (GitHub CLI) a `netlify` (Netlify CLI), a jestli jsem v nich přihlášený.

2. **Git.** Pokud tu ještě není repozitář: `git init -b main`, přidej všechny soubory a vytvoř commit „Útěk ze školy – první verze“.

3. **GitHub.** Zeptej se mě, pod jakým účtem nebo organizací a s jakým názvem má repozitář vzniknout
   (návrh: `utek-ze-skoly`) a jestli má být veřejný, nebo soukromý.
   - Když mám `gh` a jsem přihlášený, vytvoř repozitář přes `gh repo create` a po mém potvrzení pushni `main`.
   - Když `gh` nemám, napiš mi, jak na github.com vytvořit **prázdný** repozitář (bez README a bez .gitignore),
     pak přidej `origin` a po mém potvrzení pushni.
   - Kdyby GitHub odmítl soubor kvůli velikosti, zastav se a řekni mi to (limit je 100 MB, hra má asi 7 MB, takže by to mělo projít).

4. **Netlify.** Preferuj propojení přes rozhraní Netlify, aby fungovalo automatické nasazení z GitHubu:
   napiš mi kroky **Add new site → Import an existing project → GitHub → vybrat repozitář**.
   Nastavení buildu se načte z `netlify.toml` (žádný build command, publish directory `.`).
   Pokud mám Netlify CLI a chci to udělat z terminálu, nabídni `netlify init` a proveď ho až po mém souhlasu.
   Upozorni mě, že **Site/Team protection** nesmí chránit produkci, jinak by hráči viděli přihlašovací stránku Netlify.

5. **Ověření.** Až bude web nasazený, otevři nebo mi pošli adresu `*.netlify.app` a projdi se mnou kontrolu:
   načte se úvodní obrazovka, tvorba postavy, spustí se singleplayer, funguje zvuk, hra jde ovládat na mobilu.
   Multiplayer na Netlify vyžaduje jednorázově nasadit server ze složky `relay/` a vyplnit `mp-config.js` (viz `relay/README.md`).

6. **Vlastní doména (volitelné, zeptej se mě, jestli ji chci).** Například `hra.dfkstudio.cz`:
   - Netlify: **Domain management → Add a domain → Add a domain you already own**.
   - DNS nech u registrátora (nepoužívej Netlify DNS ani neměň nameservery, pokud na doméně běží pošta).
     U subdomény stačí záznam **CNAME** `hra` → `<název-webu>.netlify.app.` Přesný cíl si ověř v Domain management na Netlify.
   - Pak **HTTPS → Verify DNS configuration** a počkej na certifikát Let's Encrypt.

7. **Aktualizace do budoucna.** Na konci mi napiš krátký návod: novou verzi hry uložím jako `index.html` do této složky,
   pak `git add index.html && git commit -m "Nová verze hry" && git push` a Netlify ji sám nasadí.
   Přidej tento návod i do `README.md` (jako samostatný commit spolu s případnými dalšími úpravami).

Na konci shrň: adresu repozitáře, adresu webu na Netlify, případně vlastní doménu, a co zbývá udělat.
