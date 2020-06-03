from flask import Flask, render_template, url_for

app = Flask(__name__)


@app.route('/')
def drag_n_drop():
    return render_template('drag_drop.html')


if __name__ == '__main__':
    app.run(
        debug='true',
        port=5000,
        host='0.0.0.0'
    )
