/**
 * Client-Side Real-Time Code Transpiler
 * Transpiles visual block AST into:
 * 1. Formatted Academic Pseudocode
 * 2. Clean Idiomatic Python 3
 * 3. Compilable ANSI C
 */

class ClientTranspiler {
    constructor() {
        this.declaredVars = {};
    }

    transpile(blocks, title = "VisualAlgorithm") {
        this.declaredVars = this.collectVariables(blocks);
        const cleanTitle = title.replace(/\s+/g, "_");

        return {
            pseudocode: this.generatePseudocode(blocks, cleanTitle),
            python: this.generatePython(blocks, cleanTitle),
            c: this.generateC(blocks, cleanTitle),
            java: this.generateJava(blocks, cleanTitle)
        };
    }

    collectVariables(blocks) {
        const vars = {};
        const traverse = (list) => {
            if (!list) return;
            for (const b of list) {
                if (b.type === 'variable_declare') {
                    vars[b.var_name || 'x'] = b.var_type || 'int';
                } else if (b.type === 'input') {
                    vars[b.var_name || 'n'] = b.var_type || 'int';
                } else if (b.type === 'for_loop') {
                    if (!vars[b.iterator || 'i']) vars[b.iterator || 'i'] = 'int';
                    traverse(b.body);
                } else if (b.type === 'while_loop') {
                    traverse(b.body);
                } else if (b.type === 'if_condition') {
                    traverse(b.then_body);
                    traverse(b.else_body);
                }
            }
        };
        traverse(blocks);
        return vars;
    }

    // ==========================================
    // 1. PSEUDOCODE
    // ==========================================
    generatePseudocode(blocks, title) {
        const lines = [];
        lines.push(`ALGORITHM ${title}`);
        lines.push(`BEGIN`);

        const traverse = (list, lvl) => {
            const indent = "    ".repeat(lvl);
            if (!list || list.length === 0) {
                return;
            }
            for (const b of list) {
                switch (b.type) {
                    case 'comment':
                        lines.push(`${indent}// ${b.text || ''}`);
                        break;
                    case 'variable_declare':
                        lines.push(`${indent}DECLARE ${b.var_name || 'x'} AS ${(b.var_type || 'int').toUpperCase()} ← ${b.initial_value || '0'}`);
                        break;
                    case 'variable_assign':
                        lines.push(`${indent}${b.var_name || 'x'} ← ${b.expression || '0'}`);
                        break;
                    case 'input':
                        if (b.prompt) lines.push(`${indent}PROMPT "${b.prompt}"`);
                        lines.push(`${indent}INPUT ${b.var_name || 'n'}`);
                        break;
                    case 'output':
                        lines.push(`${indent}OUTPUT ${b.expression || '""'}`);
                        break;
                    case 'for_loop':
                        const stepStr = (b.step && b.step != '1') ? ` STEP ${b.step}` : '';
                        lines.push(`${indent}FOR ${b.iterator || 'i'} ← ${b.start_val || '1'} TO ${b.end_val || '10'}${stepStr} DO`);
                        traverse(b.body, lvl + 1);
                        lines.push(`${indent}END FOR`);
                        break;
                    case 'while_loop':
                        lines.push(`${indent}WHILE (${b.condition || 'true'}) DO`);
                        traverse(b.body, lvl + 1);
                        lines.push(`${indent}END WHILE`);
                        break;
                    case 'if_condition':
                        lines.push(`${indent}IF (${b.condition || 'true'}) THEN`);
                        traverse(b.then_body, lvl + 1);
                        if (b.else_body && b.else_body.length > 0) {
                            lines.push(`${indent}ELSE`);
                            traverse(b.else_body, lvl + 1);
                        }
                        lines.push(`${indent}END IF`);
                        break;
                }
            }
        };

        if (!blocks || blocks.length === 0) {
            lines.push("    // Canvas is empty. Drag or click blocks to assemble logic!");
        } else {
            traverse(blocks, 1);
        }

        lines.push(`END`);
        return lines.join("\n");
    }

    // ==========================================
    // 2. PYTHON 3
    // ==========================================
    generatePython(blocks, title) {
        const lines = [];
        lines.push(`# Auto-transpiled Python 3 Code: ${title}`);
        lines.push(`# Personalized Academic Learning & Visual Programming Assistant`);
        lines.push(``);

        const traverse = (list, lvl) => {
            const indent = "    ".repeat(lvl);
            if (!list || list.length === 0) {
                if (lvl > 0) lines.push(`${indent}pass`);
                return;
            }
            for (const b of list) {
                switch (b.type) {
                    case 'comment':
                        lines.push(`${indent}# ${b.text || ''}`);
                        break;
                    case 'variable_declare':
                        lines.push(`${indent}${b.var_name || 'x'} = ${b.initial_value || '0'}`);
                        break;
                    case 'variable_assign':
                        lines.push(`${indent}${b.var_name || 'x'} = ${this.formatPyAssign(b.var_name || 'x', b.expression || '0')}`);
                        break;
                    case 'input':
                        const p = b.prompt ? `"${b.prompt} "` : '"Enter value: "';
                        const vtype = b.var_type || 'int';
                        if (vtype === 'int') {
                            lines.push(`${indent}${b.var_name || 'n'} = int(input(${p}))`);
                        } else if (vtype === 'float') {
                            lines.push(`${indent}${b.var_name || 'n'} = float(input(${p}))`);
                        } else {
                            lines.push(`${indent}${b.var_name || 'n'} = input(${p})`);
                        }
                        break;
                    case 'output':
                        lines.push(`${indent}${this.formatPyPrint(b.expression || '""')}`);
                        break;
                    case 'for_loop':
                        const step = b.step || '1';
                        let rangeStr = `range(${b.start_val || '1'}, ${b.end_val || '10'} + 1)`;
                        if (step != '1') rangeStr = `range(${b.start_val || '1'}, ${b.end_val || '10'} + 1, ${step})`;
                        lines.push(`${indent}for ${b.iterator || 'i'} in ${rangeStr}:`);
                        traverse(b.body, lvl + 1);
                        break;
                    case 'while_loop':
                        lines.push(`${indent}while ${this.pyCond(b.condition || 'True')}:`);
                        traverse(b.body, lvl + 1);
                        break;
                    case 'if_condition':
                        lines.push(`${indent}if ${this.pyCond(b.condition || 'True')}:`);
                        traverse(b.then_body, lvl + 1);
                        if (b.else_body && b.else_body.length > 0) {
                            lines.push(`${indent}else:`);
                            traverse(b.else_body, lvl + 1);
                        }
                        break;
                }
            }
        };

        if (!blocks || blocks.length === 0) {
            lines.push("# Place blocks on the workspace to generate Python code");
            lines.push("print('Hello from Visual Programming Assistant!')");
        } else {
            traverse(blocks, 0);
        }

        return lines.join("\n");
    }

    // ==========================================
    // 3. ANSI C
    // ==========================================
    generateC(blocks, title) {
        const lines = [
            `/* Auto-transpiled ANSI C Code: ${title} */`,
            `/* Personalized Academic Learning & Visual Programming Assistant */`,
            `#include <stdio.h>`,
            `#include <stdlib.h>`,
            `#include <stdbool.h>`,
            ``,
            `int main(void) {`
        ];

        // Declare variables at the top of main()
        const varNames = Object.keys(this.declaredVars);
        if (varNames.length > 0) {
            for (const v of varNames) {
                const t = this.declaredVars[v];
                if (t === 'float' || t === 'double') {
                    lines.push(`    double ${v} = 0.0;`);
                } else if (t === 'string') {
                    lines.push(`    char ${v}[256] = "";`);
                } else if (t === 'bool') {
                    lines.push(`    bool ${v} = false;`);
                } else {
                    lines.push(`    int ${v} = 0;`);
                }
            }
            lines.push(``);
        }

        const traverse = (list, lvl) => {
            const indent = "    ".repeat(lvl);
            if (!list || list.length === 0) return;

            for (const b of list) {
                switch (b.type) {
                    case 'comment':
                        lines.push(`${indent}/* ${b.text || ''} */`);
                        break;
                    case 'variable_declare':
                        lines.push(`${indent}${b.var_name || 'x'} = ${b.initial_value || '0'};`);
                        break;
                    case 'variable_assign':
                        lines.push(`${indent}${b.var_name || 'x'} = ${this.cExpr(b.expression || '0')};`);
                        break;
                    case 'input':
                        const vname = b.var_name || 'n';
                        const vtype = this.declaredVars[vname] || 'int';
                        if (b.prompt) lines.push(`${indent}printf("${b.prompt}\\n");`);
                        if (vtype === 'float' || vtype === 'double') {
                            lines.push(`${indent}scanf("%lf", &${vname});`);
                        } else if (vtype === 'string') {
                            lines.push(`${indent}scanf("%255s", ${vname});`);
                        } else {
                            lines.push(`${indent}scanf("%d", &${vname});`);
                        }
                        break;
                    case 'output':
                        lines.push(this.formatCPrint(b.expression || '""', indent));
                        break;
                    case 'for_loop':
                        const it = b.iterator || 'i';
                        const start = b.start_val || '1';
                        const end = b.end_val || '10';
                        const step = b.step || '1';
                        const stepStr = (step == '1') ? `${it}++` : `${it} += ${step}`;
                        lines.push(`${indent}for (${it} = ${start}; ${it} <= ${end}; ${stepStr}) {`);
                        traverse(b.body, lvl + 1);
                        lines.push(`${indent}}`);
                        break;
                    case 'while_loop':
                        lines.push(`${indent}while (${this.cCond(b.condition || '1')}) {`);
                        traverse(b.body, lvl + 1);
                        lines.push(`${indent}}`);
                        break;
                    case 'if_condition':
                        lines.push(`${indent}if (${this.cCond(b.condition || '1')}) {`);
                        traverse(b.then_body, lvl + 1);
                        if (b.else_body && b.else_body.length > 0) {
                            lines.push(`${indent}} else {`);
                            traverse(b.else_body, lvl + 1);
                        }
                        lines.push(`${indent}}`);
                        break;
                }
            }
        };

        if (!blocks || blocks.length === 0) {
            lines.push(`    printf("Visual Programming Canvas Ready.\\n");`);
        } else {
            traverse(blocks, 1);
        }

        lines.push(``);
        lines.push(`    return 0;`);
        lines.push(`}`);

        return lines.join("\n");
    }

    // ==========================================
    // 4. JAVA 17+
    // ==========================================
    generateJava(blocks, title) {
        const lines = [
            `/* Auto-transpiled Java 17+ Code: ${title} */`,
            `/* Personalized Academic Learning & Visual Programming Assistant */`,
            `import java.util.Scanner;`,
            ``,
            `public class Main {`,
            `    public static void main(String[] args) {`,
            `        Scanner scanner = new Scanner(System.in);`
        ];

        // Declare variables
        const varNames = Object.keys(this.declaredVars);
        if (varNames.length > 0) {
            for (const v of varNames) {
                const t = this.declaredVars[v];
                if (t === 'float' || t === 'double') {
                    lines.push(`        double ${v} = 0.0;`);
                } else if (t === 'string') {
                    lines.push(`        String ${v} = "";`);
                } else if (t === 'bool') {
                    lines.push(`        boolean ${v} = false;`);
                } else {
                    lines.push(`        int ${v} = 0;`);
                }
            }
            lines.push(``);
        }

        const traverse = (list, lvl) => {
            const indent = "    ".repeat(lvl);
            if (!list || list.length === 0) return;

            for (const b of list) {
                switch (b.type) {
                    case 'comment':
                        lines.push(`${indent}// ${b.text || ''}`);
                        break;
                    case 'variable_declare':
                        lines.push(`${indent}${b.var_name || 'x'} = ${b.initial_value || '0'};`);
                        break;
                    case 'variable_assign':
                        lines.push(`${indent}${b.var_name || 'x'} = ${this.javaExpr(b.expression || '0')};`);
                        break;
                    case 'input':
                        const vname = b.var_name || 'n';
                        const vtype = this.declaredVars[vname] || 'int';
                        if (b.prompt) lines.push(`${indent}System.out.println("${b.prompt}");`);
                        if (vtype === 'float' || vtype === 'double') {
                            lines.push(`${indent}${vname} = scanner.nextDouble();`);
                        } else if (vtype === 'string') {
                            lines.push(`${indent}${vname} = scanner.next();`);
                        } else {
                            lines.push(`${indent}${vname} = scanner.nextInt();`);
                        }
                        break;
                    case 'output':
                        lines.push(`${indent}System.out.println(${this.javaExpr(b.expression || '""')});`);
                        break;
                    case 'for_loop':
                        const it = b.iterator || 'i';
                        const start = b.start_val || '1';
                        const end = b.end_val || '10';
                        const step = b.step || '1';
                        const stepStr = (step == '1') ? `${it}++` : `${it} += ${step}`;
                        lines.push(`${indent}for (int ${it} = ${start}; ${it} <= ${end}; ${stepStr}) {`);
                        traverse(b.body, lvl + 1);
                        lines.push(`${indent}}`);
                        break;
                    case 'while_loop':
                        lines.push(`${indent}while (${this.javaCond(b.condition || 'true')}) {`);
                        traverse(b.body, lvl + 1);
                        lines.push(`${indent}}`);
                        break;
                    case 'if_condition':
                        lines.push(`${indent}if (${this.javaCond(b.condition || 'true')}) {`);
                        traverse(b.then_body, lvl + 1);
                        if (b.else_body && b.else_body.length > 0) {
                            lines.push(`${indent}} else {`);
                            traverse(b.else_body, lvl + 1);
                        }
                        lines.push(`${indent}}`);
                        break;
                }
            }
        };

        if (!blocks || blocks.length === 0) {
            lines.push(`        System.out.println("Visual Programming Canvas Ready.");`);
        } else {
            traverse(blocks, 2);
        }

        lines.push(``);
        lines.push(`        scanner.close();`);
        lines.push(`    }`);
        lines.push(`}`);

        return lines.join("\n");
    }

    javaExpr(expr) {
        return String(expr).replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!');
    }

    javaCond(cond) {
        return this.javaExpr(cond);
    }

    splitTopLevelPlus(expr) {
        const parts = [];
        let current = '';
        let depth = 0;
        let inQuote = false;
        let quoteChar = '';
        for (let i = 0; i < expr.length; i++) {
            const ch = expr[i];
            if (inQuote) {
                current += ch;
                if (ch === quoteChar && expr[i - 1] !== '\\') {
                    inQuote = false;
                }
            } else {
                if (ch === '"' || ch === "'") {
                    inQuote = true;
                    quoteChar = ch;
                    current += ch;
                } else if (ch === '(' || ch === '[' || ch === '{') {
                    depth++;
                    current += ch;
                } else if (ch === ')' || ch === ']' || ch === '}') {
                    depth--;
                    current += ch;
                } else if (ch === '+' && depth === 0) {
                    parts.push(current.trim());
                    current = '';
                } else {
                    current += ch;
                }
            }
        }
        if (current.trim()) parts.push(current.trim());
        return parts;
    }

    pyExpr(expr) {
        return String(expr).replace(/&&/g, ' and ').replace(/\|\|/g, ' or ');
    }

    pyCond(cond) {
        return this.pyExpr(cond);
    }

    formatPyPrint(rawExpr) {
        const expr = String(rawExpr || '""').trim();
        const parts = this.splitTopLevelPlus(expr);
        const hasStringLiteral = parts.some(p => (p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'")));
        if (!hasStringLiteral) {
            return `print(${this.pyExpr(expr)})`;
        }
        const formattedParts = parts.map(p => {
            if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
                return p;
            }
            return `str(${this.pyExpr(p)})`;
        });
        return `print(${formattedParts.join(' + ')})`;
    }

    formatPyAssign(varName, rawExpr) {
        let expr = String(rawExpr || '0').trim();
        const vtype = this.declaredVars[varName] || 'int';
        // Python integer division conversion for integer variables
        if (vtype === 'int' && expr.includes('/') && !expr.includes('//') && !/\d+\.\d+/.test(expr)) {
            expr = expr.replace(/(?<!\/)\/(?!\/)/g, '//');
        }

        if (vtype === 'string' || ((expr.includes('"') || expr.includes("'")) && expr.includes('+'))) {
            const parts = this.splitTopLevelPlus(expr);
            const hasStr = parts.some(p => (p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'")) || this.declaredVars[p] === 'string');
            if (hasStr) {
                return parts.map(p => {
                    if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'")) || this.declaredVars[p] === 'string') {
                        return this.pyExpr(p);
                    }
                    return `str(${this.pyExpr(p)})`;
                }).join(' + ');
            }
        }
        return this.pyExpr(expr);
    }

    cExpr(expr) {
        return String(expr).replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!');
    }

    cCond(cond) {
        return this.cExpr(cond);
    }

    formatCPrint(rawExpr, indent) {
        const expr = String(rawExpr || '""').trim();
        const parts = this.splitTopLevelPlus(expr);

        // 1. Single string literal
        if (parts.length === 1 && ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'")))) {
            const clean = expr.slice(1, -1);
            return `${indent}printf("${clean}\\n");`;
        }

        // 2. Single declared variable
        if (parts.length === 1 && this.declaredVars[expr]) {
            const t = this.declaredVars[expr];
            const spec = (t === 'float' || t === 'double') ? '%lf' : (t === 'string' ? '%s' : '%d');
            return `${indent}printf("${expr} = ${spec}\\n", ${expr});`;
        }

        // 3. Concatenated parts with string literals
        const hasStringLiteral = parts.some(p => (p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'")));
        if (hasStringLiteral) {
            let fmt = "";
            const args = [];
            for (const part of parts) {
                if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
                    fmt += part.slice(1, -1).replace(/%/g, '%%');
                } else {
                    const cleanPart = this.cExpr(part);
                    const t = this.declaredVars[cleanPart] || 'int';
                    const spec = (t === 'float' || t === 'double') ? '%lf' : (t === 'string' ? '%s' : '%d');
                    fmt += spec;
                    args.push(cleanPart);
                }
            }
            if (args.length > 0) {
                return `${indent}printf("${fmt}\\n", ${args.join(', ')});`;
            } else {
                return `${indent}printf("${fmt}\\n");`;
            }
        }

        // 4. Default arithmetic expression
        return `${indent}printf("%d\\n", ${this.cExpr(expr)});`;
    }
}

// Global singleton instance
window.clientTranspiler = new ClientTranspiler();
