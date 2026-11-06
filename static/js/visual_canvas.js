/**
 * Interactive Visual Block Canvas Manager
 * Handles:
 * 1. HTML5 Drag-and-Drop Block Construction (from toolbox to canvas and reordering)
 * 2. Nested block insertion for loop bodies and branches
 * 3. Real-time transpilation into Pseudocode, Python 3, ANSI C, and Java 17+
 * 4. Interactive CLI in-terminal input & output execution (Zero browser prompts)
 * 5. URL ?load=<id> loading from 75+ Algorithms Library
 * 6. Code export across 4 languages
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvasWorkArea = document.getElementById('canvasWorkArea');
    if (!canvasWorkArea) return;

    // State
    const state = {
        title: "Factorial Computation",
        currentTab: 'python', // 'pseudocode' | 'python' | 'c' | 'java'
        blocks: [],
        activeProgramId: null
    };

    // DOM Elements
    const algorithmTitleInput = document.getElementById('algorithmTitleInput');
    const codeViewer = document.getElementById('codeViewer');
    const consoleOutput = document.getElementById('consoleOutput');
    const templateSelect = document.getElementById('templateSelect');
    const btnRunCode = document.getElementById('btnRunCode');
    const btnClearCanvas = document.getElementById('btnClearCanvas');
    const btnSaveProgram = document.getElementById('btnSaveProgram');
    const btnCopyCode = document.getElementById('btnCopyCode');
    const btnDownloadCode = document.getElementById('btnDownloadCode');
    const tabBtns = document.querySelectorAll('.transpiler-tab-btn');

    // Interactive Terminal Elements
    const terminalInputContainer = document.getElementById('terminalInputContainer');
    const terminalInput = document.getElementById('terminalInput');
    const btnTerminalSubmit = document.getElementById('btnTerminalSubmit');
    const btnClearTerminal = document.getElementById('btnClearTerminal');
    const terminalStatusBadge = document.getElementById('terminalStatusBadge');

    // Interactive execution session state
    let pendingExecution = null;

    // 1. Check URL parameters for ?load=<id> and ?tab=<lang>
    const urlParams = new URLSearchParams(window.location.search);
    const loadId = urlParams.get('load');
    const tabParam = urlParams.get('tab');

    if (tabParam && ['pseudocode', 'python', 'c', 'java'].includes(tabParam.toLowerCase())) {
        state.currentTab = tabParam.toLowerCase();
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === state.currentTab);
        });
    }

    let loadedFromLibrary = false;

    if (loadId && window.PROGRAM_LIBRARY_DATA) {
        const cleanLoadId = loadId.trim().toLowerCase();
        const found = window.PROGRAM_LIBRARY_DATA.find(p => 
            p.id.toLowerCase() === cleanLoadId || 
            p.title.toLowerCase() === cleanLoadId
        );

        if (found) {
            state.blocks = JSON.parse(JSON.stringify(found.blocks));
            state.title = found.title;
            if (algorithmTitleInput) algorithmTitleInput.value = state.title;
            loadedFromLibrary = true;
            setTimeout(() => {
                window.showAppToast?.(`Loaded "${found.title}" from Logic Library!`, 'success');
            }, 250);
        }
    }

    if (!loadedFromLibrary && loadId) {
        // Attempt loading as a saved user program by integer ID
        fetch(`/api/programs/${loadId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.program) {
                    state.blocks = data.program.block_data || [];
                    state.title = data.program.title || "Custom Algorithm";
                    state.activeProgramId = data.program.id;
                    if (algorithmTitleInput) algorithmTitleInput.value = state.title;
                    renderCanvas();
                    window.showAppToast?.(`Loaded saved program "${state.title}"!`, 'success');
                }
            })
            .catch(() => {});
    } else if (!loadedFromLibrary && window.ALGORITHM_TEMPLATES && ALGORITHM_TEMPLATES.factorial) {
        // Fallback default template
        state.blocks = JSON.parse(JSON.stringify(ALGORITHM_TEMPLATES.factorial.blocks));
        state.title = ALGORITHM_TEMPLATES.factorial.title;
        if (algorithmTitleInput) algorithmTitleInput.value = state.title;
    }

    // ==========================================
    // 2. CANVAS RENDERING
    // ==========================================
    function renderCanvas() {
        if (!state.blocks || state.blocks.length === 0) {
            canvasWorkArea.innerHTML = `
                <div class="canvas-empty-prompt">
                    <span>🧩</span>
                    <h4>Your visual canvas is empty</h4>
                    <p style="font-size:0.84rem; margin-top:0.35rem; color:var(--text-secondary);">
                        Drag blocks from the toolbox on the left, or select an algorithm from the 75+ Logic Library.
                    </p>
                </div>
            `;
        } else {
            canvasWorkArea.innerHTML = '';
            state.blocks.forEach((block, index) => {
                const el = createBlockElement(block, [index]);
                canvasWorkArea.appendChild(el);
            });
        }

        updateTranspiledCode();
    }

    function createBlockElement(block, path) {
        const div = document.createElement('div');
        div.className = `block-item block-${getBlockCategoryClass(block.type)}`;
        div.dataset.path = JSON.stringify(path);
        div.setAttribute('draggable', 'true');

        // Drag handle and header
        const header = document.createElement('div');
        header.className = 'block-header';

        const titleRow = document.createElement('div');
        titleRow.className = 'block-title-row';
        titleRow.innerHTML = `
            <span class="drag-handle" title="Drag to reorder or move block">⋮⋮</span>
            <span>${getBlockIcon(block.type)} ${getBlockDisplayName(block.type)}</span>
        `;

        const controls = document.createElement('div');
        controls.className = 'block-controls';
        controls.innerHTML = `
            <button type="button" class="btn-block-action btn-move-up" title="Move Up">↑</button>
            <button type="button" class="btn-block-action btn-move-down" title="Move Down">↓</button>
            <button type="button" class="btn-block-action btn-delete-block" title="Remove Block">✕</button>
        `;

        header.appendChild(titleRow);
        header.appendChild(controls);
        div.appendChild(header);

        // Body inputs
        const inputsContainer = document.createElement('div');
        inputsContainer.className = 'block-inputs-row';
        renderBlockInputs(block, path, inputsContainer);
        div.appendChild(inputsContainer);

        // Nested containers for loops
        if (block.type === 'for_loop' || block.type === 'while_loop') {
            const nested = document.createElement('div');
            nested.className = 'nested-container';
            nested.innerHTML = `<span class="nested-container-label">Loop Body (Execute repeated steps):</span>`;

            if (!block.body || block.body.length === 0) {
                nested.innerHTML += `<div class="nested-empty-hint">+ Drag block here or click "+ Add Step" below</div>`;
            } else {
                block.body.forEach((childBlock, cIdx) => {
                    nested.appendChild(createBlockElement(childBlock, [...path, 'body', cIdx]));
                });
            }

            const addBtn = document.createElement('button');
            addBtn.className = 'btn btn-secondary btn-sm';
            addBtn.style.marginTop = '0.35rem';
            addBtn.style.alignSelf = 'flex-start';
            addBtn.innerHTML = `+ Add Step Inside Loop`;
            addBtn.onclick = (e) => {
                e.stopPropagation();
                promptAddNestedBlock(path, 'body');
            };
            nested.appendChild(addBtn);
            setupNestedDropZone(nested, path, 'body');
            div.appendChild(nested);
        }

        // Nested containers for if-condition
        if (block.type === 'if_condition') {
            // Then body
            const thenContainer = document.createElement('div');
            thenContainer.className = 'nested-container';
            thenContainer.innerHTML = `<span class="nested-container-label">THEN (Condition is True):</span>`;

            if (!block.then_body || block.then_body.length === 0) {
                thenContainer.innerHTML += `<div class="nested-empty-hint">+ Drag block here or click below to add</div>`;
            } else {
                block.then_body.forEach((childBlock, cIdx) => {
                    thenContainer.appendChild(createBlockElement(childBlock, [...path, 'then_body', cIdx]));
                });
            }

            const addThenBtn = document.createElement('button');
            addThenBtn.className = 'btn btn-secondary btn-sm';
            addThenBtn.style.marginTop = '0.35rem';
            addThenBtn.style.alignSelf = 'flex-start';
            addThenBtn.innerHTML = `+ Add True Branch Step`;
            addThenBtn.onclick = (e) => {
                e.stopPropagation();
                promptAddNestedBlock(path, 'then_body');
            };
            thenContainer.appendChild(addThenBtn);
            setupNestedDropZone(thenContainer, path, 'then_body');
            div.appendChild(thenContainer);

            // Else body
            const elseContainer = document.createElement('div');
            elseContainer.className = 'nested-container';
            elseContainer.innerHTML = `<span class="nested-container-label">ELSE (Condition is False):</span>`;

            if (!block.else_body || block.else_body.length === 0) {
                elseContainer.innerHTML += `<div class="nested-empty-hint">Optional: Drag block here for Else branch</div>`;
            } else {
                block.else_body.forEach((childBlock, cIdx) => {
                    elseContainer.appendChild(createBlockElement(childBlock, [...path, 'else_body', cIdx]));
                });
            }

            const addElseBtn = document.createElement('button');
            addElseBtn.className = 'btn btn-secondary btn-sm';
            addElseBtn.style.marginTop = '0.35rem';
            addElseBtn.style.alignSelf = 'flex-start';
            addElseBtn.innerHTML = `+ Add Else Branch Step`;
            addElseBtn.onclick = (e) => {
                e.stopPropagation();
                promptAddNestedBlock(path, 'else_body');
            };
            elseContainer.appendChild(addElseBtn);
            setupNestedDropZone(elseContainer, path, 'else_body');
            div.appendChild(elseContainer);
        }

        // Button Controls
        controls.querySelector('.btn-delete-block').onclick = (e) => {
            e.stopPropagation();
            deleteBlockAtPath(path);
        };
        controls.querySelector('.btn-move-up').onclick = (e) => {
            e.stopPropagation();
            moveBlockAtPath(path, -1);
        };
        controls.querySelector('.btn-move-down').onclick = (e) => {
            e.stopPropagation();
            moveBlockAtPath(path, 1);
        };

        // -------------------------------------------------------------
        // HTML5 DRAG & DROP FOR BLOCKS (Reordering & Insertion)
        // -------------------------------------------------------------
        div.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            div.classList.add('is-dragging');
            e.dataTransfer.setData('application/json', JSON.stringify({
                source: 'canvas',
                path: path
            }));
            e.dataTransfer.effectAllowed = 'move';
        });

        div.addEventListener('dragend', (e) => {
            e.stopPropagation();
            div.classList.remove('is-dragging');
            clearDropIndicators();
        });

        div.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = div.getBoundingClientRect();
            const relY = e.clientY - rect.top;
            if (relY < rect.height / 2) {
                div.classList.add('drop-indicator-top');
                div.classList.remove('drop-indicator-bottom');
            } else {
                div.classList.add('drop-indicator-bottom');
                div.classList.remove('drop-indicator-top');
            }
        });

        div.addEventListener('dragleave', (e) => {
            div.classList.remove('drop-indicator-top', 'drop-indicator-bottom');
        });

        div.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isTop = div.classList.contains('drop-indicator-top');
            div.classList.remove('drop-indicator-top', 'drop-indicator-bottom');
            handleAdjacentDrop(e, path, isTop ? 0 : 1);
        });

        return div;
    }

    // Renders the inputs inside each block
    function renderBlockInputs(block, path, container) {
        switch (block.type) {
            case 'comment':
                container.innerHTML = `
                    <span>Note:</span>
                    <input type="text" class="block-inline-input comment-text" style="flex:1;" value="${escapeHtml(block.text || '')}" placeholder="Explain step..." />
                `;
                container.querySelector('.comment-text').oninput = (e) => { block.text = e.target.value; updateTranspiledCode(); };
                break;

            case 'variable_declare':
                container.innerHTML = `
                    <span>Declare</span>
                    <input type="text" class="block-inline-input var-name" style="width:75px;" value="${escapeHtml(block.var_name || 'x')}" placeholder="var" />
                    <span>as</span>
                    <select class="block-inline-select var-type">
                        <option value="int" ${block.var_type === 'int' ? 'selected' : ''}>int</option>
                        <option value="float" ${block.var_type === 'float' ? 'selected' : ''}>float</option>
                        <option value="string" ${block.var_type === 'string' ? 'selected' : ''}>string</option>
                        <option value="bool" ${block.var_type === 'bool' ? 'selected' : ''}>bool</option>
                    </select>
                    <span>=</span>
                    <input type="text" class="block-inline-input var-init" style="flex:1;" value="${escapeHtml(block.initial_value || '0')}" placeholder="value" />
                `;
                container.querySelector('.var-name').oninput = (e) => { block.var_name = e.target.value; updateTranspiledCode(); };
                container.querySelector('.var-type').onchange = (e) => { block.var_type = e.target.value; updateTranspiledCode(); };
                container.querySelector('.var-init').oninput = (e) => { block.initial_value = e.target.value; updateTranspiledCode(); };
                break;

            case 'variable_assign':
                container.innerHTML = `
                    <span>Set</span>
                    <input type="text" class="block-inline-input assign-var" style="width:80px;" value="${escapeHtml(block.var_name || 'x')}" placeholder="var" />
                    <span>=</span>
                    <input type="text" class="block-inline-input assign-expr" style="flex:1;" value="${escapeHtml(block.expression || '0')}" placeholder="expression e.g. x + 1" />
                `;
                container.querySelector('.assign-var').oninput = (e) => { block.var_name = e.target.value; updateTranspiledCode(); };
                container.querySelector('.assign-expr').oninput = (e) => { block.expression = e.target.value; updateTranspiledCode(); };
                break;

            case 'input':
                container.innerHTML = `
                    <span>Prompt</span>
                    <input type="text" class="block-inline-input input-prompt" style="flex:1;" value="${escapeHtml(block.prompt || 'Enter value:')}" placeholder="Prompt message" />
                    <span>store in</span>
                    <input type="text" class="block-inline-input input-var" style="width:75px;" value="${escapeHtml(block.var_name || 'n')}" placeholder="var" />
                    <select class="block-inline-select input-type">
                        <option value="int" ${block.var_type === 'int' ? 'selected' : ''}>int</option>
                        <option value="float" ${block.var_type === 'float' ? 'selected' : ''}>float</option>
                        <option value="string" ${block.var_type === 'string' ? 'selected' : ''}>string</option>
                    </select>
                `;
                container.querySelector('.input-prompt').oninput = (e) => { block.prompt = e.target.value; updateTranspiledCode(); };
                container.querySelector('.input-var').oninput = (e) => { block.var_name = e.target.value; updateTranspiledCode(); };
                container.querySelector('.input-type').onchange = (e) => { block.var_type = e.target.value; updateTranspiledCode(); };
                break;

            case 'output':
                container.innerHTML = `
                    <span>Print</span>
                    <input type="text" class="block-inline-input output-expr" style="flex:1;" value="${escapeHtml(block.expression || '""')}" placeholder="expression or text" />
                `;
                container.querySelector('.output-expr').oninput = (e) => { block.expression = e.target.value; updateTranspiledCode(); };
                break;

            case 'for_loop':
                container.innerHTML = `
                    <span>For</span>
                    <input type="text" class="block-inline-input for-it" style="width:50px;" value="${escapeHtml(block.iterator || 'i')}" placeholder="i" />
                    <span>from</span>
                    <input type="text" class="block-inline-input for-start" style="width:55px;" value="${escapeHtml(block.start_val || '1')}" placeholder="1" />
                    <span>to</span>
                    <input type="text" class="block-inline-input for-end" style="width:65px;" value="${escapeHtml(block.end_val || '10')}" placeholder="10" />
                    <span>step</span>
                    <input type="text" class="block-inline-input for-step" style="width:50px;" value="${escapeHtml(block.step || '1')}" placeholder="1" />
                `;
                container.querySelector('.for-it').oninput = (e) => { block.iterator = e.target.value; updateTranspiledCode(); };
                container.querySelector('.for-start').oninput = (e) => { block.start_val = e.target.value; updateTranspiledCode(); };
                container.querySelector('.for-end').oninput = (e) => { block.end_val = e.target.value; updateTranspiledCode(); };
                container.querySelector('.for-step').oninput = (e) => { block.step = e.target.value; updateTranspiledCode(); };
                break;

            case 'while_loop':
                container.innerHTML = `
                    <span>While condition:</span>
                    <input type="text" class="block-inline-input while-cond" style="flex:1;" value="${escapeHtml(block.condition || 'i <= 10')}" placeholder="condition e.g. i <= n" />
                `;
                container.querySelector('.while-cond').oninput = (e) => { block.condition = e.target.value; updateTranspiledCode(); };
                break;

            case 'if_condition':
                container.innerHTML = `
                    <span>If:</span>
                    <input type="text" class="block-inline-input if-cond" style="flex:1;" value="${escapeHtml(block.condition || 'x > 0')}" placeholder="condition e.g. n % 2 == 0" />
                `;
                container.querySelector('.if-cond').oninput = (e) => { block.condition = e.target.value; updateTranspiledCode(); };
                break;
        }
    }

    // Helpers for Block types & Styling
    function getBlockCategoryClass(type) {
        if (type.includes('variable')) return 'var';
        if (type.includes('loop')) return 'loop';
        if (type.includes('if')) return 'logic';
        if (type === 'input' || type === 'output') return 'io';
        if (type === 'comment') return 'comment';
        return 'var';
    }

    function getBlockIcon(type) {
        switch (type) {
            case 'variable_declare': return '📦';
            case 'variable_assign': return '✏️';
            case 'for_loop': return '🔁';
            case 'while_loop': return '🔄';
            case 'if_condition': return '🔀';
            case 'input': return '📥';
            case 'output': return '📤';
            case 'comment': return '💬';
            default: return '⚙️';
        }
    }

    function getBlockDisplayName(type) {
        switch (type) {
            case 'variable_declare': return 'Variable Declaration';
            case 'variable_assign': return 'Variable Assignment';
            case 'for_loop': return 'Counted Loop (FOR)';
            case 'while_loop': return 'Conditional Loop (WHILE)';
            case 'if_condition': return 'Conditional Branch (IF / ELSE)';
            case 'input': return 'Read User Input';
            case 'output': return 'Print Output';
            case 'comment': return 'Annotation / Note';
            default: return type;
        }
    }

    // Default block model generator
    function createDefaultBlock(blockType) {
        switch (blockType) {
            case 'variable_declare':
                return { type: 'variable_declare', var_name: 'count', var_type: 'int', initial_value: '0' };
            case 'variable_assign':
                return { type: 'variable_assign', var_name: 'count', expression: 'count + 1' };
            case 'for_loop':
                return { type: 'for_loop', iterator: 'i', start_val: '1', end_val: '5', step: '1', body: [] };
            case 'while_loop':
                return { type: 'while_loop', condition: 'count < 10', body: [] };
            case 'if_condition':
                return { type: 'if_condition', condition: 'count > 0', then_body: [], else_body: [] };
            case 'input':
                return { type: 'input', var_name: 'userInput', var_type: 'int', prompt: 'Enter a number:' };
            case 'output':
                return { type: 'output', expression: '"Current value: " + count' };
            case 'comment':
                return { type: 'comment', text: 'Step description' };
            default:
                return { type: 'output', expression: '"Hello from Visual Assistant"' };
        }
    }

    // ==========================================
    // 3. TREE MUTATION & PATH RESOLUTION
    // ==========================================
    function getArrayAndIndexByPath(path) {
        let current = state.blocks;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        return { array: current, index: path[path.length - 1] };
    }

    function deleteBlockAtPath(path) {
        const { array, index } = getArrayAndIndexByPath(path);
        array.splice(index, 1);
        renderCanvas();
    }

    function moveBlockAtPath(path, delta) {
        const { array, index } = getArrayAndIndexByPath(path);
        const targetIdx = index + delta;
        if (targetIdx < 0 || targetIdx >= array.length) return;
        const [moved] = array.splice(index, 1);
        array.splice(targetIdx, 0, moved);
        renderCanvas();
    }

    function promptAddNestedBlock(path, propertyName) {
        let parentBlock = state.blocks;
        for (let i = 0; i < path.length; i++) {
            parentBlock = parentBlock[path[i]];
        }
        if (!parentBlock[propertyName]) {
            parentBlock[propertyName] = [];
        }
        const newBlock = { type: 'variable_assign', var_name: 'x', expression: 'x + 1' };
        parentBlock[propertyName].push(newBlock);
        renderCanvas();
    }

    function removeBlockByPath(path) {
        const { array, index } = getArrayAndIndexByPath(path);
        if (!array || index === undefined) return null;
        const [removed] = array.splice(index, 1);
        return removed;
    }

    function isDescendantPath(ancestorPath, candidatePath) {
        if (candidatePath.length <= ancestorPath.length) return false;
        for (let i = 0; i < ancestorPath.length; i++) {
            if (ancestorPath[i] !== candidatePath[i]) return false;
        }
        return true;
    }

    function handleAdjacentDrop(e, targetPath, offset) {
        try {
            const raw = e.dataTransfer.getData('application/json');
            if (!raw) return;
            const data = JSON.parse(raw);
            let blockToInsert;

            if (data.source === 'toolbox') {
                blockToInsert = createDefaultBlock(data.blockType);
            } else if (data.source === 'canvas') {
                if (isDescendantPath(data.path, targetPath)) {
                    window.showAppToast?.("Cannot nest a container inside its own child!", "warning");
                    return;
                }
                blockToInsert = removeBlockByPath(data.path);
            }

            if (blockToInsert) {
                const { array, index } = getArrayAndIndexByPath(targetPath);
                array.splice(index + offset, 0, blockToInsert);
                renderCanvas();
                window.showAppToast?.(`Block positioned!`, 'info');
            }
        } catch (err) {
            console.error("Drop error:", err);
        }
    }

    function setupNestedDropZone(container, parentPath, propName) {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.add('nested-drop-over');
        });

        container.addEventListener('dragleave', (e) => {
            container.classList.remove('nested-drop-over');
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.remove('nested-drop-over');

            try {
                const raw = e.dataTransfer.getData('application/json');
                if (!raw) return;
                const data = JSON.parse(raw);
                let blockToInsert;

                if (data.source === 'toolbox') {
                    blockToInsert = createDefaultBlock(data.blockType);
                } else if (data.source === 'canvas') {
                    if (isDescendantPath(data.path, parentPath)) {
                        window.showAppToast?.("Cannot nest a container inside its own child!", "warning");
                        return;
                    }
                    blockToInsert = removeBlockByPath(data.path);
                }

                if (blockToInsert) {
                    let parentBlock = state.blocks;
                    for (let p of parentPath) {
                        parentBlock = parentBlock[p];
                    }
                    if (!parentBlock[propName]) parentBlock[propName] = [];
                    parentBlock[propName].push(blockToInsert);
                    renderCanvas();
                    window.showAppToast?.(`Placed block inside ${propName === 'body' ? 'Loop' : 'Branch'}!`, 'info');
                }
            } catch (err) {
                console.error("Nested drop error:", err);
            }
        });
    }

    function clearDropIndicators() {
        document.querySelectorAll('.drop-indicator-top, .drop-indicator-bottom, .nested-drop-over, .canvas-drag-over')
            .forEach(el => el.classList.remove('drop-indicator-top', 'drop-indicator-bottom', 'nested-drop-over', 'canvas-drag-over'));
    }

    // ==========================================
    // 4. MAIN WORKSPACE DROP & TOOLBOX SETUP
    // ==========================================
    canvasWorkArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        canvasWorkArea.classList.add('canvas-drag-over');
    });

    canvasWorkArea.addEventListener('dragleave', (e) => {
        if (e.target === canvasWorkArea) {
            canvasWorkArea.classList.remove('canvas-drag-over');
        }
    });

    canvasWorkArea.addEventListener('drop', (e) => {
        e.preventDefault();
        canvasWorkArea.classList.remove('canvas-drag-over');
        try {
            const raw = e.dataTransfer.getData('application/json');
            if (!raw) return;
            const data = JSON.parse(raw);

            if (data.source === 'toolbox') {
                const newBlock = createDefaultBlock(data.blockType);
                state.blocks.push(newBlock);
                renderCanvas();
                window.showAppToast?.(`Added ${getBlockDisplayName(data.blockType)} to workspace!`, 'info');
            } else if (data.source === 'canvas') {
                const block = removeBlockByPath(data.path);
                if (block) {
                    state.blocks.push(block);
                    renderCanvas();
                }
            }
        } catch (err) {
            console.error("Canvas drop error:", err);
        }
    });

    // Make toolbox buttons draggable as well as clickable
    document.querySelectorAll('.palette-block-btn').forEach(btn => {
        btn.setAttribute('draggable', 'true');

        btn.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify({
                source: 'toolbox',
                blockType: btn.dataset.blockType
            }));
            e.dataTransfer.effectAllowed = 'copy';
            btn.classList.add('palette-dragging');
        });

        btn.addEventListener('dragend', () => {
            btn.classList.remove('palette-dragging');
            clearDropIndicators();
        });

        // Click to add directly to end
        btn.addEventListener('click', () => {
            const blockType = btn.dataset.blockType;
            const newBlock = createDefaultBlock(blockType);
            state.blocks.push(newBlock);
            renderCanvas();
            window.showAppToast?.(`Added ${getBlockDisplayName(blockType)} to canvas!`, 'info');
        });
    });

    // ==========================================
    // 5. REAL-TIME CODE TRANSPILATION (4 LANGUAGES)
    // ==========================================
    let transpiledResults = { pseudocode: '', python: '', c: '', java: '' };

    function updateTranspiledCode() {
        if (window.clientTranspiler) {
            try {
                transpiledResults = window.clientTranspiler.transpile(state.blocks, state.title || "VisualAlgorithm");
                renderCurrentTabCode();
                return;
            } catch (err) {
                console.warn("Client transpiler warning, trying server transpile:", err);
            }
        }

        // Server-side fallback via /api/transpile
        fetch('/api/transpile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                blocks: state.blocks,
                title: state.title || "VisualAlgorithm"
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                transpiledResults = {
                    pseudocode: data.pseudocode,
                    python: data.python,
                    c: data.c,
                    java: data.java
                };
                renderCurrentTabCode();
            }
        })
        .catch(err => {
            console.error("Transpilation request failed:", err);
        });
    }

    function renderCurrentTabCode() {
        if (!codeViewer) return;
        let code = "";
        if (state.currentTab === 'pseudocode') {
            code = transpiledResults.pseudocode || "// Pseudocode will be generated here";
        } else if (state.currentTab === 'c') {
            code = transpiledResults.c || "/* ANSI C code will be generated here */";
        } else if (state.currentTab === 'java') {
            code = transpiledResults.java || "/* Java 17+ code will be generated here */";
        } else {
            code = transpiledResults.python || "# Python 3 code will be generated here";
        }
        codeViewer.textContent = code;
    }

    // Tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentTab = btn.dataset.tab;
            updateTranspiledCode();
        });
    });

    // Template Loader Dropdown
    if (templateSelect) {
        templateSelect.addEventListener('change', (e) => {
            const key = e.target.value;
            if (window.ALGORITHM_TEMPLATES && ALGORITHM_TEMPLATES[key]) {
                const tmpl = ALGORITHM_TEMPLATES[key];
                state.blocks = JSON.parse(JSON.stringify(tmpl.blocks));
                state.title = tmpl.title;
                if (algorithmTitleInput) algorithmTitleInput.value = state.title;
                renderCanvas();
                window.showAppToast?.(`Loaded ${tmpl.title} template!`, 'success');
            }
        });
    }

    // Title Input Change
    if (algorithmTitleInput) {
        algorithmTitleInput.addEventListener('input', (e) => {
            state.title = e.target.value || "VisualAlgorithm";
            updateTranspiledCode();
        });
    }

    // Clear Canvas
    if (btnClearCanvas) {
        btnClearCanvas.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all blocks from the workspace?")) {
                state.blocks = [];
                renderCanvas();
                window.showAppToast?.("Workspace cleared.", "info");
            }
        });
    }

    // ==========================================
    // 6. INTERACTIVE TERMINAL EXECUTION (NO WINDOW.PROMPT)
    // ==========================================
    function setTerminalStatus(status) {
        if (!terminalStatusBadge) return;
        if (status === 'running') {
            terminalStatusBadge.className = 'terminal-badge-running';
            terminalStatusBadge.textContent = 'Running';
        } else if (status === 'waiting') {
            terminalStatusBadge.className = 'terminal-badge-waiting';
            terminalStatusBadge.textContent = 'Awaiting Input';
        } else {
            terminalStatusBadge.className = 'terminal-badge-idle';
            terminalStatusBadge.textContent = 'Idle';
        }
    }

    function appendTerminalLine(text, className = '') {
        if (!consoleOutput) return;
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
        return line;
    }

    function findInputBlocks(blocks) {
        const inputs = [];
        const traverse = (list) => {
            if (!list) return;
            for (const b of list) {
                if (b.type === 'input') inputs.push(b);
                if (b.body) traverse(b.body);
                if (b.then_body) traverse(b.then_body);
                if (b.else_body) traverse(b.else_body);
            }
        };
        traverse(blocks);
        return inputs;
    }

    if (btnClearTerminal) {
        btnClearTerminal.addEventListener('click', () => {
            if (!consoleOutput) return;
            consoleOutput.innerHTML = `
                <div class="terminal-line text-muted">Personalized Visual Programming Assistant Sandbox v2.0</div>
                <div class="terminal-line text-muted">Ready. Click '⚡ Run Logic' above or interact with inputs below.</div>
            `;
            if (terminalInputContainer) terminalInputContainer.style.display = 'none';
            pendingExecution = null;
            setTerminalStatus('idle');
        });
    }

    if (btnRunCode) {
        btnRunCode.addEventListener('click', () => {
            startInteractiveExecution();
        });
    }

    function startInteractiveExecution() {
        appendTerminalLine(`$ python3 main.py`, 'text-cmd');

        // Check if there are input blocks
        const inputBlocks = findInputBlocks(state.blocks);

        if (inputBlocks.length === 0) {
            // No inputs required, execute immediately
            setTerminalStatus('running');
            executeSandbox([]);
        } else {
            // Interactive in-terminal input! No window.prompt()!
            setTerminalStatus('waiting');
            pendingExecution = {
                inputBlocks: inputBlocks,
                currentIndex: 0,
                collectedInputs: []
            };

            const firstBlock = inputBlocks[0];
            const promptText = firstBlock.prompt ? firstBlock.prompt.trim() : `Enter ${firstBlock.var_name || 'value'}:`;
            appendTerminalLine(`👉 ${promptText}`, 'text-prompt');

            if (terminalInputContainer && terminalInput) {
                terminalInputContainer.style.display = 'flex';
                terminalInput.value = '';
                terminalInput.placeholder = `Input for ${firstBlock.var_name || 'value'} (${firstBlock.var_type || 'int'})...`;
                terminalInput.focus();
            }
        }
    }

    function handleTerminalInputSubmit() {
        const val = terminalInput ? terminalInput.value.trim() : '';

        if (!pendingExecution) {
            // User typed directly into terminal input field
            if (!val) return;
            appendTerminalLine(`$ python3 main.py`, 'text-cmd');
            appendTerminalLine(`❯ ${val}`, 'text-user');
            if (terminalInput) terminalInput.value = '';
            setTerminalStatus('running');
            executeSandbox([val]);
            return;
        }

        if (val === '') {
            window.showAppToast?.("Please enter a value into the terminal.", "warning");
            if (terminalInput) terminalInput.focus();
            return;
        }

        // Echo the user's input line into the terminal transcript
        appendTerminalLine(`❯ ${val}`, 'text-user');
        const tokens = val.split(/[,\s]+/).filter(t => t.length > 0);
        if (tokens.length > 1) {
            tokens.forEach(t => pendingExecution.collectedInputs.push(t));
        } else {
            pendingExecution.collectedInputs.push(val);
        }
        pendingExecution.currentIndex++;

        if (pendingExecution.currentIndex < pendingExecution.inputBlocks.length) {
            // More inputs required!
            const nextBlock = pendingExecution.inputBlocks[pendingExecution.currentIndex];
            const nextPrompt = nextBlock.prompt ? nextBlock.prompt.trim() : `Enter ${nextBlock.var_name || 'value'}:`;
            appendTerminalLine(`👉 ${nextPrompt}`, 'text-prompt');
            if (terminalInput) {
                terminalInput.value = '';
                terminalInput.placeholder = `Input for ${nextBlock.var_name || 'value'} (${nextBlock.var_type || 'int'})...`;
                terminalInput.focus();
            }
        } else {
            // All inputs gathered interactively! Run now!
            if (terminalInputContainer) terminalInputContainer.style.display = 'none';
            if (terminalInput) terminalInput.value = '';
            setTerminalStatus('running');
            executeSandbox(pendingExecution.collectedInputs);
            pendingExecution = null;
        }
    }

    if (btnTerminalSubmit) {
        btnTerminalSubmit.addEventListener('click', handleTerminalInputSubmit);
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleTerminalInputSubmit();
            }
        });
    }

    async function executeSandbox(inputs) {
        if (!transpiledResults || !transpiledResults.python) {
            updateTranspiledCode();
        }
        const pyCode = transpiledResults.python || "";

        try {
            const response = await fetch('/api/run-python', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: pyCode,
                    inputs: inputs
                })
            });

            const data = await response.json();
            if (data.success) {
                const lines = data.output.split('\n');
                lines.forEach(l => {
                    if (l) appendTerminalLine(l, 'text-output');
                });
                appendTerminalLine('✔ [Program executed with exit code 0]', 'text-success');
                window.showAppToast?.("Execution finished successfully!", "success");
            } else {
                appendTerminalLine(data.output, 'text-error');
                appendTerminalLine('✖ [Runtime error occurred]', 'text-error');
            }
        } catch (err) {
            appendTerminalLine(`Execution failed: ${err.message}`, 'text-error');
        } finally {
            setTerminalStatus('idle');
        }
    }

    // ==========================================
    // 7. COPY, DOWNLOAD & SAVE
    // ==========================================
    if (btnCopyCode) {
        btnCopyCode.addEventListener('click', () => {
            const currentCode = codeViewer.textContent;
            navigator.clipboard.writeText(currentCode).then(() => {
                window.showAppToast?.(`Copied ${state.currentTab.toUpperCase()} code to clipboard!`, 'success');
            }).catch(() => {
                window.showAppToast?.("Failed to copy code.", 'danger');
            });
        });
    }

    if (btnDownloadCode) {
        btnDownloadCode.addEventListener('click', () => {
            const ext = state.currentTab === 'python' ? 'py' : 
                        (state.currentTab === 'c' ? 'c' : 
                        (state.currentTab === 'java' ? 'java' : 'txt'));
            const filename = `${state.title.toLowerCase().replace(/\s+/g, '_')}.${ext}`;
            const blob = new Blob([codeViewer.textContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            window.showAppToast?.(`Downloaded ${filename}!`, 'success');
        });
    }

    if (btnSaveProgram) {
        btnSaveProgram.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/programs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: state.activeProgramId,
                        title: state.title,
                        description: `Saved from Visual Assistant: ${state.blocks.length} blocks`,
                        blocks: state.blocks
                    })
                });

                const data = await response.json();
                if (data.success) {
                    state.activeProgramId = data.id;
                    window.showAppToast?.(data.message, 'success');
                }
            } catch (err) {
                window.showAppToast?.("Error saving program to library.", 'danger');
            }
        });
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Initial render
    renderCanvas();
});
