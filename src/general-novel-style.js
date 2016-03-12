"use strict";

import {RuleHelper} from "textlint-rule-helper";
import kansuji from "kansuji";

const defaultOptions = {
    // 各段落の先頭に許可する文字
    "chars_leading_paragraph": "　「『【〈《（(“\"‘'［[〔｛{＜<",
    // 閉じ括弧の手前に句読点(。、)を置かない
    "no_punctuation_at_closing_quote": true,
    // 疑問符(？)と感嘆符(！)の直後にスペースを置く
    "space_after_marks": true,
    // 連続した三点リーダー(…)の数は偶数にする
    "even_number_ellipsises": true,
    // 連続したダッシュ(―)の数は偶数にする
    "even_number_dashes": true,
    // 連続した句読点(。、)を許可しない
    "appropriate_use_of_punctuation": true,
    // 連続した中黒(・)を許可しない
    "appropriate_use_of_interpunct": true,
    // 連続した長音符(ー)を許可しない
    "appropriate_use_of_choonpu": true,
    // マイナス記号(−)は数字の前にしか許可しない
    "appropriate_use_of_minus_sign": true,
    // アラビア数字の桁数は2桁まで (false: チェックしない)
    "max_arabic_numeral_digits": 2
};

function repeat(str, n) {
    if (String.prototype.repeat) return String.prototype.repeat.call(str, n);
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(str);
    return arr.join("");
}

function reporter(context, options = {}) {
    const opts = Object.assign({}, defaultOptions, options);
    const charsLeadingParagraph = opts["chars_leading_paragraph"] || "";
    const noPunctuationAtClosingQuote = opts["no_punctuation_at_closing_quote"];
    const spaceAfterMarks = opts["space_after_marks"];
    const evenNumberEllipsises = opts["even_number_ellipsises"];
    const evenNumberDashes = opts["even_number_dashes"];
    const appropriateUseOfPunctuation = opts["appropriate_use_of_punctuation"];
    const appropriateUseOfInterpunct = opts["appropriate_use_of_interpunct"];
    const appropriateUseOfChoonpu = opts["appropriate_use_of_choonpu"];
    const appropriateUseOfMinusSign = opts["appropriate_use_of_minus_sign"];
    const maxArabicNumeralDigits = opts["max_arabic_numeral_digits"];

    let helper = new RuleHelper(context);
    let {Syntax, RuleError, fixer, report, getSource} = context;
    return {
        [Syntax.Paragraph](node) {
            if (helper.isChildNode(node, [Syntax.BlockQuote])) {
                return;
            }

            return new Promise((resolve, reject) => {
                const text = getSource(node);

                const reportMatches = ({pattern, test, message, indexer, fixer}) => {
                    let matches;
                    pattern.lastIndex = 0;
                    while (matches = pattern.exec(text)) {
                        if (!test || test.apply(null, matches)) {
                            const range = [matches.index, matches.index + matches[0].length];
                            const args  = [range].concat(matches);
                            const index = indexer ? indexer.apply(null, args) : matches.index;
                            const fix   = fixer ? fixer.apply(null, args) : null;
                            report(node, new RuleError(message, { index, fix }));
                        }
                    }
                };

                if (charsLeadingParagraph) {
                    if (charsLeadingParagraph.indexOf(text.charAt(0)) == -1) {
                        report(node, new RuleError(`段落の先頭に許可されていない文字が存在しています`, {
                            fix: fixer.insertTextBeforeRange([0, 0], charsLeadingParagraph[0])
                        }));
                    }
                }

                if (noPunctuationAtClosingQuote) {
                    reportMatches({
                        pattern: /[。、]+(?=[」』】〉》）\)”"’'］\]〕｝\}＞>])/g,
                        message: "句読点(。、)が閉じ括弧の直前に存在しています",
                        indexer: (range) => range[1] - 1,
                        fixer:   (range) => fixer.removeRange(range),
                    });
                }

                if (spaceAfterMarks) {
                    reportMatches({
                        pattern: /[？！](?![　？！」』】〉》）\)”"’'］\]〕｝\}＞>]|$)/g,
                        message: "感嘆符(！)・疑問符(？)の直後にスペースか閉じ括弧が必要です",
                        fixer:   (range) => fixer.insertTextAfterRange(range, "　"),
                    });
                }

                if (evenNumberEllipsises) {
                    reportMatches({
                        pattern: /…+/g,
                        test:    (s) => s.length % 2 == 1,
                        message: "連続した三点リーダー(…)の数が偶数ではありません",
                        fixer:   (range) => fixer.insertTextAfterRange(range, "…"),
                    });
                }

                if (evenNumberDashes) {
                    reportMatches({
                        pattern: /―+/g,
                        test:    (s) => s.length % 2 == 1,
                        message: "連続したダッシュ(―)の数が偶数ではありません",
                        fixer:   (range) => fixer.insertTextAfterRange(range, "―"),
                    });
                }

                if (appropriateUseOfPunctuation) {
                    reportMatches({
                        pattern: /。。+|、、+/g,
                        message: "連続した句読点(。、)が使われています",
                        fixer:   (range, s) => fixer.replaceTextRange(range, repeat("……", Math.ceil(s.length / 3))),
                    });
                }

                if (appropriateUseOfInterpunct) {
                    reportMatches({
                        pattern: /・・+/g,
                        message: "連続した中黒(・)が使われています",
                        fixer:   (range, s) => fixer.replaceTextRange(range, repeat("……", Math.ceil(s.length / 3))),
                    });
                }

                if (appropriateUseOfChoonpu) {
                    reportMatches({
                        pattern: /ーー+/g,
                        message: "連続した長音符(ー)が使われています",
                        fixer:   (range, s) => fixer.replaceTextRange(range, repeat("――", Math.ceil(s.length / 2))),
                    });
                }

                if (appropriateUseOfMinusSign) {
                    reportMatches({
                        pattern: /−(?![0-9０１２３４５６７８９〇一二三四五六七八九十])/g,
                        message: "マイナス記号(−)の直後が数字ではありません",
                        fixer:   (range, s) => fixer.replaceTextRange(range, "ー"),
                    });
                }

                if (typeof maxArabicNumeralDigits == "number") {
                    reportMatches({
                        pattern: /([0-9０１２３４５６７８９]+)(?:[\.．]([0-9０１２３４５６７８９]+))?/g,
                        test:    (s, a, b) => a.length > maxArabicNumeralDigits || (b && b.length > maxArabicNumeralDigits),
                        message: `${maxArabicNumeralDigits}桁を超えるアラビア数字が使われています`,
                        fixer:   (range, s) => fixer.replaceTextRange(range, kansuji(s, { wide: true })),
                    });
                }

                resolve();
            });
        }
    };
}

export default {
    linter: reporter,
    fixer: reporter,
}
