# textlint-rule-general-novel-style-ja

[![Build Status](https://travis-ci.org/io-monad/textlint-rule-general-novel-style-ja.svg?branch=master)](https://travis-ci.org/io-monad/textlint-rule-general-novel-style-ja)

[textlint](https://github.com/textlint/textlint) rule to follow general style of Japanese novels.

日本の小説における一般的な作法に従うための textlint ルールです。

## インストール

    npm install textlint-rule-general-novel-style-ja

## 使い方

    $ npm install textlint textlint-rule-max-ten
    $ textlint --rule general-novel-style-ja README.md

## 設定

`.textlintrc` に設定を記述します。詳しくは textlint のドキュメントを参照してください。

以下がデフォルトの設定です。

```js
{
    "rules": {
        "general-novel-style-ja": {
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
        }
    }
}
```

## テスト

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT (See LICENSE)

