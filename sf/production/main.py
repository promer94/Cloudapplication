from flask import Flask, render_template, jsonify, request
import flask_cors
import google.auth.transport.requests
import google.oauth2.id_token
import requests_toolbelt.adapters.appengine


app = Flask(__name__)
flask_cors.CORS(app)


@app.route('/')
def index():
    return render_template('home.html')

@app.route('/main')
def login():
    return render_template('main.html')

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)