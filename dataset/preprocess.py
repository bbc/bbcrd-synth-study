#!/usr/bin/env python3

# Alexandros Triantafyllidis, © BBC 2020

import sys
import unicodedata
import re
import nltk.data
import html
from text import _clean_text

# --------------------------------------------------------------------
# This will preprocess a text file so that it can be used as training
# input to a Text-To-Speech system.
#
# In particular, this will:
# * Convert HTML entities into Unicode characters
# * Normalize Unicode characters (see: normalize_unicode)
# * Remove accents from Unicode characters
# * Convert numbers and some symbols into words (see: text._clean_text)
# * Simplify any Unicode characters whose integer representation is >= 128
#     by converting them to the closest ASCII character (simplify_unicode)
# * Remove some punctuation symbols competely (see remove_symbols)
# * And a few other processing steps which can be found in: preprocess

BLOCK_NUM_LINES = 1000
nltk.download('punkt')

# _charMappings is a dict that maps single unicode characters to their
# simplified ASCII versions
_charMappings = {}
# Punctuation, Connector
Pc = {0xfe33: ord('|'), 0xfe34: ord('|')}
_charMappings.update(Pc)
# Punctuation, Dash
Pd = {0x301c: ord('~'), 0x3030: ord('~'), 0xfe31: ord('|'), 0x30a0: ord('=')}
_charMappings.update(Pd)
# Others:
others = {0x2028: ord('\n'), 0x2029: ord('\n'), 0x000D: ord('\n')}
_charMappings.update(others)
# _categoryMappings is a dict that maps whole character categories to a
# single ASCII character
_categoryMappings = {'Cc': ' ',   # Other, Control
                     'Pc': '_',     # Punctuation, Connector
                     'Pd': '-',  # Punctuation, Dash
                     'Pe': ')',  # Punctuation, Close
                     'Pf': '\'',    # Punctuation, Final Quote
                     'Pi': '\'',    # Punctuation, Initial Quote
                     'Ps': '(',  # Punctuation, Open
                     'Zs': ' '  # Separator, Space
                     }
_sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')


def error_print(s):
    sys.stderr.write(s)
    sys.stderr.write("\n")
    sys.stderr.flush()


def print_usage():
    error_print("This tool will preprocess text in a way that makes it ")
    error_print("suitable for feeding it as input to a TTS system.")
    error_print("Usage: %s filename_in" % sys.argv[0])


def is_all_capitals(text):
    for letter in text:
        if letter.islower():
            return False
    return True


def normalize_unicode(text):
    """
    Normalizes a string by converting Unicode characters to their simple
    form when possible. This is done by using Normal Form KC of a string.
    For example, the non-breaking space character (xa0) will be converted
    to a simple space character.
    Reference: http://docs.python.org/library/unicodedata.html
    """
    norm = unicodedata.normalize('NFKC', text)
    return norm


def simplify_unicode(text):
    # _simplNumbers = True
    text = text.translate(_charMappings)
    outString = ""
    for char in text:
        if ord(char) < 128:
            outString += char
            continue
        catMapping = _categoryMappings.get(unicodedata.category(char), None)
        if catMapping:
            outString += catMapping
            continue
        outString += char
    return outString


def remove_accents(text):
    """
    This will remove all accents from a unicode string.
    Especially useful for languages like Greek.
    """
    return ''.join(
        (c for c in unicodedata.normalize('NFD', text)
            if unicodedata.category(c) != 'Mn'))


def fix_spaces(text):
    """
    This deals with spaces at the end of lines
    """
    text = re.sub(r"[ \t]+", r" ", text)
    text = re.sub(r" [\n\r]", r"\n", text)
    text = re.sub(r"[\n\r] ", r"\n", text)
    text = re.sub(r"[\n\r]+", r"\n", text)
    return text.strip()


def clean_text(text):
    """
    This uses Tacotron's text cleaners to do some extra cleaning. For example,
    One of the steps it takes is to convert numbers into words.
    """
    return _clean_text(text, ['english_cleaners'])


def process_chapter_titles(text):
    """
    This can be helpful in Project Gutenberg books, where chapter titles
    are all in capitals and don't have fullstops in the end.
    """
    lines = text.splitlines()
    result = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if is_all_capitals(line):
            if line[-1].isalpha():
                line += "."
        result.append(line)
    return "\n".join(result)


rep_symbols = {
    "(": " ",
    ")": " ",
    "<": " ",
    ">": " ",
    "_": " ",
    "=": " ",
    "#": " ",
    # "\n": " ",
    "\"": " "
}
rep_symbols = dict((re.escape(k), v) for k, v in rep_symbols.items())
pattern_remove_symbols = re.compile("|".join(rep_symbols.keys()))


def remove_symbols(text):
    # This will remove symbols (see also rep_symbols)
    return pattern_remove_symbols.sub(
        lambda m: rep_symbols[re.escape(m.group(0))], text)


def convert_html_to_unicode(content):
    # This will convert html entities into unicode characters.
    # For example, &amp; becomes &
    text = html.unescape(content)
    return text


def remove_duplicate_punctuation(text):
    # Any punctuation which is repeated 2 or more times gets
    # deleted, and only the first repetition is preserved.
    # For example:
    #    "Hello..." -> "Hello."
    #    "Are you serious!?" -> "Are you serious?"
    text = re.sub(r"([^a-zA-Z0-9\s]){2,}", r"\1", text)
    return text


def preprocess(text):
    # This will preprocess text in a way that makes it suitable for
    # feeding it as input to a TTS system.

    # The following line can help with Project Gutenberg books:
    # text = process_chapter_titles(text)
    text = convert_html_to_unicode(text)
    text = normalize_unicode(text)
    text = remove_accents(text)
    text = clean_text(text)
    text = simplify_unicode(text)
    text = remove_symbols(text)
    # convert multiple dots into single commas
    text = re.sub(r"[.]{2,}", ",", text)
    # convert commas at the end of the line into fullstops
    text = re.sub(r",$", ".", text, flags=re.MULTILINE)
    text = remove_duplicate_punctuation(text)
    # Remove preceding spaces from punctuation:
    text = re.sub(r"[ \t]+([\.\?\:\,\;\!])", r"\1", text)
    text = fix_spaces(text)
    # Split in sentences:
    text = "\n".join(_sent_detector.tokenize(text))
    # Remove hyphens from dialogues
    text = re.sub(r"^[\-\s]+", "", text, flags=re.MULTILINE)
    return text


if __name__ == "__main__":
    try:
        filename = sys.argv[1]
    except Exception:
        print_usage()
        sys.exit(1)

    with open(filename, "r", encoding="utf-8") as fin:
        text = fin.read()

    print(preprocess(text))
