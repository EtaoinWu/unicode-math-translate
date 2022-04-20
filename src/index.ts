import unicodeMath from './unicode-math';
import { controlWords } from './UMML';
import { fontPrefixMap, translateFont } from './mathfont-map';
import { TranslateNegateRel } from './negateRel';
import { translateSub, translateSup } from './subsup';
import { defaultAlias, bigTable } from './sublimeUM';

export type optionalTranslation = 'bigTable' | 'umml' | 'defaultAlias' | 'fonts';

export class Translator {
  enables: Record<optionalTranslation, boolean>;
  customCode: { [key: string]: string };
  customAlias: { [key: string]: string };

  constructor(
    args: {
      disable?: optionalTranslation[];
      customCode?: { [key: string]: string };
      customAlias?: { [key: string]: string };
    } = {},
  ) {
    this.customCode = args.customCode || {};
    this.customAlias = args.customAlias || {};
    this.enables = {
      umml: true,
      defaultAlias: true,
      fonts: true,
      bigTable: true,
    };
    if (args.disable !== undefined) {
      for (const x of args.disable) {
        this.enables[x] = false;
      }
    }
  }

  commandTranslate(word: string): string | null {
    if (/^(u|U)([0-9A-Fa-f]{4}|[0-9A-Fa-f]{8})$/g.test(word)) {
      return String.fromCodePoint(parseInt(word, 16));
    }
    if (controlWords.hasOwnProperty(word)) {
      return String.fromCodePoint(parseInt(controlWords[word], 16));
    }

    const firstColon = word.indexOf(':');
    if (firstColon > 0 && firstColon === word.lastIndexOf(':')) {
      const prefix = word.substring(0, firstColon);
      const suffix = word.substring(firstColon + 1);
      return suffix
        .split('')
        .map((c) => {
          const r = this.commandTranslate(prefix + c);
          return r === null ? c : r;
        })
        .join('');
    }

    if (this.enables.fonts) {
      if (word.length > 1) {
        const prefix = word.substring(0, word.length - 1);
        if (fontPrefixMap.hasOwnProperty(prefix)) {
          const suffix = word.substring(word.length - 1);
          const fontface = fontPrefixMap[prefix];
          return translateFont(suffix, fontface);
        }
      }

      if (word.startsWith('_')) {
        return translateSub(word.substring(1));
      } else if (word.startsWith('^')) {
        return translateSup(word.substring(1));
      }
    }

    if (this.enables.umml && unicodeMath.hasOwnProperty(word)) {
      return String.fromCodePoint(unicodeMath[word].codePoint);
    }

    return null;
  }

  translate(input: string, potentialAlias: number = 3): string | null {
    if (this.customCode.hasOwnProperty(input)) {
      return this.customCode[input];
    }

    // potential negate relation
    if (input.startsWith('/')) {
      const word = input.substring(1);
      let result = TranslateNegateRel(word);
      if (result !== null) {
        return result;
      }
      result = this.commandTranslate(word);
      if (result) {
        result = TranslateNegateRel(result);
        if (result !== null) {
          return result;
        }
      }
      result = this.translate(word);
      if (result) {
        result = TranslateNegateRel(result);
        if (result !== null) {
          return result;
        }
      }
      result = this.translate('\\' + word);
      if (result) {
        result = TranslateNegateRel(result);
        if (result !== null) {
          return result;
        }
      }
    }

    if (input.startsWith('\\')) {
      const word = input.substring(1);
      const output = this.commandTranslate(word);
      if (output !== null) {
        return output;
      }
    }

    if (potentialAlias > 2 && this.customAlias.hasOwnProperty(input)) {
      return this.translate(this.customAlias[input], 2);
    }
    if (this.enables.defaultAlias && potentialAlias > 1 && defaultAlias.hasOwnProperty(input)) {
      return this.translate(defaultAlias[input], 1);
    }

    if (this.enables.bigTable && input.startsWith('\\')) {
      const word = input.substring(1);
      if (bigTable.hasOwnProperty(word)) {
        return bigTable[word];
      }
    }
    return null;
  }
}
