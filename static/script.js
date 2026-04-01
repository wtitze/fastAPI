// 1. Funzione per l'ora
async function aggiornaOra() {
    console.log("Richiesta ora inviata...");
    try {
        const res = await fetch('/ora');
        const json = await res.json();
        document.getElementById('orario').innerText = "Ora del server: " + json.orario;
    } catch (e) {
        console.error("Errore ora:", e);
    }
}

// 2. Funzione per il saluto
async function inviaSaluto() {
    const nome = document.getElementById('input-nome').value;
    if (!nome) return alert("Inserisci un nome!");
    
    try {
        const res = await fetch(`/saluta?nome=${nome}`);
        const json = await res.json();
        document.getElementById('risposta-saluto').innerText = json.messaggio;
    } catch (e) {
        console.error("Errore saluto:", e);
    }
}

// 3. Funzione per le fontanelle (CSV)
async function cercaFontanelle() {
    const quartiere = document.getElementById('input-nil').value;
    if (!quartiere) return alert("Inserisci un quartiere!");

    console.log("Cerco quartiere:", quartiere);

    try {
        const res = await fetch(`/cerca_fontanelle?quartiere=${quartiere}`);
        const dati = await res.json();
        
        const info = document.getElementById('info-risultati');
        const tabella = document.getElementById('tabella-fontanelle');
        const corpo = document.getElementById('corpo-tabella');

        info.innerText = dati.messaggio;
        corpo.innerHTML = "";

        if (dati.fontanelle && dati.fontanelle.length > 0) {
            tabella.style.display = "table";
            dati.fontanelle.forEach(f => {
                // ATTENZIONE: Usiamo i nomi delle colonne del CSV (es: objectID, NIL, CAP)
                const riga = `<tr>
                    <td>${f.objectID}</td>
                    <td>${f.NIL}</td>
                    <td>${f.CAP}</td>
                </tr>`;
                corpo.innerHTML += riga;
            });
        } else {
            tabella.style.display = "none";
        }
    } catch (e) {
        console.error("Errore ricerca fontanelle:", e);
    }
}

// 4. Collegamento dei bottoni (Listener)
// Usiamo i nomi esatti degli ID definiti nell'HTML
console.log("Script JS caricato. Collega i bottoni...");

document.getElementById('btn-ora').addEventListener('click', aggiornaOra);
document.getElementById('btn-saluto').addEventListener('click', inviaSaluto);
document.getElementById('btn-cerca').addEventListener('click', cercaFontanelle);