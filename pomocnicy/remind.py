import csv
import os

# mail
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

import discord

originator = "pomocnicy@kik.waw.pl"
password = os.getenv("mail_pass")

# discord
token = os.getenv('discord_token')

MAX_SONGS = 3
MAX_VOTES = 7

pomocnicy = list()


def createMail(pom: dict) -> str:
    return f"""\
Cześć {pom["name"]},

Przypominamy, że został ostatni dzień na głosowanie i zgłaszanie nowych piosenek na stronie https://spiewnik.mmakos.pl/pomocnicy-2022/?token={pom["token"]}.
Twój osobisty token dostępu to: {pom["token"]}.

{getSongsMsg(pom["songs"], isWoman(pom))}

{getVoteMsg(pom["votes"], len(pom["songs"]), isWoman(pom))}

Pozdrawiamy,
Kadra kursu pomocników 2022
Odwiedź: www.pomocnicy.kik.waw.pl
    """


def getSongsMsg(songs, isWoman):
    if len(songs) <= 0:
        return f"""Nie zgłosił{"a" if isWoman else "e"}ś jeszcze żadnej piosenki, a fajnie by było jakbyś to zrobił{"a" if isWoman else ""}. Przypominamy, że możesz zgłosić w sumie 3 piosenki. Jak nie masz pomysłu, to możesz podpytać kogoś - może ktoś chciał coś jeszcze dodać, ale już nie może i sprzeda Ci jakiś pomysł na piosenkę."""
    song_msg = f"""Dzięki za zgłoszenie {"piosenek:" if len(songs) > 1 else "piosenki"} {", ".join(songs)}."""
    if len(songs) >= MAX_SONGS:
        song_msg += f" Dzięki za wykorzystanie wszystkich możliwości. Jeżeli masz jeszcze jakiś pomysł, to możesz podsunąć go innym, bo wiele osób jeszcze nic nie zgłosiło."
    else:
        song_msg += f""" Możesz zgłosić jeszcze {MAX_SONGS - len(songs)} {"piosenki" if len(songs) > 1 else "piosenkę"}."""
    return song_msg


def getVoteMsg(votes, songs_len: int, isWoman):
    if len(votes) <= 0:
        return f"""Nie zagłosował{"a" if isWoman else "e"}ś{" również jeszcze na żadną piosenkę" if songs_len <= 0 else f" za to jeszcze na żadną piosenkę, a fajnie by było jakbyś to zrobił{'a' if isWoman else ''}"}. Możesz zagłosować na 7 wybranych piosenek, w tym dodanych przez siebie."""
    votes_msg = f"""Dzięki {"za to" if songs_len <= 0 else "również"} za zagłosowanie na {"piosenki:" if len(votes) > 1 else "piosenkę"} {", ".join(votes)}."""
    if len(votes) >= MAX_VOTES:
        votes_msg += f" Dzięki za wykorzystanie wszystkich możliwości. Jeżeli masz jeszcze jakiś pomysł, to możesz podsunąć go innym, bo wiele osób jeszcze nic nie zgłosiło."
    else:
        song_form = "piosenki" if MAX_VOTES - len(votes) < 5 else "piosenek"
        if MAX_VOTES - len(votes) <= 1:
            song_form = "piosenkę"
        votes_msg += f""" Możesz zagłosować jeszcze na {MAX_VOTES - len(votes)} {song_form}."""
    return votes_msg


def isWoman(pomocnik):
    if pomocnik["name"].endswith("a") or pomocnik["name"] == "Ehli":
        return True
    return False


def send_emails(pomocnicy):
    print("SEND MAILS")
    # context = ssl.create_default_context()
    # server = smtplib.SMTP("smtp.gmail.com", 587)
    # server.ehlo()
    # server.starttls(context=context)
    # server.ehlo()
    # server.login(originator, password)

    for pomocnik in pomocnicy:
        print(f"""Send to: {pomocnik["name"]} {pomocnik["lastName"]} <{pomocnik["mail"]}>""")

        mime_msg = MIMEMultipart()

        mime_msg['From'] = formataddr(("Pomocnicy", originator))
        mime_msg['To'] = formataddr((f"""{pomocnik["name"]} {pomocnik["lastName"]}""", pomocnik["mail"]))
        mime_msg['Subject'] = "Głosowanie na piosenki do śpiewnika pomocników 2022 - ostatni dzień"
        mime_msg.attach(MIMEText(createMail(pomocnik)))
        print(createMail(pomocnik))

        # server.sendmail(originator, pomocnik["mail"], mime_msg.as_string())
    #server.quit()
    print()


def send_discord_msgs():
    print("SEND DISCORD MESSAGES")
    intents = discord.Intents.default()
    intents.members = True
    client = discord.Client(intents=intents)

    async def send_to_member(member):
        member_name = member.nick if member.nick is not None else member.name
        if "Domardzki" in member_name:
            member_name = "Ori Domaradzki"
        print(f"Send to: {member_name}")
        try:
            pomocnik = get_pomocnik(member_name)
            if pomocnik is not None:
                msg_to_member = createMail(pomocnik)
                await member.send(msg_to_member)

        except Exception:
            print(f"Unable to send to: {member_name}")

    @client.event
    async def on_ready():
        for member in client.get_guild(968811982985785345).members:
            await send_to_member(member)

    client.run(token)


def get_pomocnik(name):
    for pomocnik in pomocnicy:
        if f"""{pomocnik["name"]} {pomocnik["lastName"]}""" == name:
            return pomocnik

    return None


def get_pomocnik_by_token(token):
    for pomocnik in pomocnicy:
        if pomocnik["token"] == token:
            return pomocnik

    return None


def read_csv():
    with open(f"users.csv", encoding="UTF-8") as users, open(f"songs.csv", encoding="UTF-8") as songs, open(f"votes.csv", encoding="UTF-8") as votes:
        users_reader = csv.reader(users, delimiter=',')
        songs_reader = csv.reader(songs, delimiter='$')
        votes_reader = csv.reader(votes, delimiter='$')

        for row in users_reader:
            pomocnicy.append({"token": row[0],
                     "name": row[1],
                     "lastName": row[2],
                     "mail": row[3],
                     "songs": list(),
                     "votes": list()})

        for row in votes_reader:
            pomocnik = get_pomocnik_by_token(row[0])
            if pomocnik is not None:
                pomocnik["votes"].append(row[1])

        for row in songs_reader:
            pomocnik = get_pomocnik_by_token(row[0])
            if pomocnik is not None:
                pomocnik["songs"].append(row[1])


read_csv()
send_emails(pomocnicy)
send_discord_msgs()
