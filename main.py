from flask import Flask, render_template, url_for, request, make_response
from util import json_response
import data_handler
from PIL import Image

app = Flask(__name__)


@app.route('/')
def main_page():
    return render_template('index.html')


@app.route('/drag_n_drop')
def drag_n_drop():
    return render_template('drag_drop.html')


@app.route('/get_images')
@json_response
def get_images():
    return data_handler.get_images()


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    small_image_target = "static/images/"
    full_image_target = "static/full_images/"
    files = request.files
    for file in files:
        full_image = files[file]
        image_name = full_image.filename

        small_image_path = small_image_target + image_name
        full_image_path = full_image_target + image_name

        data_handler.new_image(small_image_path, full_image_path)

        full_image.save(full_image_path)

        small_image = Image.open(full_image_path)
        width, height = small_image.size
        small_image = small_image.resize((600, int(height * (600 / width))), Image.ANTIALIAS)
        small_image.save(small_image_path, optimize=True, quality=90)

    res = make_response('ok', 200)
    return res


@app.route('/order-update', methods=['GET', 'POST'])
def order_update():
    image_id = int(request.form['id'])
    order_id = int(request.form['order_id'])
    new_order_id = int(request.form['position'])
    data_handler.order_update(order_id, new_order_id)
    data_handler.change_order_id_by_id(image_id, new_order_id)

    res = make_response('ok', 200)
    return res


@app.route('/save', methods=["GET", "POST"])
def save_card():
    title = request.form['title']
    image_id = request.form['id']
    print(title)
    print(image_id)
    data_handler.update_title(image_id, title)
    res = make_response('ok', 200)
    return res


@app.route('/delete/<image_id>')
def delete_card(image_id):
    data_handler.delete_image(image_id)
    res = make_response('ok', 200)
    return res


if __name__ == '__main__':
    app.run(
        debug='true',
        port=5000,
        host='0.0.0.0'
    )
