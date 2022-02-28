# Update śpiewnika

- Wygenerować plik HTML
- Wygenerować skrypt SQL
- Zaktualizować bazę danych
- Jeśli chcemy zaktualizować link do nowej piosenki w historii zmian, to należy wykonać powyższe kroki ponownie

## Generowanie plików HTML

`python convert.py`

- Skopiować plik `.docx` do katalogu `docx` (jeżeli dodajemy nową piosenkę to należy także skopiować plik `.htm`, aby skrypt wygenerował autorów)
- Zmienić wartość `version` na obecną wersję śpiewnika
- Uruchomić skrypt
- Sprawdzić, czy wszystkie piosenki mają autorów

## Generowanie skryptu SQL

`python generate_sql.py`