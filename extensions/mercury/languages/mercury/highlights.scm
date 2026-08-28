; Comments and shebangs
(line_comment) @comment
(block_comment) @comment
(shebang) @comment

; Module and declaration keywords
(module_declaration
  kind: (_) @keyword)
(module_declaration ":-" @keyword)
(section_declaration) @keyword
(declaration
  kind: (_) @keyword)
(pragma_declaration) @keyword

; Control-flow and logic keywords
((identifier) @keyword
  (#match? @keyword "^(if|then|else|some|all|not|try|catch)$"))

; Common Mercury declaration and compiler words
["interface" "implementation" "module" "end_module" "include_module" "import_module" "use_module"
 "pred" "func" "type" "inst" "mode" "typeclass" "instance" "solver" "mutable"
 "initialise" "initialize" "finalise" "finalize" "external" "external_pred" "external_func"
 "pragma" "promise" "where"] @keyword

; Determinism, modes, insts, and purity
((identifier) @constant
  (#match? @constant "^(det|semidet|failure|erroneous|multi|nondet|cc_multi|cc_nondet)$"))
((identifier) @type
  (#match? @type "^(in|out|di|uo|ui|mdi|muo|free|ground|unique|mostly_unique|clobbered|not_reached|shared|bound)$"))
((identifier) @keyword
  (#match? @keyword "^(impure|semipure|promise_impure|promise_semipure|promise_pure|trace)$"))

; Names
(module_declaration
  module: (identifier) @namespace)
(qualified_name
  (identifier) @namespace)
(call
  name: (qualified_name
    (identifier) @function))
(call_or_name
  (qualified_name
    (identifier) @function))

; Variables and literals
(variable) @variable
(state_variable) @variable
(string) @string
(quoted_atom) @string
(character) @character
(integer) @number
(float) @number
(boolean) @boolean

; Operators and punctuation
["<=>" "=>" "<=" "->" "=" "=." "=:=" "=\\=" "\\=" "\\=="
 "\\+" "\\/" "/\\" "@=<" "@>=" "@<" "@>" "=<" ">=" "<" ">"
 "+" "-" "*" "/" "//" "div" "rem" "mod" "^" "::" ":=" ".." "--->" "-->"] @operator
["(" ")" "[" "]" "{" "}" "." "," ";" ":"] @punctuation.delimiter
(escape_sequence) @string.escape
