global.window = global;
require('../static/js/transpiler.js');
require('../static/js/program_library_data.js');
const cp = require('child_process');

let failures = [];
let passed = 0;

window.PROGRAM_LIBRARY_DATA.forEach((p, idx) => {
    const res = window.clientTranspiler.transpile(p.blocks, p.id);
    const py = res.python;

    // Determine mock inputs based on program
    let mockInput = '';
    if (p.id === 'prog_01_hello') {
        mockInput = 'Alex\n';
    } else {
        // Feed plenty of integer/float numbers
        mockInput = '5\n10\n15\n20\n25\n30\n7\n3\n8\n100\n50\n25\n12\n1011\n4\n2\n1\n0\n0\n5\n10\n15\n20\n';
    }

    try {
        const proc = cp.spawnSync('python', ['-c', py], {
            input: mockInput,
            encoding: 'utf-8',
            timeout: 2500
        });
        if (proc.status !== 0) {
            const errLine = (proc.stderr || '').trim().split('\n').pop();
            failures.push({ id: p.id, title: p.title, err: errLine });
        } else {
            passed++;
        }
    } catch (e) {
        failures.push({ id: p.id, title: p.title, err: e.message });
    }
});

console.log(`Verification Complete: ${passed} / ${window.PROGRAM_LIBRARY_DATA.length} Passed!`);
if (failures.length > 0) {
    console.log(`Failures (${failures.length}):`);
    failures.forEach(f => console.log(`  [${f.id}] ${f.title}: ${f.err}`));
}
