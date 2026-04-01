from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import pandas as pd
import os

app = FastAPI()

# Montiamo la cartella static (assicurati che esista!)
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- CARICAMENTO DATI CON PANDAS ---
# Il tuo file usa il punto e virgola ';' come separatore
FILE_CSV = "vedovelle_20260315-233003_final.csv"

if os.path.exists(FILE_CSV):
    # Leggiamo il CSV specificando il separatore corretto
    df_fontanelle = pd.read_csv(FILE_CSV, sep=';', encoding='utf-8')
    # Puliamo i nomi dei NIL da eventuali spazi bianchi extra
    df_fontanelle['NIL'] = df_fontanelle['NIL'].str.strip()
    print(f"Dataset caricato con successo! Righe: {len(df_fontanelle)}")
else:
    print(f"ERRORE: File {FILE_CSV} non trovato!")
    df_fontanelle = pd.DataFrame()

@app.get("/")
def home():
    return FileResponse('static/index.html')

@app.get("/ora")
def dammi_ora():
    return {"orario": datetime.now().strftime("%H:%M:%S")}

@app.get("/saluta")
def saluta_utente(nome: str):
    return {"messaggio": f"Ciao {nome}!"}

@app.get("/cerca_fontanelle")
def cerca_fontanelle(quartiere: str):
    if df_fontanelle.empty:
        return {"messaggio": "Database non disponibile", "fontanelle": []}

    # Trasformiamo l'input dell'utente in maiuscolo (come nel CSV)
    quartiere_cercato = quartiere.strip().upper()
    
    # Filtro Pandas: cerchiamo corrispondenze esatte o parziali
    # Usiamo str.contains se vogliamo essere più flessibili, 
    # o == per la corrispondenza esatta richiesta
    risultato = df_fontanelle[df_fontanelle['NIL'] == quartiere_cercato]
    
    if risultato.empty:
        return {
            "messaggio": f"Nessuna fontanella trovata per il quartiere: {quartiere_cercato}",
            "fontanelle": []
        }
    
    return {
        "messaggio": f"Trovate {len(risultato)} fontanelle a {quartiere_cercato}",
        "fontanelle": risultato.to_dict(orient="records")
    }