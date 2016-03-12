# textlint-rule-general-novel-style-ja

[![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/) [![Build Status](https://travis-ci.org/io-monad/textlint-rule-general-novel-style-ja.svg?branch=master)](https://travis-ci.org/io-monad/textlint-rule-general-novel-style-ja)

[textlint](https://github.com/textlint/textlint) rule to follow general style of Japanese novels.

日本の小説における一般的な作法に従うための textlint ルールです。

## インストール

    npm install textlint-rule-general-novel-style-ja

## 使い方

    $ npm install textlint textlint-rule-general-novel-style-ja
    $ textlint --rule general-novel-style-ja README.md

## 適用される作法

いずれも、設定によって無効化する事ができます。

### 各段落の先頭に全角スペースまたは開き括弧のみを許可

```
　これは日本語の文章です。
この行は行頭に全角スペースがありません。
　だからエラーになってしまいます。
「会話文は問題ありません」
```

```
2:1  error  段落の先頭に許可されていない文字が存在しています
```

行頭に許可される開き括弧は `「『【〈《（(“"‘'［[〔｛{＜<` のいずれかです。

許可される文字は `chars_leading_paragraph` 設定で変える事ができます。

### 閉じ括弧の手前に句読点(。、)を置かない

```
「こんにちは、世界。」
「世界に、こんにちは、」
```

```
1:10  error  句読点(。、)が閉じ括弧の直前に存在しています
2:11  error  句読点(。、)が閉じ括弧の直前に存在しています
```

### 疑問符(？)と感嘆符(！)の直後にスペースを置く

```
「こんにちは！世界」
「こんにちは？世界」
「スペースを一文字入れれば！　大丈夫」
「閉じ括弧の前でも大丈夫！」
「ビックリハテナ！？」
```

```
1:7  error  感嘆符(！)・疑問符(？)の直後にスペースか閉じ括弧が必要です
2:7  error  感嘆符(！)・疑問符(？)の直後にスペースか閉じ括弧が必要です
```

### 連続した三点リーダー(…)の数は偶数にする

```
「………なん…だと…」
「……偶数個なら……大丈夫…………」
```

```
1:2  error  連続した三点リーダー(…)の数が偶数ではありません
1:7  error  連続した三点リーダー(…)の数が偶数ではありません
1:10 error  連続した三点リーダー(…)の数が偶数ではありません
```

### 連続したダッシュ(―)の数は偶数にする

```
「一体いつから―――奇数個でも大丈夫だと錯覚していた――？」
「偶数個なら――――大丈夫」
```

```
1:8  error  連続したダッシュ(―)の数が偶数ではありません
```

### 連続した句読点(。、)を許可しない

```
「句読点は、、、一つに限る。。。」
　正しい文章なら、大丈夫。
```

```
1:6  error  連続した句読点(。、)が使われています
1:14 error  連続した句読点(。、)が使われています
```

### 連続した中黒(・)を許可しない

```
「ちゃんと・・・三点リーダーを・・・使おう」
「単語の・区切りなら・大丈夫」
```

```
1:6  error  連続した中黒(・)が使われています
1:16 error  連続した中黒(・)が使われています
```

### 連続した長音符(ー)を許可しない

```
「長音符はーーーーダッシュじゃない」
「伸ばすだけならー大丈夫ー」
```

```
1:6  error  連続した長音符(ー)が使われています
```

### マイナス記号(−)は数字の前にしか許可しない

```
「マイナス記号も−−ダッシュじゃない」
「数字の前なら３−２＝１大丈夫」
```

```
1:9  error  マイナス記号(−)の直後が数字ではありません
1:10 error  マイナス記号(−)の直後が数字ではありません
```

### アラビア数字は最大桁数までしか許可しない

```
「２０１６年、長いアラビア数字は禁止された」
「半角の2016年でもダメ」
「２桁までなら大丈夫。５０、８０、よろこんで」
```

```
1:2  error  2桁を超えるアラビア数字が使われています
2:5  error  2桁を超えるアラビア数字が使われています
```

最大桁数は `max_arabic_numeral_digits` 設定で変更できます。

## 設定

`.textlintrc` に設定を記述します。詳しくは textlint のドキュメントを参照してください。

以下がデフォルトの設定です。

```js
{
    "rules": {
        "general-novel-style-ja": {
            // 各段落の先頭に許可する文字 (false: チェックしない)
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

