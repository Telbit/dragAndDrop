let dropzone = document.getElementById('dropzone');
let nodes = document.getElementsByClassName('node');
let selectedNode = '';
let selectedNodePos;
let startPosition;


function init() {

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener("mousedown", (event) => {
            document.getElementById(event.target.id).style.backgroundColor = 'tomato';
        });

        nodes[i].addEventListener("dragstart", (event) => {
            event.dataTransfer.setData('text', event.target.id);

            // set all elements position
            establishNodePosition()

            selectedNode = document.getElementById(event.target.id);

            // get selected node's place in the list
            startPosition = getStartPosition();
        });

        nodes[i].addEventListener("dragend", (event) =>{

            // drop the selected node to the start position if the drag ended without drop
            if (selectedNode !== dropzone.children[selectedNodePos]) {
                dropzone.insertBefore(selectedNode, dropzone.children[startPosition]);
            }

            setTimeout(() => {
                selectedNode.style.backgroundColor = 'cornsilk';
                selectedNode.style.transition = '0.5s';
            }, 200);
        });
    }

    dropzone.addEventListener("dragover", (event) => {
        event.preventDefault();

        // get the selected position's place in the nodes list
        getNode(event.clientX, event.clientY);
    });

    dropzone.addEventListener("drop", (event) => {
        event.preventDefault();

        setTimeout(() => {
            selectedNode.style.backgroundColor = 'cornsilk';
            selectedNode.style.transition = '0.5s';
        }, 200);
    });
}

// get all elements vertical position
function establishNodePosition() {
    for (let i = 0; i < nodes.length; i++) {
        let element = document.getElementById(nodes[i]['id']);
        let position = element.getBoundingClientRect();
        let yTop = position.top;
        // let yBottom = position.bottom;
        let xLeft = position.left;
        // let xRight = position.right;
        nodes[i]['yPos'] = yTop; //+ ((yBottom-yTop)/2);
        nodes[i]['xPos'] = xLeft; //+ ((xRight-xLeft)/2);
    }
}

function getStartPosition() {
    for (let nodePos = 0; nodePos < nodes.length; nodePos++) {
        if (nodes[nodePos] === selectedNode) {
            return nodePos;
        }
    }
}

function getNode(xPos, yPos) {

    establishNodePosition()
    let beforeY = nodes[0]['yPos'];
    let beforeX = 0;

    for (let i = 0; i < nodes.length; i++) {
        if (beforeY <= nodes[i]['yPos'] && nodes[i]['yPos'] < yPos){
            beforeY = nodes[i]['yPos'];
        }
    }

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i]['yPos'] === beforeY && nodes[i]['xPos'] < xPos){
            beforeX = nodes[i]['xPos'];
            var newPos = i;
        }
    }

    if (newPos !== selectedNodePos){
        selectedNodePos = newPos;
        setTimeout(() => {
            dropzone.removeChild(selectedNode);
            dropzone.insertBefore(selectedNode, dropzone.children[selectedNodePos]);
        },0)
        console.log(selectedNodePos);
    }
}

init();