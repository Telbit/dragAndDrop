from flask import Flask, render_template, url_for, request, make_response
from util import json_response
import data_handler

app = Flask(__name__)


@app.route('/')
def drag_n_drop():
    return render_template('index.html')  # render_template('drag_drop.html')


@app.route('/get_images')
@json_response
def get_images():
    return data_handler.get_images()


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    target = "static/images/"
    files = request.files
    for file in files:
        image = files[file]
        image_name = image.filename
        path = target + image_name
        data_handler.new_image(path)
        image.save(path)
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


if __name__ == '__main__':
    app.run(
        debug='true',
        port=5000,
        host='0.0.0.0'
    )
