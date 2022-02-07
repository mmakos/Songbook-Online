import re

from docx.text.paragraph import Paragraph
from docx.text.run import Run

from str_convert import title_to_unique_name


def get_addons(pars: list[Paragraph]):
    history = False
    paragraphs = list()
    for par in pars:
        par: Paragraph
        if not history and par.style.name == "Heading 2" and par.text == "Historia zmian":
            history = True
        elif history and par.style.name != "Heading 2" and "Tabela chwyt" not in par.text:
            paragraphs.append(par)
    hist_html = __get_history_html(paragraphs)

    return {"historia-zmian": hist_html.replace("\n", "\\r\\n").replace("\"", "\\\"").replace("'", "\\'")}


def __get_html_formatted_text(run: Run) -> str:
    begin = str()
    end = str()

    if len(run.text.strip()) == 0:
        return run.text

    if run.italic:
        begin += "<i>"
        end = "</i>" + end
    if run.bold:
        begin += "<b>"
        end = "</b>" + end
    if run.underline:
        begin += "<u>"
        end = "</u>" + end
    if run.font.subscript:
        begin += "<sub>"
        end = "</sub>" + end
    if run.font.superscript:
        begin += "<sup>"
        end = "</sup>" + end

    stripped = run.text.strip()
    stripped_pos = run.text.find(stripped)

    return run.text[:stripped_pos] + begin + stripped + end + \
           run.text[stripped_pos + len(stripped):]


def __get_history_html(pars):
    html = str()
    ids = __get_ids()
    for par in pars:
        for run in par.runs:
            if run.text == " ":
                html += run.text
                continue
            text = __get_html_formatted_text(run)
            if re.match(r"[0-9]+\.[0-9]+\.?[0-9]*", run.text) or "Poprawion" in text:
                html += "<br>"
            html += __get_text_href(text, ids)
            if not re.match(r"[0-9]+", run.text.strip()):
                html += "<br>"
            if re.match(r"[0-9]+\.[0-9]+\.?[0-9]*", run.text):
                html += "<br>"
            if "Dodan" in text or "Zmniejszone " in text:
                html += "<br>"
    return html[4:]


def __get_ids() -> dict:
    return {line.split("=")[0]: int(line.split("=")[1]) for line in
            open("history/song_ids", "r", encoding="UTF-8").readlines()}


def __get_text_href(text: str, song_ids_dict: dict):
    if text.startswith("-") or not text.startswith("<"):
        title = str(text).strip()
        if title.startswith("-"):
            title = title.replace("-", "").strip()
        title = title_to_unique_name(title)
        if song_ids_dict.get(title, 0) > 0:
            return f"""<a href="/?p={song_ids_dict[title]}">{text}</a>"""
    return text
