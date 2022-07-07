import datetime

vote_end = datetime.datetime(2022, 6, 24, 23, 59, 59)
now = datetime.datetime.now()
time_left = vote_end - now
hours, remainder = divmod(time_left.seconds, 3600)
minutes, seconds = divmod(remainder, 60)

print(f"{time_left.days} dni, {int(hours)} godzin, {int(minutes)} minut, {int(seconds)} sekund")

print(vote_end - now)

