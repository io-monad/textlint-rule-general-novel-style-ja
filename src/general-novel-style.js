"use strict";

import {RuleHelper} from "textlint-rule-helper";

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
    // 連続した中黒(・)を許可しない
    "appropriate_use_of_interpunct": true,
    // 連続した長音符(ー)を許可しない
    "appropriate_use_of_choonpu": true,
    // マイナス記号(−)は数字の前にしか許可しない
    "appropriate_use_of_minus_sign": true,
    // アラビア数字の桁数は2桁まで (false: チェックしない)
    "max_arabic_numeral_digits": 2
};

export default function (context, options = {}) {
    const opts = Object.assign({}, defaultOptions, options);
    const charsLeadingParagraph = opts["chars_leading_paragraph"] || "";
    const noPunctuationAtClosingQuote = opts["no_punctuation_at_closing_quote"];
    const spaceAfterMarks = opts["space_after_marks"];
    const evenNumberEllipsises = opts["even_number_ellipsises"];
    const evenNumberDashes = opts["even_number_dashes"];
    const appropriateUseOfInterpunct = opts["appropriate_use_of_interpunct"];
    const appropriateUseOfChoonpu = opts["appropriate_use_of_choonpu"];
    const appropriateUseOfMinusSign = opts["appropriate_use_of_minus_sign"];
    const maxArabicNumeralDigits = opts["max_arabic_numeral_digits"];

    let helper = new RuleHelper(context);
    let {Syntax, RuleError, report, getSource} = context;
    return {
        [Syntax.Paragraph](node) {
            if (helper.isChildNode(node, [Syntax.BlockQuote])) {
                return;
            }

            return new Promise((resolve, reject) => {
                const text = getSource(node);
                const lines = text.split(/\r?\n/);

                const reportMatches = ({pattern, test, message}) => {
                    let matches;
                    lines.forEach((line, index) => {
                        pattern.lastIndex = 0;
                        while (matches = pattern.exec(line)) {
                            if (!test || test.apply(null, matches)) {
                                report(node, new RuleError(message, {
                                    line: index,
                                    column: matches.index
                                }));
                            }
                        }
                    });
                };

                if (charsLeadingParagraph) {
                    if (charsLeadingParagraph.indexOf(text.charAt(0)) == -1) {
                        report(node, new RuleError(`段落の先頭に許可されていない文字が存在しています`));
                    }
                }

                if (noPunctuationAtClosingQuote) {
                    reportMatches({
                        pattern: /[。、][」』】〉》）\)”"’'］\]〕｝\}＞>]/g,
                        message: "句読点(。、)が閉じ括弧の直前に存在しています"
                    });
                }

                if (spaceAfterMarks) {
                    reportMatches({
                        pattern: /[？！](?![　？！」』】〉》）\)”"’'］\]〕｝\}＞>]|$)/g,
                        message: "感嘆符(！)・疑問符(？)の直後にスペースか閉じ括弧が必要です"
                    });
                }

                if (evenNumberEllipsises) {
                    reportMatches({
                        pattern: /…+/g,
                        test:    (s) => s.length % 2 == 1,
                        message: "連続した三点リーダー(…)の数が偶数ではありません"
                    });
                }

                if (evenNumberDashes) {
                    reportMatches({
                        pattern: /―+/g,
                        test:    (s) => s.length % 2 == 1,
                        message: "連続したダッシュ(―)の数が偶数ではありません"
                    });
                }

                if (appropriateUseOfInterpunct) {
                    reportMatches({
                        pattern: /・・+/g,
                        message: "連続した中黒(・)が使われています"
                    });
                }

                if (appropriateUseOfChoonpu) {
                    reportMatches({
                        pattern: /ーー+/g,
                        message: "連続した長音符(ー)が使われています"
                    });
                }

                if (appropriateUseOfMinusSign) {
                    reportMatches({
                        pattern: /−(?![0-9０１２３４５６７８９〇一二三四五六七八九十])/g,
                        message: "マイナス記号(−)の直後が数字ではありません"
                    });
                }

                if (typeof maxArabicNumeralDigits == "number") {
                    reportMatches({
                        pattern: /[0-9０１２３４５６７８９]+/g,
                        test:    (s) => s.length > maxArabicNumeralDigits,
                        message: `${maxArabicNumeralDigits}桁を超えるアラビア数字が使われています`
                    });
                }

                resolve();
            });
        }
    };
}
