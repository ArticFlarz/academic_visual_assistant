global.window = global;
require('../static/js/program_library_data.js');

const list = window.PROGRAM_LIBRARY_DATA.map((p, idx) => {
    const inputs = [];
    const outputs = [];
    const comments = [];
    const vars = [];
    const walk = (blocks) => {
        if (!blocks) return;
        for (const b of blocks) {
            if (b.type === 'input') inputs.push(b.var_name + ' (' + (b.prompt || '') + ')');
            if (b.type === 'output') outputs.push(b.expression);
            if (b.type === 'comment') comments.push(b.text);
            if (b.type === 'variable_declare') vars.push(b.var_name + '=' + b.initial_value);
            if (b.body) walk(b.body);
            if (b.then_body) walk(b.then_body);
            if (b.else_body) walk(b.else_body);
        }
    };
    walk(p.blocks);
    return {
        idx: idx + 1,
        id: p.id,
        category: p.category,
        title: p.title,
        inputs: inputs.join(', ') || 'NONE',
        vars: vars.join(', '),
        outputs: outputs.join(', '),
        comments: comments.join(', ')
    };
});

console.log(JSON.stringify(list, null, 2));
