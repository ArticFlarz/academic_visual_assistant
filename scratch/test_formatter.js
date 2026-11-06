function splitTopLevelPlus(expr) {
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

function formatCPrint(expr, declaredVars = {}) {
    expr = String(expr).trim();
    const parts = splitTopLevelPlus(expr);

    // 1. Single string literal
    if (parts.length === 1 && ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'")))) {
        const clean = expr.slice(1, -1);
        return `printf("${clean}\\n");`;
    }

    // 2. Single declared variable
    if (parts.length === 1 && declaredVars[expr]) {
        const t = declaredVars[expr];
        const spec = (t === 'float' || t === 'double') ? '%lf' : (t === 'string' ? '%s' : '%d');
        return `printf("${expr} = ${spec}\\n", ${expr});`;
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
                const t = declaredVars[part] || 'int';
                const spec = (t === 'float' || t === 'double') ? '%lf' : (t === 'string' ? '%s' : '%d');
                fmt += spec;
                args.push(part);
            }
        }
        if (args.length > 0) {
            return `printf("${fmt}\\n", ${args.join(', ')});`;
        } else {
            return `printf("${fmt}\\n");`;
        }
    }

    // 4. Default arithmetic expression
    return `printf("%d\\n", ${expr});`;
}

console.log(formatCPrint('"Sum = " + sum_val', { sum_val: 'int' }));
console.log(formatCPrint('table_num + " x " + i + " = " + prod', { table_num: 'int', i: 'int', prod: 'int' }));
console.log(formatCPrint('"Factorial of " + n + " = " + fact', { n: 'int', fact: 'int' }));
console.log(formatCPrint('"Circle Area: " + circ_area', { circ_area: 'float' }));
console.log(formatCPrint('"Time formatted: " + hours + "h " + mins + "m " + secs + "s"', { hours: 'int', mins: 'int', secs: 'int' }));
console.log(formatCPrint('"Hello world"'));
console.log(formatCPrint('count', { count: 'int' }));
