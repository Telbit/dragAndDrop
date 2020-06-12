function getImages(callback) {
    fetch('/get_images')
        .then((response) => response.json())
        .then((data) => callback(data))
}

function loadCards(data) {

    var elementBox = ``;
    var index = 1;
    let mainImage = `<img src="${data[0]['path']}" alt="design">`;

    for (let i = 0; i < Math.ceil(data.length / 3); i++) {
        elementBox += `
            <div class="row">
        `;

        for (let j = 0; j < 3; j++) {
            if (data[index]){
                elementBox += `
                    <div class="col">
                        <div class="element">
                            <div class="image-box">
                                <img src="${data[index]['path']}" alt="design">
                            </div>
                            <div class="text-box">
                                <p>${data[index]['title']}</p>
                            </div>
                            <div class="text-button">
                                <button onclick="window.open('${data[index]['full_image_path']}', '_blank')">More</button>
                            </div>
                        </div>
                    </div>
                `;

                index += 1;
            } else {
                elementBox += `
                    <div class="col">
                    </div>
                `;
            }
        }
        elementBox += `
            </div>
        `;
    }

    document.getElementById("main-image-box").innerHTML = mainImage;
    document.getElementById("container").insertAdjacentHTML('beforeend', elementBox);

}

getImages(loadCards);