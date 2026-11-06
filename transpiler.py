import json
import re

class CodeTranspiler:
    """
    Transpiles block-based visual programming constructs into:
    1. Standard Academic Structured Pseudocode
    2. Runnable Python 3 Code
    3. Working ANSI C Code (with proper type inferences, #include <stdio.h>, and main)
    """

    def __init__(self, blocks=None, title="VisualAlgorithm"):
        self.blocks = blocks or []
        self.title = title.replace(" ", "_")
        self.declared_vars = {}  # var_name -> c_type

    def transpile_all(self, blocks=None, title=None):
        if blocks is not None:
            self.blocks = blocks
        if title:
            self.title = title.replace(" ", "_")

        # First pass: collect declared variables and types
        self.declared_vars = self._collect_variables(self.blocks)

        pseudocode = self.to_pseudocode(self.blocks)
        python_code = self.to_python(self.blocks)
        c_code = self.to_c(self.blocks)
        java_code = self.to_java(self.blocks)

        return {
            'pseudocode': pseudocode,
            'python': python_code,
            'c': c_code,
            'java': java_code
        }

    def _collect_variables(self, blocks):
        vars_map = {}
        for block in blocks:
            b_type = block.get('type')
            if b_type == 'variable_declare':
                name = block.get('var_name', 'x')
                vtype = block.get('var_type', 'int')
                vars_map[name] = vtype
            elif b_type == 'input':
                name = block.get('var_name', 'n')
                vtype = block.get('var_type', 'int')
                vars_map[name] = vtype
            elif b_type == 'for_loop':
                it = block.get('iterator', 'i')
                if it not in vars_map:
                    vars_map[it] = 'int'
                vars_map.update(self._collect_variables(block.get('body', [])))
            elif b_type == 'while_loop':
                vars_map.update(self._collect_variables(block.get('body', [])))
            elif b_type == 'if_condition':
                vars_map.update(self._collect_variables(block.get('then_body', [])))
                vars_map.update(self._collect_variables(block.get('else_body', [])))
        return vars_map

    # ==========================================
    # 1. PSEUDOCODE GENERATOR
    # ==========================================
    def to_pseudocode(self, blocks=None, indent_lvl=0):
        if blocks is None:
            blocks = self.blocks

        lines = []
        if indent_lvl == 0:
            lines.append(f"ALGORITHM {self.title}")
            lines.append("BEGIN")
            indent_lvl = 1

        indent = "    " * indent_lvl

        for block in blocks:
            b_type = block.get('type')

            if b_type == 'comment':
                lines.append(f"{indent}// {block.get('text', '')}")

            elif b_type == 'variable_declare':
                var = block.get('var_name', 'x')
                vtype = block.get('var_type', 'int').upper()
                init = block.get('initial_value', '0')
                lines.append(f"{indent}DECLARE {var} AS {vtype} ← {init}")

            elif b_type == 'variable_assign':
                var = block.get('var_name', 'x')
                expr = block.get('expression', '0')
                lines.append(f"{indent}{var} ← {expr}")

            elif b_type == 'input':
                var = block.get('var_name', 'n')
                prompt = block.get('prompt', '')
                if prompt:
                    lines.append(f'{indent}PROMPT "{prompt}"')
                lines.append(f"{indent}INPUT {var}")

            elif b_type == 'output':
                expr = block.get('expression', '""')
                lines.append(f"{indent}OUTPUT {expr}")

            elif b_type == 'for_loop':
                it = block.get('iterator', 'i')
                start = block.get('start_val', '1')
                end = block.get('end_val', '10')
                step = block.get('step', '1')
                step_str = f" STEP {step}" if str(step) != '1' else ""
                lines.append(f"{indent}FOR {it} ← {start} TO {end}{step_str} DO")
                inner = self.to_pseudocode(block.get('body', []), indent_lvl + 1)
                lines.append(inner)
                lines.append(f"{indent}END FOR")

            elif b_type == 'while_loop':
                cond = block.get('condition', 'true')
                lines.append(f"{indent}WHILE ({cond}) DO")
                inner = self.to_pseudocode(block.get('body', []), indent_lvl + 1)
                lines.append(inner)
                lines.append(f"{indent}END WHILE")

            elif b_type == 'if_condition':
                cond = block.get('condition', 'true')
                lines.append(f"{indent}IF ({cond}) THEN")
                then_code = self.to_pseudocode(block.get('then_body', []), indent_lvl + 1)
                lines.append(then_code)
                else_body = block.get('else_body', [])
                if else_body:
                    lines.append(f"{indent}ELSE")
                    else_code = self.to_pseudocode(else_body, indent_lvl + 1)
                    lines.append(else_code)
                lines.append(f"{indent}END IF")

        if indent_lvl == 1 and not blocks:
            lines.append(f"{indent}// Workspace empty: drag or add visual blocks")

        if indent_lvl == 1:
            lines.append("END")

        return "\n".join([line for line in lines if line is not None])

    # ==========================================
    # 2. PYTHON 3 GENERATOR
    # ==========================================
    def to_python(self, blocks=None, indent_lvl=0):
        if blocks is None:
            blocks = self.blocks

        lines = []
        if indent_lvl == 0:
            lines.append(f"# Auto-transpiled Python code: {self.title}")
            lines.append("# Generated by Personalized Academic Learning & Visual Assistant")
            lines.append("")

        indent = "    " * indent_lvl

        if not blocks and indent_lvl > 0:
            return f"{indent}pass"

        for block in blocks:
            b_type = block.get('type')

            if b_type == 'comment':
                lines.append(f"{indent}# {block.get('text', '')}")

            elif b_type == 'variable_declare':
                var = block.get('var_name', 'x')
                init = block.get('initial_value', '0')
                lines.append(f"{indent}{var} = {init}")

            elif b_type == 'variable_assign':
                var = block.get('var_name', 'x')
                expr = self._py_assign_expression(var, block.get('expression', '0'))
                lines.append(f"{indent}{var} = {expr}")

            elif b_type == 'input':
                var = block.get('var_name', 'n')
                prompt = block.get('prompt', 'Enter value: ')
                vtype = block.get('var_type', 'int')
                if vtype == 'int':
                    lines.append(f'{indent}{var} = int(input("{prompt} "))')
                elif vtype == 'float' or vtype == 'double':
                    lines.append(f'{indent}{var} = float(input("{prompt} "))')
                else:
                    lines.append(f'{indent}{var} = input("{prompt} ")')

            elif b_type == 'output':
                py_print = self._format_py_print(block.get('expression', '""'))
                lines.append(f"{indent}{py_print}")

            elif b_type == 'for_loop':
                it = block.get('iterator', 'i')
                start = block.get('start_val', '1')
                end = block.get('end_val', '10')
                step = block.get('step', '1')
                # Python range is exclusive of end, so end + 1
                if str(step) == '1':
                    range_expr = f"range({start}, {end} + 1)"
                else:
                    range_expr = f"range({start}, {end} + 1, {step})"
                lines.append(f"{indent}for {it} in {range_expr}:")
                inner = self.to_python(block.get('body', []), indent_lvl + 1)
                lines.append(inner)

            elif b_type == 'while_loop':
                cond = self._py_condition(block.get('condition', 'True'))
                lines.append(f"{indent}while {cond}:")
                inner = self.to_python(block.get('body', []), indent_lvl + 1)
                lines.append(inner)

            elif b_type == 'if_condition':
                cond = self._py_condition(block.get('condition', 'True'))
                lines.append(f"{indent}if {cond}:")
                then_code = self.to_python(block.get('then_body', []), indent_lvl + 1)
                lines.append(then_code)
                else_body = block.get('else_body', [])
                if else_body:
                    lines.append(f"{indent}else:")
                    else_code = self.to_python(else_body, indent_lvl + 1)
                    lines.append(else_code)

        if indent_lvl == 0 and not blocks:
            lines.append("# Add blocks on canvas to generate Python code")
            lines.append("print('Hello from Visual Assistant!')")

        return "\n".join(lines)

    # ==========================================
    # 3. ANSI C CODE GENERATOR
    # ==========================================
    def to_c(self, blocks=None, indent_lvl=0):
        if blocks is None:
            blocks = self.blocks

        if indent_lvl == 0:
            header_lines = [
                f"/* Auto-transpiled ANSI C code: {self.title} */",
                "/* Personalized Academic Learning and Visual Programming Assistant */",
                "#include <stdio.h>",
                "#include <stdlib.h>",
                "#include <stdbool.h>",
                "",
                "int main(void) {",
            ]
            # Emit declarations of all collected variables at the top of main() for strict C compliance
            decl_lines = []
            for vname, vtype in self.declared_vars.items():
                c_t = 'int'
                if vtype in ['float', 'double']:
                    c_t = 'double'
                elif vtype == 'string':
                    c_t = 'char'
                    decl_lines.append(f"    char {vname}[256] = \"\";")
                    continue
                elif vtype == 'bool':
                    c_t = 'bool'
                decl_lines.append(f"    {c_t} {vname} = 0;")

            body_lines = self._c_body(blocks, 1)

            footer_lines = [
                "",
                "    return 0;",
                "}"
            ]
            full_c = header_lines + decl_lines + ([""] if decl_lines else []) + body_lines + footer_lines
            return "\n".join(full_c)
        else:
            return "\n".join(self._c_body(blocks, indent_lvl))

    def _c_body(self, blocks, indent_lvl):
        lines = []
        indent = "    " * indent_lvl

        for block in blocks:
            b_type = block.get('type')

            if b_type == 'comment':
                lines.append(f"{indent}/* {block.get('text', '')} */")

            elif b_type == 'variable_declare':
                var = block.get('var_name', 'x')
                init = block.get('initial_value', '0')
                # already declared at top of main, so we emit assignment
                lines.append(f"{indent}{var} = {init};")

            elif b_type == 'variable_assign':
                var = block.get('var_name', 'x')
                expr = self._c_expression(block.get('expression', '0'))
                lines.append(f"{indent}{var} = {expr};")

            elif b_type == 'input':
                var = block.get('var_name', 'n')
                prompt = block.get('prompt', '')
                vtype = self.declared_vars.get(var, 'int')
                if prompt:
                    lines.append(f'{indent}printf("{prompt}\\n");')
                if vtype in ['float', 'double']:
                    lines.append(f'{indent}scanf("%lf", &{var});')
                elif vtype == 'string':
                    lines.append(f'{indent}scanf("%255s", {var});')
                else:
                    lines.append(f'{indent}scanf("%d", &{var});')

            elif b_type == 'output':
                expr = block.get('expression', '""')
                c_print = self._c_format_print(expr, indent)
                lines.append(c_print)

            elif b_type == 'for_loop':
                it = block.get('iterator', 'i')
                start = block.get('start_val', '1')
                end = block.get('end_val', '10')
                step = block.get('step', '1')
                step_stmt = f"{it}++" if str(step) == '1' else f"{it} += {step}"
                lines.append(f"{indent}for ({it} = {start}; {it} <= {end}; {step_stmt}) {{")
                inner = self._c_body(block.get('body', []), indent_lvl + 1)
                lines.extend(inner)
                lines.append(f"{indent}}}")

            elif b_type == 'while_loop':
                cond = self._c_condition(block.get('condition', '1'))
                lines.append(f"{indent}while ({cond}) {{")
                inner = self._c_body(block.get('body', []), indent_lvl + 1)
                lines.extend(inner)
                lines.append(f"{indent}}}")

            elif b_type == 'if_condition':
                cond = self._c_condition(block.get('condition', '1'))
                lines.append(f"{indent}if ({cond}) {{")
                then_lines = self._c_body(block.get('then_body', []), indent_lvl + 1)
                lines.extend(then_lines)
                else_body = block.get('else_body', [])
                if else_body:
                    lines.append(f"{indent}}} else {{")
                    else_lines = self._c_body(else_body, indent_lvl + 1)
                    lines.extend(else_lines)
                lines.append(f"{indent}}}")

        return lines

    # ==========================================
    # 4. JAVA 17+ CODE GENERATOR
    # ==========================================
    def to_java(self, blocks=None, indent_lvl=0):
        if blocks is None:
            blocks = self.blocks

        if indent_lvl == 0:
            header_lines = [
                f"// Auto-transpiled Java 17+ Code: {self.title}",
                "// Personalized Academic Learning & Visual Programming Assistant",
                "import java.util.Scanner;",
                "",
                "public class Main {",
                "    public static void main(String[] args) {",
                "        Scanner scanner = new Scanner(System.in);"
            ]
            decl_lines = []
            for vname, vtype in self.declared_vars.items():
                j_t = 'int'
                default_val = '0'
                if vtype in ['float', 'double']:
                    j_t = 'double'
                    default_val = '0.0'
                elif vtype == 'string':
                    j_t = 'String'
                    default_val = '""'
                elif vtype == 'bool':
                    j_t = 'boolean'
                    default_val = 'false'
                decl_lines.append(f"        {j_t} {vname} = {default_val};")

            body_lines = self._java_body(blocks, 2)

            footer_lines = [
                "",
                "        scanner.close();",
                "    }",
                "}"
            ]
            full_java = header_lines + ([""] if decl_lines else []) + decl_lines + ([""] if decl_lines else []) + body_lines + footer_lines
            return "\n".join(full_java)
        else:
            return "\n".join(self._java_body(blocks, indent_lvl))

    def _java_body(self, blocks, indent_lvl):
        lines = []
        indent = "    " * indent_lvl

        for block in blocks:
            b_type = block.get('type')

            if b_type == 'comment':
                lines.append(f"{indent}// {block.get('text', '')}")

            elif b_type == 'variable_declare':
                var = block.get('var_name', 'x')
                init = block.get('initial_value', '0')
                lines.append(f"{indent}{var} = {init};")

            elif b_type == 'variable_assign':
                var = block.get('var_name', 'x')
                expr = self._java_expression(block.get('expression', '0'))
                lines.append(f"{indent}{var} = {expr};")

            elif b_type == 'input':
                var = block.get('var_name', 'n')
                prompt = block.get('prompt', '')
                vtype = self.declared_vars.get(var, 'int')
                if prompt:
                    lines.append(f'{indent}System.out.println("{prompt}");')
                if vtype in ['float', 'double']:
                    lines.append(f'{indent}{var} = scanner.nextDouble();')
                elif vtype == 'string':
                    lines.append(f'{indent}{var} = scanner.next();')
                else:
                    lines.append(f'{indent}{var} = scanner.nextInt();')

            elif b_type == 'output':
                expr = self._java_expression(block.get('expression', '""'))
                lines.append(f'{indent}System.out.println({expr});')

            elif b_type == 'for_loop':
                it = block.get('iterator', 'i')
                start = block.get('start_val', '1')
                end = block.get('end_val', '10')
                step = block.get('step', '1')
                step_stmt = f"{it}++" if str(step) == '1' else f"{it} += {step}"
                lines.append(f"{indent}for (int {it} = {start}; {it} <= {end}; {step_stmt}) {{")
                inner = self._java_body(block.get('body', []), indent_lvl + 1)
                lines.extend(inner)
                lines.append(f"{indent}}}")

            elif b_type == 'while_loop':
                cond = self._java_condition(block.get('condition', 'true'))
                lines.append(f"{indent}while ({cond}) {{")
                inner = self._java_body(block.get('body', []), indent_lvl + 1)
                lines.extend(inner)
                lines.append(f"{indent}}}")

            elif b_type == 'if_condition':
                cond = self._java_condition(block.get('condition', 'true'))
                lines.append(f"{indent}if ({cond}) {{")
                then_lines = self._java_body(block.get('then_body', []), indent_lvl + 1)
                lines.extend(then_lines)
                else_body = block.get('else_body', [])
                if else_body:
                    lines.append(f"{indent}}} else {{")
                    else_lines = self._java_body(else_body, indent_lvl + 1)
                    lines.extend(else_lines)
                lines.append(f"{indent}}}")

        return lines

    def _java_expression(self, expr):
        expr = str(expr).strip()
        expr = re.sub(r'\band\b', '&&', expr)
        expr = re.sub(r'\bor\b', '||', expr)
        expr = re.sub(r'\bnot\b', '!', expr)
        return expr

    def _java_condition(self, cond):
        return self._java_expression(cond)

    # ==========================================
    # Expression / Condition Converters
    # ==========================================
    def _split_top_level_plus(self, expr):
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

    def _py_expression(self, expr):
        expr = str(expr).strip()
        expr = re.sub(r'\b&&\b', ' and ', expr)
        expr = re.sub(r'\|\|', ' or ', expr)
        expr = re.sub(r'\btrue\b', 'True', expr, flags=re.IGNORECASE)
        expr = re.sub(r'\bfalse\b', 'False', expr, flags=re.IGNORECASE)
        return expr

    def _py_condition(self, cond):
        return self._py_expression(cond)

    def _format_py_print(self, raw_expr):
        expr = str(raw_expr or '""').strip()
        parts = self._split_top_level_plus(expr)
        has_string_literal = any((p.startswith('"') and p.endswith('"')) or (p.startswith("'") and p.endswith("'")) for p in parts)
        if not has_string_literal:
            return f"print({self._py_expression(expr)})"
        formatted = []
        for p in parts:
            if (p.startswith('"') and p.endswith('"')) or (p.startswith("'") and p.endswith("'")):
                formatted.append(p)
            else:
                formatted.append(f"str({self._py_expression(p)})")
        return f"print({' + '.join(formatted)})"

    def _py_assign_expression(self, var, expr_raw):
        expr = str(expr_raw or '0').strip()
        # If target variable is integer and divides without float indicator, use integer division in Python
        var_type = self.declared_vars.get(var, 'int')
        if var_type == 'int' and '/' in expr and '//' not in expr and not re.search(r'\d+\.\d+', expr):
            # Replace single / with //
            expr = re.sub(r'(?<!/)/(?!/)', '//', expr)

        # Check for string concatenation
        if var_type == 'string' or (('"' in expr or "'" in expr) and '+' in expr):
            parts = self._split_top_level_plus(expr)
            has_str = any((p.startswith('"') and p.endswith('"')) or (p.startswith("'") and p.endswith("'")) or self.declared_vars.get(p) == 'string' for p in parts)
            if has_str:
                formatted = []
                for p in parts:
                    if (p.startswith('"') and p.endswith('"')) or (p.startswith("'") and p.endswith("'")) or self.declared_vars.get(p) == 'string':
                        formatted.append(self._py_expression(p))
                    else:
                        formatted.append(f"str({self._py_expression(p)})")
                return ' + '.join(formatted)

        return self._py_expression(expr)

    def _c_expression(self, expr):
        expr = str(expr).strip()
        expr = re.sub(r'\band\b', '&&', expr)
        expr = re.sub(r'\bor\b', '||', expr)
        expr = re.sub(r'\bnot\b', '!', expr)
        return expr

    def _c_condition(self, cond):
        return self._c_expression(cond)

    def _c_format_print(self, raw_expr, indent):
        expr = str(raw_expr or '""').strip()
        parts = self._split_top_level_plus(expr)

        # 1. Single string literal
        if len(parts) == 1 and ((expr.startswith('"') and expr.endswith('"')) or (expr.startswith("'") and expr.endswith("'"))):
            clean = expr[1:-1]
            return f'{indent}printf("{clean}\\n");'

        # 2. Single declared variable
        if len(parts) == 1 and expr in self.declared_vars:
            t = self.declared_vars[expr]
            spec = '%lf' if t in ('float', 'double') else ('%s' if t == 'string' else '%d')
            return f'{indent}printf("{expr} = {spec}\\n", {expr});'

        # 3. Concatenated parts with string literals
        has_string_literal = any((p.startswith('"') and p.endswith('"')) or (p.startswith("'") and p.endswith("'")) for p in parts)
        if has_string_literal:
            fmt = ""
            args = []
            for part in parts:
                if (part.startswith('"') and part.endswith('"')) or (part.startswith("'") and part.endswith("'")):
                    fmt += part[1:-1].replace('%', '%%')
                else:
                    clean_part = self._c_expression(part)
                    t = self.declared_vars.get(clean_part, 'int')
                    spec = '%lf' if t in ('float', 'double') else ('%s' if t == 'string' else '%d')
                    fmt += spec
                    args.append(clean_part)
            if args:
                return f'{indent}printf("{fmt}\\n", {", ".join(args)});'
            else:
                return f'{indent}printf("{fmt}\\n");'

        # 4. Default arithmetic expression
        return f'{indent}printf("%d\\n", {self._c_expression(expr)});'
