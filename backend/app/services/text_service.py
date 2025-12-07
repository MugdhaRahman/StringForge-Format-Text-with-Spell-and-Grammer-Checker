import re
from typing import List
from spellchecker import SpellChecker


class TextService:
    def __init__(self):
        self.spell = SpellChecker()

    def clean(self, text: str) -> str:
        trimmed = text.strip()
        single_spaced = re.sub(r'\s{2,}', ' ', trimmed)
        normalized_newlines = re.sub(r'\n{2,}', '\n', single_spaced)
        return normalized_newlines

    def slug(self, text: str) -> str:
        lower = text.lower()
        replaced_spaces = re.sub(r'\s+', '-', lower)
        stripped = re.sub(r'[^a-z0-9-]', '', replaced_spaces)
        collapsed = re.sub(r'-+', '-', stripped)
        return collapsed.strip('-')

    def to_camel(self, text: str) -> str:
        parts = self._split_words(text)
        if not parts:
            return ''
        return parts[0].lower() + ''.join(w.title() for w in parts[1:])

    def to_snake(self, text: str) -> str:
        return '_'.join(self._split_words(text)).lower()

    def to_title(self, text: str) -> str:
        return ' '.join(w.title() for w in self._split_words(text))

    def spell_check(self, text: str) -> str:
        words = text.split()
        corrected = []
        for w in words:
            if w.isalpha() and w.lower() in self.spell:  # likely correct
                corrected.append(w)
            else:
                suggestion = self.spell.correction(w) or w
                corrected.append(suggestion)
        return ' '.join(corrected)

    def _split_words(self, text: str) -> List[str]:
        normalized = re.sub(r'[_\-]+', ' ', text)
        spaced = re.sub(r'(?<!^)([A-Z])', r' \1', normalized)
        tokens = re.split(r'\s+', spaced.strip())
        return [t for t in tokens if t]
