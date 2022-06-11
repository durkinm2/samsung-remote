import time
import requests
import requests_cache
import samsungctl
import time

config = {
    "name": "samsungctl",
    "description": "PC",
    "id": "",
    "host": "192.168.0.10",
    "port": 55000,
    "method": "legacy",
    "timeout": 0,
}

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# requests_cache.install_cache('github_cache', backend='sqlite', expire_after=180)


@app.route('/', methods=['GET', 'POST'])
def home():
    # with samsungctl.Remote(config) as remote:
    #     for i in range(10):
    #         remote.control("KEY_MENU")
    #         time.sleep(0.5)
    #
    if request.method == 'POST':
        # user inputs
        first = request.form.get('first')
        second = request.form.get('second')
        # api call
        url = "https://api.github.com/search/users?q=location:{0}+language:{1}".format(first, second)
        now = time.ctime(int(time.time()))
        response = requests.get(url)
        print("Time: {0} / Used Cache: {1}".format(now, response.from_cache))
        # return json
        return jsonify(response.json())
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
