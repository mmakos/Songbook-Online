import datetime
import os

from convert import VERSION
from str_convert import replace_date


def get_title(song_html: str) -> str:
    start = song_html.find("<h2>") + 4
    end = song_html.find("</h2>")
    return song_html[start:end].replace("\"", "\\\"").replace("'", "\\'")


def get_song_content_sql(song_html: str) -> str:
    start = song_html.find("<table>")
    end = song_html.find("</table>") + 8
    return f"<div id=\"song\">{song_html[start:end]}</div>" \
        .replace("\n", "\\r\\n").replace("\"", "\\\"").replace("'", "\\'")


category = {
    "Kaczmarski & Gintrowski": 3,
    "Obozowe": 4,
    "Patriotyczne": 5,
    "Kolędy": 6,
    "Religijne": 7,
    "Dodatki": 33,
}

static_posts_id = {
    "historia-zmian": (41, "Historia zmian"),
}

insert_post = "INSERT INTO ahsoka_posts " \
              "(ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, " \
              "comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, " \
              "post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)" \
              " VALUES " \
              "('%s', '1', CURRENT_TIME(), CURRENT_TIME(), '%s', '%s', '', 'publish', 'closed', 'open', '', " \
              "'%s', '', '', CURRENT_TIME(), CURRENT_TIME(), '', '%s', " \
              "'http://www.mmakos.pl/?p=%s', '0', 'post', '', '0');"

update_post = "UPDATE ahsoka_posts SET post_modified = CURRENT_TIME(), post_modified_gmt = CURRENT_TIME(), post_content = '%s' WHERE ID = %s;"

insert_relation = "INSERT INTO ahsoka_term_relationships" \
                  "(object_id, term_taxonomy_id, term_order)" \
                  " VALUES (%s, %s, 0);"

if not os.path.exists("history"):
    os.mkdir("history")
try:
    song_ids = {line.split("=")[0]: int(line.split("=")[1]) for line in
                open("history/song_ids", "r", encoding="UTF-8").readlines()}
    new_song_id = max(song_ids.values()) + 1
except (FileNotFoundError, ValueError):
    song_ids = dict()
    new_song_id = 1000

with open("sql/songbook.sql", "w", encoding="UTF-8") as sql_file, open("history/song_ids", "w",
                                                                       encoding="UTF-8") as map_file:
    # sql_file.write("DELETE FROM ahsoka_posts WHERE ID >= 1000 AND ID < 10000\n\n")
    # sql_file.write("DELETE FROM ahsoka_term_relationships WHERE object_id >= 1000 AND object_id < 10000\n\n\n\n")

    for song_cat in os.listdir("songbook-online"):
        for song in os.listdir(os.path.join("songbook-online", song_cat)):
            with open(os.path.join("songbook-online", song_cat, song), "r", encoding="UTF-8") as file:
                song_content = file.read()

                new_song = False
                try:
                    with open(os.path.join("history/songbook-online", song_cat, song), "r",
                              encoding="UTF-8") as history_file:
                        no_changes = song_content == history_file.read()
                except FileNotFoundError:
                    new_song = True
                    no_changes = False

                if song_cat != "Dodatki":
                    song_id = song_ids.get(song[:-5], new_song_id)
                    if song_id == new_song_id:
                        new_song_id += 1
                        new_song = True
                else:
                    song_id = static_posts_id[song[:-5]][0]
                    song_title = static_posts_id[song[:-5]][1]

                if not no_changes:
                    if song_cat != "Dodatki":
                        song_content_sql = get_song_content_sql(song_content)
                    else:
                        song_content_sql = song_content

                    if new_song:
                        if song_cat != "Dodatki":
                            song_title = get_title(song_content)
                        sql_file.write(insert_post % (song_id, song_content_sql, song_title, song[:-5], category[song_cat], song_id))
                        sql_file.write("\n")
                        sql_file.write(insert_relation % (song_id, category[song_cat]))
                    else:
                        sql_file.write(update_post % (song_content_sql, song_id))

                    sql_file.write("\n\n")

                    if not os.path.exists(os.path.join("history/songbook-online", song_cat)):
                        os.makedirs(os.path.join("history/songbook-online", song_cat))
                    with open(os.path.join("history/songbook-online", song_cat, song), "w",
                              encoding="UTF-8") as history_file:
                        history_file.write(song_content)

                map_file.write(f"""{song[:-5]}={song_id}\n""")

    with open("templates/contact.html", "r", encoding="utf-8") as contact:
        month = replace_date(int(datetime.datetime.now().strftime("%m")))
        contact_html = contact.read().replace("\n", "\\r\\n").replace("\"", "\\\"").replace("'", "\\'")\
                       % (VERSION, datetime.datetime.now().strftime(f"%d {month} %Y"))
        sql_file.write("UPDATE ahsoka_posts SET post_modified = CURRENT_TIME(), post_modified_gmt = CURRENT_TIME(), post_content = '%s' WHERE ID = 45;"\
                       % contact_html)
