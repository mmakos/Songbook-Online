replacements = {
    u'ę': 'e',
    u'ó': 'o',
    u'ą': 'a',
    u'ś': 's',
    u'ł': 'l',
    u'ż': 'z',
    u'ź': 'z',
    u'ć': 'c',
    u'ń': 'n'
}

date_replacements = (
    "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"
)


def replace(string):
    return ''.join(replacements.get(c, c) for c in string)


def replace_date(month):
    return date_replacements[month - 1]
