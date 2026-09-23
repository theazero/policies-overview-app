# Rekryteringscase – Försäkringsöversikt

Välkommen! Det här är ett litet kodcase som vi använder för att se hur du tänker och kodar. Det är okej att använda AI-verktyg – vi förutsätter bara att du förstår all kod du lämnar in och kan förklara dina val.

## Tidsuppskattning

Räkna med ungefär **3–4 timmar**. Det är helt okej om inte allt hinns med eller är perfekt – vi tittar på koden du skrivit och pratar om dina val.

## Uppgiften

Bygg en vy där en kund kan se en översikt av sina tecknade försäkringar.

### Datahämtning

Hämta försäkringar från följande endpoint:

```
GET {VITE_API_BASE_URL}/policies/List
```

Se till att hantera de tre tillstånden som kan uppstå vid hämtning:

- **Loading** – nåt händer, visa det för användaren
- **Error** – något gick fel, visa ett felmeddelande
- **Tomt svar** – inga försäkringar hittades, visa ett tomt tillstånd

### Funktionalitet

Användaren ska kunna:

- Filtrera listan på **produktnamn**
- Filtrera listan på **status**
- **Bonus:** Paginering där 5 kort visas per sida (om tid finns)

### Design

Följ den bifogade designen så gott det går. Du hittar den i [`src/assets/overview.png`](src/assets/overview.png).

Några saker att notera i designen:

- **Filterpanelen är dold som standard** – den öppnas via "Filtrera"-knappen och stängs med krysset
- **Filtren appliceras via en knapp** – "Visa försäkringar" i panelen triggar filtreringen (inte live-filtrering)
- **Inaktiva kort får en indikator** – en röd tagg ("Din försäkring har avslutats") visas i kortets header
- **Paginerings-texten** – "Visar 1–5 av 15 försäkringar" visas under pagineringen och ska reflektera aktuellt urval

## Tekniska riktlinjer

- Projektet är uppsatt med **TypeScript** – vi vill se typade props och API-respons
- Tredjepartsbibliotek är tillåtna (t.ex. för datahämtning eller styling)
- Vi ser gärna att du bygger egna komponenter istället för att använda ett komponentbibliotek
- Vyn ska fungera bra på mindre skärmar (surfplatta/mobil)

## Git

Skapa ett eget repo på GitHub (eller motsvarande) och committa löpande under arbetets gång. Undvik att samla allt i en enda stor commit i slutet.

## Inlämning

Skicka länken till ditt repo via mail till [erika.loman-frost@gjensidige.se](mailto:erika.loman-frost@gjensidige.se).

## Kom igång

```bash
yarn install
yarn dev
```
