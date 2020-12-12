let dropzone = document.getElementById('dropzone');
let nodes = document.getElementsByClassName('node');
let selectedNode = '';
let selectedNodePos;
let startPosition;
// let imagesData;


function init(data) {

    loadCards(data);

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener("mousedown", (event) => {
                // document.getElementById(event.currentTarget.id).style.backgroundColor = 'tomato';
            event.currentTarget.style.backgroundColor = 'tomato';
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

        const url = "/order-update";
        const formData = new FormData();
        formData.append("position", selectedNodePos);
        formData.append("order_id", selectedNode.getAttribute('data-order-id'));
        formData.append("id", selectedNode.getAttribute('data-image-id'));

        for (let i = 0; i < dropzone.children.length; i++) {
            dropzone.children[i].setAttribute('data-order-id', i);
            dropzone.children[i].querySelector('.idParagr').innerText = i;
        }

        fetch(url, {
            method: "post",
            body: formData
        }).catch(console.error);

        setTimeout(() => {
            selectedNode.style.backgroundColor = 'cornsilk';
            selectedNode.style.transition = '0.5s';
        }, 200);
    });

    let saveButtons = document.querySelectorAll('.save')
    for (let button of saveButtons) {
        button.addEventListener('click', saveCard);
    }

    let deleteButtons = document.querySelectorAll('.delete')
    for (let button of deleteButtons) {
        button.addEventListener('click', deleteCard);
    }

    initModal();
}

function saveCard(event) {
    console.log(event.target);
    console.log('save');
    let title = event.target.closest('.node').querySelector('.title_input').value;
    let image_id = event.target.closest('.node').getAttribute('data-image-id');
    console.log(title);

    let url = '/save';
    const formData = new FormData();
    formData.append('title', title)
    formData.append('id', image_id);


    fetch(url, {
       method:'post',
       body: formData
    }).catch(console.error);

}

function deleteCard(event) {
    console.log(event.target);
    console.log('delete');

    let image_id = event.target.parentNode.parentNode.getAttribute('data-image-id');

    fetch(`/delete/${image_id}`)
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
            //beforeX = nodes[i]['xPos'];
            var newPos = i;
        }
    }

    if (newPos !== selectedNodePos){
        selectedNodePos = newPos;
        setTimeout(() => {
            dropzone.removeChild(selectedNode);
            dropzone.insertBefore(selectedNode, dropzone.children[selectedNodePos]);
        },0)
        // console.log(selectedNodePos);
    }
}

function loadCards(imagesData) {

    // console.log(imagesData);
    let cards = ``;

    for (let image of imagesData) {
        cards +=`<div id="record-id-${image['order_id']}" 
                data-image-id="${image['id']}" data-order-id="${image['order_id']}" class="node" draggable="true">
                    <div class="image">
                        <p class="idParagr">${image['order_id']}</p>
                        <button class="save">save</button>
                        <button class="delete">delete</button>
                        <img src="${image['path']}" alt="image" draggable="false">
                    </div>
                    <div class="footer">
                        <form action="#">
                            <textarea name="title_input" class="title_input" rows="5">${image['title']}</textarea>
                        </form>
                    </div>
                </div>`;
    }
    dropzone.innerHTML = cards;
}

function getImages(callback) {
    fetch('/get_images')
        .then((response) => response.json())
        .then((data) => callback(data))
}

function initModal() {
    let modalButton = document.getElementById('modal-button');
    modalButton.addEventListener('click', event => {

        let modalBox = (`<div id="modal">
                            <div id="modal-content">
                                <div id="upload-btn-div">
                                        <input type="file" id="inpFile" name="inpFile" multiple accept="image/*">
                                </div>
                                <div id="modal-btn-div">
                                    <button class="modal-btn" type="button" id="uploadButton">Upload</button>
                                    <button class="modal-btn" type="button" id="close-button">close</button>
                                </div>
                            </div>
                        </div>`);

        document.body.insertAdjacentHTML('beforeend', modalBox);

        const uploadButton = document.getElementById("uploadButton");
        const inpFile = document.getElementById("inpFile");
        const closeButton = document.getElementById("close-button");

        uploadButton.addEventListener("click", event => {
            event.preventDefault();

            const url = "/upload";
            const formData = new FormData();

            for (let file of inpFile.files) {
                formData.append(`${file.name}`, file);
            }

            fetch(url, {
                method: "post",
                mode: "no-cors",
                body: formData
            }).catch(console.error);

            removeModalBox();
        });

        closeButton.addEventListener('click', event => {
            removeModalBox();
        });
    });
}

function removeModalBox() {
    let modal = document.getElementById('modal');
    modal.remove();
}

// init();
getImages(init);