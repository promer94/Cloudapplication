from flask import Flask, render_template,request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/')
def data():
 # here we want to get the value of user (i.e.?user=some-value)
 info = request.data()
 return info


if __name__ == '__main__':
    app.run(debug=True)

x=data()
print(x)