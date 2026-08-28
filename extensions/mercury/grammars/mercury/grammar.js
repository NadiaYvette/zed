module.exports = grammar({
  name: "mercury",

  extras: ($) => [
    /[\s\uFEFF]/,
    $.line_comment,
    $.block_comment,
  ],

  word: ($) => $.identifier,

  conflicts: ($) => [
    [$.call, $.qualified_name],
    [$.expression, $.call_or_name],
    [$.expression, $.variable_list],
    [$.declaration_body, $.expression, $.type_expression],
    [$.declaration_body, $.expression],
    [$.try_expression],
    [$.argument_list, $.parenthesized],
    [$.declaration, $.pragma_declaration],
  ],

  rules: {
    source_file: ($) => repeat($._top_level),

    _top_level: ($) => choice(
      $.shebang,
      $.module_declaration,
      $.section_declaration,
      $.declaration,
      $.pragma_declaration,
      $.clause,
      $.expression,
      $.foreign_code,
      $.punctuation,
    ),

    shebang: () => /#![^\n]*/,

    line_comment: () => token(prec(1, /%[^\n]*/)),
    block_comment: () => token(seq("/*", repeat(choice(/[^*]/, /\*[^/]/)), "*/")),

    module_declaration: ($) => seq(
      ":-",
      field("kind", choice(
        "module",
        "end_module",
        "include_module",
        "import_module",
        "use_module",
      )),
      field("module", $.identifier),
      ".",
    ),

    section_declaration: ($) => seq(
      ":-",
      choice("interface", "implementation"),
      ".",
    ),

    declaration: ($) => seq(
      ":-",
      field("kind", choice(
        "pred",
        "func",
        "type",
        "inst",
        "mode",
        "typeclass",
        "instance",
        "solver",
        "mutable",
        "initialise",
        "initialize",
        "finalise",
        "finalize",
        "external",
        "external_pred",
        "external_func",
        "promise",
      )),
      optional($.declaration_body),
      ".",
    ),

    pragma_declaration: ($) => seq(
      ":-",
      "pragma",
      choice(
        "check_termination",
        "consider_used",
        "does_not_terminate",
        "fact_table",
        "format_call",
        "inline",
        "loop_check",
        "memo",
        "minimal_model",
        "no_inline",
        "obsolete",
        "require_complete_switch",
        "require_det",
        "require_failure",
        "require_multi",
        "require_nondet",
        "require_semidet",
        "source_file",
        "terminates",
        "type_spec",
        "foreign_proc",
        "foreign_code",
        "foreign_decl",
        "foreign_type",
      ),
      optional($.parenthesized),
      ".",
    ),

    declaration_body: ($) => choice(
      seq($.qualified_name, optional($.argument_list), optional(seq("=", $.expression))),
      seq($.type_expression, optional(seq("where", $.expression))),
      $.expression,
    ),

    clause: ($) => seq(
      field("head", $.call_or_name),
      choice(
        seq(":-", field("body", $.expression)),
        seq("-->", field("body", $.expression)),
        seq("=", field("body", $.expression)),
      ),
      ".",
    ),

    expression: ($) => choice(
      $.if_expression,
      $.quantified_expression,
      $.not_expression,
      $.try_expression,
      $.disjunction,
      $.infix_expression,
      $.call,
      $.qualified_name,
      $.variable,
      $.literal,
      $.parenthesized,
      $.list,
      $.tuple,
      $.state_variable,
    ),

    if_expression: ($) => seq(
      "if", $.expression, "then", $.expression, "else", $.expression,
    ),

    quantified_expression: ($) => seq(
      choice("some", "all"),
      optional($.variable_list),
      $.expression,
    ),

    not_expression: ($) => prec.left(seq("not", $.expression)),
    try_expression: ($) => seq("try", $.expression, optional(seq("then", $.expression, optional(seq("catch", $.expression))))),

    disjunction: ($) => prec.left(1, seq($.expression, repeat1(seq(";", $.expression)))),

    infix_expression: ($) => prec.left(2, seq(
      $.expression,
      choice(
        "<=>", "=>", "<=", "->", "=", "=.", "=:=", "=\\=", "\\=", "\\==",
        "\\+", "\\/", "/\\", "@=<", "@>=", "@<", "@>", "=<", ">=", "<", ">",
        "+", "-", "*", "/", "//", "div", "rem", "mod", "^", "::", ":=", "..",
      ),
      $.expression,
    )),

    call_or_name: ($) => choice($.call, $.qualified_name),

    call: ($) => prec(3, seq(
      field("name", $.qualified_name),
      field("arguments", $.argument_list),
    )),

    argument_list: ($) => seq(
      "(",
      optional(seq($.expression, repeat(seq(",", $.expression)))),
      ")",
    ),

    parenthesized: ($) => seq("(", $.expression, ")"),

    list: ($) => seq(
      "[",
      optional(seq($.expression, repeat(seq(",", $.expression)), optional(seq("|", $.expression)))),
      "]",
    ),

    tuple: ($) => seq(
      "{",
      optional(seq($.expression, repeat1(seq(",", $.expression)))),
      "}",
    ),

    variable_list: ($) => seq($.variable, repeat(seq(",", $.variable))),

    type_expression: ($) => prec.left(seq(
      $.qualified_name,
      optional($.argument_list),
    )),

    qualified_name: ($) => prec.right(seq(
      $.identifier,
      repeat(seq(".", $.identifier)),
    )),

    variable: ($) => choice(
      /_[A-Z][A-Za-z0-9_]*/,
      /_[a-zA-Z0-9_]*/,
      /[A-Z][A-Za-z0-9_]*/,
    ),

    state_variable: ($) => token(seq("!", optional(choice(".", ":")), /[A-Za-z_][A-Za-z0-9_]*/)),

    identifier: ($) => /[a-z][A-Za-z0-9_]*/,

    literal: ($) => choice(
      $.string,
      $.quoted_atom,
      $.character,
      $.float,
      $.integer,
      $.boolean,
    ),

    string: ($) => seq(
      '"',
      repeat(choice(
        $.escape_sequence,
        token.immediate(prec(1, /[^"\\]+/)),
      )),
      '"',
    ),

    quoted_atom: ($) => seq(
      "'",
      repeat(choice(
        $.escape_sequence,
        token.immediate(prec(1, /[^'\\]+/)),
      )),
      "'",
    ),

    character: ($) => seq("0'", choice($.escape_sequence, /[^\s]/)),

    escape_sequence: () => token.immediate(/\\(?:[abefnrtv\\"'0]|x[0-9A-Fa-f]+\\?|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8}|[0-7]+\\?)/),
    float: () => token(/(?:[0-9][0-9_]*\.[0-9][0-9_]*|[0-9][0-9_]*[eE][-+]?[0-9][0-9_]*)(?:[eE][-+]?[0-9][0-9_]*)?/),
    integer: () => token(/(?:0[bB][01_]+|0[oO][0-7_]+|0[xX][0-9A-Fa-f_]+|[0-9][0-9_]*)(?:_[iu](?:8|16|32|64))?/),
    boolean: () => choice("yes", "no", "true", "false", "fail"),

    foreign_code: ($) => seq(
      ":-",
      choice("pragma", "foreign_code", "foreign_decl", "foreign_proc"),
      optional($.parenthesized),
      ".",
    ),

    punctuation: () => choice(".", ",", ";", ":", "!", "=", "--->", "-->", "->"),
  },
});
