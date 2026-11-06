import re

def split_top_level_plus(expr):
    parts = []
    current = []
    depth = 0
    in_quote = False
    quote_char = ''
    i = 0
    expr = str(expr).strip()
    while i < len(expr):
        ch = expr[i]
        if in_quote:
            current.append(ch)
            if ch == quote_char and (i == 0 or expr[i - 1] != '\\'):
                in_quote = False
        else:
            if ch in ('"', "'"):
                in_quote = True
                quote_char = ch
                current.append(ch)
            elif ch in ('(', '[', '{'):
                depth += 1
                current.append(ch)
            elif ch in (')', ']', '}'):
                depth -= 1
                current.append(ch)
            elif ch == '+' and depth == 0:
                parts.append(''.join(current).strip())
                current = []
            else:
                current.append(ch)
        i += 1
    if current:
        parts.append(''.join(current).strip())
    return [p for p in parts if p]

def c_format_print(expr, declared_vars, indent="    "):
    expr = str(expr).strip()
    parts = split_top_level_plus(expr)

    # 1. Single string literal
    if len(parts) == 1 and ((expr.startswith('"') and expr.endswith('"')) or (expr.startswith("'") and expr.endswith("'"))):
        clean = expr[1:-1]
        return f'{indent}printf("{clean}\\n");'

    # 2. Single declared variable
    if len(parts) == 1 and expr in declared_vars:
        t = declared_vars[expr]
        spec = '%lf' if t in ('float', 'double') else ('%s' if t == 'string' else '%d')
        return f'{indent}printf("{expr} = {spec}\\n", {expr});'

    # 3. Concatenated parts
    has_string_literal = any((p.startswith('"') and p.endswith('"')) or (p.startswith("'") and p.endswith("'")) for p in parts)
    if has_string_literal:
        fmt = ""
        args = []
        for part in parts:
            if (part.startswith('"') and part.endswith('"')) or (part.startswith("'") and part.endswith("'")):
                fmt += part[1:-1].replace('%', '%%')
            else:
                t = declared_vars.get(part, 'int')
                spec = '%lf' if t in ('float', 'double') else ('%s' if t == 'string' else '%d')
                fmt += spec
                args.append(part)
        if args:
            return f'{indent}printf("{fmt}\\n", {", ".join(args)});'
        else:
            return f'{indent}printf("{fmt}\\n");'

    return f'{indent}printf("%d\\n", {expr});'

print(c_format_print('"Sum = " + sum_val', {'sum_val': 'int'}))
print(c_format_print('table_num + " x " + i + " = " + prod', {'table_num': 'int', 'i': 'int', 'prod': 'int'}))
print(c_format_print('"Factorial of " + n + " = " + fact', {'n': 'int', 'fact': 'int'}))
print(c_format_print('"Circle Area: " + circ_area', {'circ_area': 'float'}))
