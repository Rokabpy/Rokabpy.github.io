function getCurrMol() {
    return getChemViewer().getChemObj();
}
function getChemViewer() {
    return Kekule.Widget.getWidgetById('chemViewer');
}
function getCodeViewer() {
    return Kekule.Widget.getWidgetById('codeViewer');
}
function showCode(code) {
    getCodeViewer().setValue(code);
}
function getFuncCode(func) {
    return func.toString();
}
function runOperation(funcName) {
    var func = window[funcName];  // <-- เปลี่ยนจาก this[...] เป็น window[...]
    if (typeof func === 'function') {
        func();
        showCode(func.toString());
    }
}

// โหลดไฟล์เข้ามา
function loadFromFile() {
    // get local file object
    var file = document.getElementById('inputFile').files[0];
    if (file) {
        // load file and parse to chem object
        Kekule.IO.loadFileData(file, function (chemObj, success) {
            // load chem object into chem viewer
            if (success && chemObj)
                getChemViewer().setChemObj(chemObj);
        });
    }
}

// ดึงข้อมูลที่แสดงใน Chem Viewer แล้วแปลงเป็นข้อความ CML
function dumpObject() {
    // Get current object in viewer
    var obj = getChemViewer().getChemObj();
    // Save the object into CML
    var cmlData = Kekule.IO.saveFormatData(obj, 'cml');
    // Show object data
    var msg = 'Object type: ' + obj.getClassName() + '\n';
    msg += cmlData;
    console.log(msg);
    alert(msg);
}

// แสดงหน้า Edit แบบเต็มตัว
function editObject() {
    var chemViewer = getChemViewer();
    // Can only edit in 2D mode
    if (chemViewer.getRenderType() !== Kekule.Render.RendererType.R2D)
        alert('Now only support editing of 2D objects')
    else {
        chemViewer.setEnableEdit(true);
        chemViewer.openEditor();
    }
}

// เปลี่ยน 2มิติ, 3มิติ
function changeRenderType() {
    var chemViewer = getChemViewer();
    var newType = document.getElementById('selectRenderType').value;
    if (newType === '3D')
        chemViewer.setRenderType(Kekule.Render.RendererType.R3D);
    else
        chemViewer.setRenderType(Kekule.Render.RendererType.R2D);
}

// อัตราการซูม
function zoomToRatio() {
    var ratio = document.getElementById('selectZoomRatio').value;
    getChemViewer().setZoom(ratio);
}

// โครงสร้าง Skeletal, condensed
function changeMol2DDisplayType() {
    var disType = document.getElementById('selectMol2DDisplayType').value;
    getChemViewer().setMoleculeDisplayType(Kekule.Render.Molecule2DDisplayType[disType.toUpperCase()]);
}

// โครงสร้างใน 3 มิติ
function changeMol3DDisplayType() {
    var disType = document.getElementById('selectMol3DDisplayType').value;
    getChemViewer().setMoleculeDisplayType(Kekule.Render.Molecule3DDisplayType[disType.toUpperCase()]);
}

// ซูมเต็มหน้าจออัตโนมัติ
function changeAutofit() {
    var autofit = document.getElementById('checkBoxAutofit').checked;
    getChemViewer().setAutofit(autofit);
}

// เปลี่ยนสีวาดเส้น 2มิติ, เปลี่ยนสีข้อความ, สี atom specified color
function changeRenderColor() {
    var chemViewer = getChemViewer();
    var atomColor = Kekule.Widget.getWidgetById('selectAtomColor').getValue() || null;
    var bondColor = Kekule.Widget.getWidgetById('selectBondColor').getValue() || null;
    var useAtomSpecifiedColor = document.getElementById('checkBoxSpecifiedColor').checked;

    if (chemViewer.getRenderType() === Kekule.Render.RendererType.R3D) // 3D viewer
    {
        var configs = chemViewer.getRenderConfigs().getMoleculeDisplayConfigs();
        configs.setUseAtomSpecifiedColor(useAtomSpecifiedColor);
        configs.setDefAtomColor(atomColor || '#000099');
        configs.setDefBondColor(bondColor || '#FFFFFF');
    }
    else  // 2D viewer
    {
        var configs = chemViewer.getRenderConfigs().getColorConfigs();
        configs.setUseAtomSpecifiedColor(useAtomSpecifiedColor);
        configs.setAtomColor(atomColor || '#000000');
        configs.setBondColor(bondColor || '#000000');
    }
    chemViewer.repaint();
}

// เปิด Direct Interaction เปิดทำไมก็ไม่รู้
function changeDirectInteraction() {
    var enabled = document.getElementById('checkBoxDirectInteraction').checked;
    getChemViewer().setEnableDirectInteraction(enabled);
}

// กดปุ่มเพื่อหมุน
function rotate2D() {
    var delta = 5 * Math.PI / 180;
    getChemViewer().rotate2DBy(delta);
}

// กดปุ่มเพื่อหมุน
function rotateX() {
    var delta = 5 * Math.PI / 180;
    getChemViewer().rotate3DBy(delta, 0, 0);
}

// กดปุ่มเพื่อหมุน
function rotateY() {
    var delta = 5 * Math.PI / 180;
    getChemViewer().rotate3DBy(0, delta, 0);
}

// กดปุ่มเพื่อหมุน
function rotateZ() {
    var delta = 5 * Math.PI / 180;
    getChemViewer().rotate3DBy(0, 0, delta);
}

function changeEnableToolbar() {
    var enabled = document.getElementById('checkBoxEnableToolbar').checked;
    getChemViewer().setEnableToolbar(enabled);
}

// โชว์ Toolbar ตลอด, คลิ๊ก, แตะแล้วขึ้น
function changeToolbarEvokeMode() {
    var chemViewer = getChemViewer();
    var mode = document.getElementById('selectToolbarEvokeMode').value;
    if (mode === 'always') {
        chemViewer.setToolbarEvokeModes([Kekule.Widget.EvokeMode.ALWAYS]);
        chemViewer.setToolbarRevokeModes([]);
    }
    else if (mode === 'click') {
        chemViewer.setToolbarEvokeModes([Kekule.Widget.EvokeMode.EVOKEE_CLICK]);
        chemViewer.setToolbarRevokeModes([Kekule.Widget.EvokeMode.EVOKEE_MOUSE_LEAVE]);
    }
    else if (mode === 'mouseenter') {
        chemViewer.setToolbarEvokeModes([Kekule.Widget.EvokeMode.EVOKEE_MOUSE_ENTER]);
        chemViewer.setToolbarRevokeModes([Kekule.Widget.EvokeMode.EVOKEE_MOUSE_LEAVE]);
    }
}

// ตำแหน่ง Toolbar
function changeToolbarPos() {
    var chemViewer = getChemViewer();
    var pos = document.getElementById('selectToolbarPos').value;
    var posValue;
    switch (pos) {
        case 'left': posValue = Kekule.Widget.Position.LEFT; break;
        case 'right': posValue = Kekule.Widget.Position.RIGHT; break;
        case 'top': posValue = Kekule.Widget.Position.TOP; break;
        case 'bottom': posValue = Kekule.Widget.Position.BOTTOM; break;
        case 'top-left': posValue = Kekule.Widget.Position.TOP_LEFT; break;
        case 'top-right': posValue = Kekule.Widget.Position.TOP_RIGHT; break;
        case 'bottom-left': posValue = Kekule.Widget.Position.BOTTOM_LEFT; break;
        case 'bottom-right': posValue = Kekule.Widget.Position.BOTTOM_RIGHT; break;
        default: posValue = Kekule.Widget.Position.AUTO;
    }
    chemViewer.setToolbarPos(posValue);
}

var toolBtns = [
    'loadData', 'saveData', 'clearObjs', 'molDisplayType', 'zoomIn', 'zoomOut',
    'rotateLeft', 'rotateRight', 'rotateX', 'rotateY', 'rotateZ',
    'reset', 'molHideHydrogens', 'openEditor', 'config', 'custom'
];
var toolBtnSetCheckBoxes = [];

// save การตั้งค่า
function changeToolButtons() {
    var btns = [];
    // gather buttons
    for (var i = 0, l = toolBtnSetCheckBoxes.length; i < l; ++i) {
        var checkBox = toolBtnSetCheckBoxes[i];
        if (checkBox.getChecked())
            btns.push(checkBox._value || checkBox.getValue());
    }
    // set tool buttons of chem viewer
    getChemViewer().setToolButtons(btns);
}

function initToolButtonSetter() {
    var chemViewer = getChemViewer();
    var btns = toolBtns;
    var currBtns = chemViewer.getToolButtons() || chemViewer.getDefaultToolBarButtons();
    var parentElem = document.getElementById('panelToolButtons');
    for (var i = 0, l = btns.length; i < l; ++i) {
        var btnName = btns[i];
        // create check box widget
        var checkBox = new Kekule.Widget.CheckBox(document);
        checkBox.addClassName('ToolButtonSetter');
        checkBox.setText(btnName);
        checkBox.setValue(btnName);
        if (btnName === 'custom')  // custom button
            checkBox._value = { 'text': 'Custom', 'htmlClass': 'K-Res-Button-YesOk', 'showText': true, '#execute': function () { alert('Custom button'); } };
        else  // default button
            checkBox._value = btnName;
        if (currBtns.indexOf(btnName) >= 0)
            checkBox.setChecked(true);
        checkBox.appendToElem(parentElem);
        toolBtnSetCheckBoxes.push(checkBox);
    }
}

// กำหนดแถบเมนูใน Work Space
function changePredefinedSetting() {
    var chemViewer = getChemViewer();
    var preset = document.getElementById('selectPreset').value;
    chemViewer.setPredefinedSetting(preset);
}

function init() {
    document.getElementById('inputFile').addEventListener('change', function () {
        runOperation('loadFromFile');
    });
    document.getElementById('selectRenderType').addEventListener('change', function () {
        runOperation('changeRenderType');
    });
    document.getElementById('checkBoxAutofit').addEventListener('change', function () {
        runOperation('changeAutofit');
    });
    document.getElementById('checkBoxSpecifiedColor').addEventListener('change', function () {
        runOperation('changeRenderColor');
    });
    document.getElementById('checkBoxDirectInteraction').addEventListener('change', function () {
        runOperation('changeDirectInteraction');
    });
    document.getElementById('checkBoxDirectInteraction').checked = getChemViewer().getEnableDirectInteraction();
    document.getElementById('checkBoxEnableToolbar').addEventListener('change', function () {
        runOperation('changeEnableToolbar');
    });
    document.getElementById('checkBoxEnableToolbar').checked = getChemViewer().getEnableToolbar();

    var zoomRatios = Kekule.ZoomUtils.PREDEFINED_ZOOM_RATIOS;
    var zoomItems = [];
    for (var i = 0, l = zoomRatios.length; i < l; ++i) {
        var zoom = zoomRatios[i];
        zoomItems.push({ 'text': Math.round(zoom * 100) + '%', 'value': zoom });
    }
    Kekule.Widget.getWidgetById('selectZoomRatio')
        .setItems(zoomItems).setValue(getChemViewer().getZoom() || 1)
        .on('valueChange', function () {
            runOperation('zoomToRatio');
        });

    var mol2DDisplayTypes = ['skeletal', 'condensed'];
    var mol3DDisplayTypes = ['wire', 'sticks', 'ball_stick', 'space_fill'];
    var disTypeItems = [];
    for (var i = 0, l = mol2DDisplayTypes.length; i < l; ++i) {
        disTypeItems.push({ 'value': mol2DDisplayTypes[i] });
    }
    Kekule.Widget.getWidgetById('selectMol2DDisplayType')
        .setItems(disTypeItems)
        .on('valueChange', function () {
            runOperation('changeMol2DDisplayType');
        });
    var disTypeItems = [];
    for (var i = 0, l = mol3DDisplayTypes.length; i < l; ++i) {
        disTypeItems.push({ 'value': mol3DDisplayTypes[i] });
    }
    Kekule.Widget.getWidgetById('selectMol3DDisplayType')
        .setItems(disTypeItems)
        .on('valueChange', function () {
            runOperation('changeMol3DDisplayType');
        });

    Kekule.Widget.getWidgetById('selectBondColor').on('valueChange', function () {
        runOperation('changeRenderColor');
    });
    Kekule.Widget.getWidgetById('selectAtomColor').on('valueChange', function () {
        runOperation('changeRenderColor');
    });

    Kekule.Widget.getWidgetById('btnRotate2D').on('execute', function () {
        runOperation('rotate2D');
    });
    Kekule.Widget.getWidgetById('btnRotateX').on('execute', function () {
        runOperation('rotateX');
    });
    Kekule.Widget.getWidgetById('btnRotateY').on('execute', function () {
        runOperation('rotateY');
    });
    Kekule.Widget.getWidgetById('btnRotateZ').on('execute', function () {
        runOperation('rotateZ');
    });

    var evokeModes = ['always', 'click', 'mouseenter'];
    var evokeItems = [];
    for (var i = 0, l = evokeModes.length; i < l; ++i)
        evokeItems.push({ 'value': evokeModes[i] });
    Kekule.Widget.getWidgetById('selectToolbarEvokeMode')
        .setItems(evokeItems).setValue('mouseenter')
        .on('valueChange', function () {
            runOperation('changeToolbarEvokeMode');
        });
    changeToolbarEvokeMode();

    // ในส่วน init() หรือจุดที่คุณตั้งค่า selectToolbarPos
    var toolbarPoses = ['top', 'left', 'right', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
    var toolbarPosItems = [];
    for (var i = 0, l = toolbarPoses.length; i < l; ++i)
        toolbarPosItems.push({ 'value': toolbarPoses[i] });
    Kekule.Widget.getWidgetById('selectToolbarPos')
        .setItems(toolbarPosItems).setValue('bottom-right')
        .on('valueChange', function () {
            runOperation('changeToolbarPos');
        });
    changeToolbarPos();

    initToolButtonSetter();
    Kekule.Widget.getWidgetById('btnSetToolButtons').on('execute', function () {
        runOperation('changeToolButtons');
    });

    var presets = ['', 'fullFunc', 'basic', 'static', 'editOnly'];
    var presetItems = [];
    for (var i = 0, l = presets.length; i < l; ++i) {
        presetItems.push({ 'value': presets[i] });
    }
    Kekule.Widget.getWidgetById('selectPreset')
        .setItems(presetItems).setValue('')
        .on('valueChange', function () {
            runOperation('changePredefinedSetting');
        });
}
Kekule.X.domReady(init);