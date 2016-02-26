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
    let opts = {};
    Object.keys(defaultOptions).forEach((key) => {
        opts[key] = options.hasOwnProperty(key) ? options[key] : defaultOptions[key];
    });
    const charsLeadingParagraph = (opts["chars_leading_paragraph"] || "").split("");
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

                if (charsLeadingParagraph.length > 0) {
                    if (charsLeadingParagraph.indexOf(text.charAt(0)) == -1) {
                        report(node, new RuleError(`段落の先頭に許可されていない文字が存在しています`));
                    }
                }

                if (noPunctuationAtClosingQuote) {
                    if (/[。、][」』】〉》）\)”"’'］\]〕｝\}＞>]/.test(text)) {
                        report(node, new RuleError("句読点(。、)が閉じ括弧の直前に存在しています"));
                    }
                }

                if (spaceAfterMarks) {
                    if (/[？！](?![　？！」』】〉》）\)”"’'］\]〕｝\}＞>]|$)/.test(text)) {
                        report(node, new RuleError("感嘆符(！)・疑問符(？)の直後にスペースか閉じ括弧が必要です"));
                    }
                }

                if (evenNumberEllipsises) {
                    let matches1 = text.match(/…+/g);
                    if (matches1 && matches1.some((s) => { return s.length % 2 == 1 })) {
                        report(node, new RuleError("連続した三点リーダー(…)の数が偶数ではありません"));
                    }
                }

                if (evenNumberDashes) {
                    let matches2 = text.match(/―+/g);
                    if (matches2 && matches2.some((s) => { return s.length % 2 == 1 })) {
                        report(node, new RuleError("連続したダッシュ(―)の数が偶数ではありません"));
                    }
                }

                if (appropriateUseOfInterpunct) {
                    if (/・・+/.test(text)) {
                        report(node, new RuleError("連続した中黒(・)が使われています"));
                    }
                }

                if (appropriateUseOfChoonpu) {
                    if (/ーー+/.test(text)) {
                        report(node, new RuleError("連続した長音符(ー)が使われています"))
                    }
                }

                if (appropriateUseOfMinusSign) {
                    if (/−(?![0-9０１２３４５６７８９〇一二三四五六七八九十])/.test(text)) {
                        report(node, new RuleError("マイナス記号(−)の直後が数字ではありません"));
                    }
                }

                if (typeof maxArabicNumeralDigits == "number") {
                    let matches3 = text.match(/[0-9０１２３４５６７８９]+/g);
                    if (matches3 && matches3.some((s) => { return s.length > maxArabicNumeralDigits })) {
                        report(node, new RuleError(`${maxArabicNumeralDigits}桁を超えるアラビア数字が使われています`));
                    }
                }

                resolve();
            });
        }
    };
}
