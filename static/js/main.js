let dropzone = document.getElementById('dropzone');
let nodes = document.getElementsByClassName('node');
let selectedNode = '';
let selectedNodePos = 0;
let startPosition;


function init() {

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener("mousedown", (event) => {
            document.getElementById(event.target.id).style.backgroundColor = 'tomato';
        });

        nodes[i].addEventListener("dragstart", (event) => {
            event.dataTransfer.setData('text', event.target.id);

            establishNodePosition()

            selectedNode = document.getElementById(event.target.id);
            startPosition = getStartPosition();

            setTimeout(() => {
                dropzone.removeChild(selectedNode);
            }, 0)
        });

        nodes[i].addEventListener("dragend", (event) =>{
            if (selectedNode !== dropzone.children[selectedNodePos]) {
                dropzone.insertBefore(selectedNode, dropzone.children[startPosition]);
            }
            resetNodes();
            setTimeout(() => {
                selectedNode.style.backgroundColor = 'cornsilk';
                selectedNode.style.transition = '2s';
            }, 200);
        });
    }

    dropzone.addEventListener("dragover", (event) => {
        event.preventDefault();
        whereAmI(event.clientY);
    });

    dropzone.addEventListener("drop", (event) => {
        event.preventDefault();

        dropzone.insertBefore(selectedNode, dropzone.children[selectedNodePos]);

        resetNodes();

        setTimeout(() => {
            selectedNode.style.backgroundColor = 'cornsilk';
            selectedNode.style.transition = '2s';
        }, 200);
    });
}

// get all elements vertical position
function establishNodePosition() {
    for (let i = 0; i < nodes.length; i++) {
        let element = document.getElementById(nodes[i]['id']);
        let position = element.getBoundingClientRect();
        let yTop = position.top;
        let yBottom = position.bottom;
        nodes[i]['yPos'] = yTop + ((yBottom-yTop)/2);
    }
}

function resetNodes() {
    for (let i = 0; i < nodes.length; i++) {
        document.getElementById(nodes[i]['id']).style.marginTop = '0.5em';
    }
}

function whereAmI(currentYPos) {
    establishNodePosition()

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i]['yPos'] < currentYPos) {
            var nodeAbove = document.getElementById(nodes[i]['id']);
            selectedNodePos = i + 1;
        } else {
            if (!nodeBelow) {
                var nodeBelow = document.getElementById(nodes[i]['id']);
            }
        }
    }
    if (typeof nodeAbove == "undefined") {
        selectedNodePos = 0;
    }

    resetNodes();

    if (typeof nodeBelow == 'object') {
        nodeBelow.style.marginTop = '3em';
        nodeBelow.style.transition = '1.8s';
    }
}

function getStartPosition() {
    for (let nodePos = 0; nodePos < nodes.length; nodePos++) {
        if (nodes[nodePos] === selectedNode) {
            return nodePos;
        }
    }
}

init();