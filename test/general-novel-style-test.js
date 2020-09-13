"use strict";

import rule from "../src/general-novel-style";

var TextLintTester = require("textlint-tester");
var tester = new TextLintTester();
tester.run("general-novel-style", rule, {
    valid: [
        "　日本語の小説のテストです。日本語の小説の、テストなんです。",
        "「こんにちは、世界」",
        "[こんにちは、世界。](https://example.com)",
        "[こんにちは、世界、](https://example.com)",
        {
            text: "#1234",
            options: {"chars_leading_paragraph": "#"}
        },
        "「これはペンですか？　いや、ペンであるはずがない！」",
        "「…………なん……だと……」",
        "『一体いつから――――ペンであると錯覚していた――？』",
        "　ヘロー・ワールド！",
        "　２−３＝−１",
        {
            text: "＃日本語の小説のテストです。",
            options: { "chars_leading_paragraph": "＃" }
        },
        {
            text: "「こんにちは、世界。」",
            options: { "no_punctuation_at_closing_quote": false }
        },
        {
            text: "「これはペンですか？いや、ペンであるはずがない！」",
            options: { "space_after_marks": false }
        },
        {
            text: "「………なん…だと…」",
            options: { "even_number_ellipsises": false }
        },
        {
            text: "『一体いつから―――ペンであると錯覚していた――？』",
            options: { "even_number_dashes": false }
        },
        {
            text: "　ヘロー、、、ワールド。。。",
            options: { "appropriate_use_of_punctuation": false }
        },
        {
            text: "　ヘロー・・・ワールド・・・",
            options: { "appropriate_use_of_interpunct": false }
        },
        {
            text: "　ヘローーーー・ワーーーールド",
            options: { "appropriate_use_of_choonpu": false }
        },
        {
            text: "　ヘロ−・ワ−ルド",
            options: { "appropriate_use_of_minus_sign": false }
        },
        {
            text: "　１２３４＋３２１＝１５５５",
            options: { "max_arabic_numeral_digits": false }
        },
        {
            text: "　１２３４＋３２１＝１５５５",
            options: { "max_arabic_numeral_digits": 4 }
        }
    ],
    invalid: [
        {
            text: "＃日本語の小説のテストです。",
            output: "　＃日本語の小説のテストです。",
            errors: [
                {
                    message: "段落の先頭に許可されていない文字が存在しています",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            text: "「こんにちは、世界。」",
            output: "「こんにちは、世界」",
            errors: [
                {
                    message: "句読点(。、)が閉じ括弧の直前に存在しています",
                    line: 1,
                    column: 10
                }
            ]
        },
        {
            text: "「これはペンですか？いや、ペンであるはずがない！」",
            output: "「これはペンですか？　いや、ペンであるはずがない！」",
            errors: [
                {
                    message: "感嘆符(！)・疑問符(？)の直後にスペースか閉じ括弧が必要です",
                    line: 1,
                    column: 10
                }
            ]
        },
        {
            text: "「………なん…だと……」",
            output: "「…………なん……だと……」",
            errors: [
                {
                    message: "連続した三点リーダー(…)の数が偶数ではありません",
                    line: 1,
                    column: 2
                },
                {
                    message: "連続した三点リーダー(…)の数が偶数ではありません",
                    line: 1,
                    column: 7
                }
            ]
        },
        {
            text: "『一体いつから―――ペンであると錯覚していた――？』",
            output: "『一体いつから――――ペンであると錯覚していた――？』",
            errors: [
                {
                    message: "連続したダッシュ(―)の数が偶数ではありません",
                    line: 1,
                    column: 8
                }
            ]
        },
        {
            text: "　ヘロー、、、ワールド。。。",
            output: "　ヘロー……ワールド……",
            errors: [
                {
                    message: "連続した句読点(。、)が使われています",
                    line: 1,
                    column: 5
                },
                {
                    message: "連続した句読点(。、)が使われています",
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            text: "　ヘロー・・・ワールド・・・",
            output: "　ヘロー……ワールド……",
            errors: [
                {
                    message: "連続した中黒(・)が使われています",
                    line: 1,
                    column: 5
                },
                {
                    message: "連続した中黒(・)が使われています",
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            text: "　ヘローーーー・ワーーーールド",
            output: "　ヘロ――――・ワ――――ルド",
            errors: [
                {
                    message: "連続した長音符(ー)が使われています",
                    line: 1,
                    column: 4
                },
                {
                    message: "連続した長音符(ー)が使われています",
                    line: 1,
                    column: 10
                },
            ]
        },
        {
            text: "　ヘロ−・ワ−ルド",
            output: "　ヘロー・ワールド",
            errors: [
                {
                    message: "マイナス記号(−)の直後が数字ではありません",
                    line: 1,
                    column: 4
                },
                {
                    message: "マイナス記号(−)の直後が数字ではありません",
                    line: 1,
                    column: 7
                }
            ]
        },
        {
            text: "　１２３４＋２１＝１２５５",
            output: "　千二百三十四＋２１＝千二百五十五",
            errors: [
                {
                    message: "2桁を超えるアラビア数字が使われています",
                    line: 1,
                    column: 2
                },
                {
                    message: "2桁を超えるアラビア数字が使われています",
                    line: 1,
                    column: 10
                }
            ]
        },
        {
            text: "　１２３．４５＋１．２３＝１２５．５",
            output: "　百二十三・四五＋１．２３＝百二十五・五",
            errors: [
                {
                    message: "2桁を超えるアラビア数字が使われています",
                    line: 1,
                    column: 2
                },
                {
                    message: "2桁を超えるアラビア数字が使われています",
                    line: 1,
                    column: 14
                }
            ]
        },
        {
            text: "　１２３４＋３２１＝１５５５",
            output: "　千二百三十四＋３２１＝千五百五十五",
            options: { "max_arabic_numeral_digits": 3 },
            errors: [
                {
                    message: "3桁を超えるアラビア数字が使われています",
                    line: 1,
                    column: 2
                },
                {
                    message: "3桁を超えるアラビア数字が使われています",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            text: "「複数行の\nテストです。」",
            output: "「複数行の\nテストです」",
            errors: [
                {
                    message: "句読点(。、)が閉じ括弧の直前に存在しています",
                    line: 2,
                    column: 6
                }
            ]
        },
        {
            text: "「こんにちは、世界。。。」",
            output: "「こんにちは、世界」",
            errors: [
                {
                    message: "連続した句読点(。、)が使われています",
                    line: 1,
                    column: 10
                },
                {
                    message: "句読点(。、)が閉じ括弧の直前に存在しています",
                    line: 1,
                    column: 12
                }
            ]
        },
    ]
});
