from flask import Flask, flash, render_template, jsonify, request, redirect, url_for, session
from flask_oauth import OAuth
from functools import wraps
import simplejson as json
from pymongo import MongoClient

# You must configure these 3 values from Google APIs console
# https://code.google.com/apis/console
GOOGLE_CLIENT_ID = '119855237642-p3ckimhcgmb2ljnigcegvrh1v43eb1ba.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = 'eVGXh0tufuuqgY5YK0zz0Sck'
# one of the Redirect URIs from Google APIs console
REDIRECT_URI = '/oauth2callback'
SECRET_KEY = 'development key'

client = MongoClient('mongodb://user:Sanbao941104@socialfamily-shard-00-00-03pay.mongodb.net:27017,socialfamily-shard-00-01-03pay.mongodb.net:27017,socialfamily-shard-00-02-03pay.mongodb.net:27017/test?ssl=true&replicaSet=SocialFamily-shard-0&authSource=admin')
db = client.SocialFamily
collection = db.user


app = Flask(__name__)
app.secret_key = SECRET_KEY
oauth = OAuth()


google = oauth.remote_app('google',
                          base_url='https://www.google.com/accounts/',
                          authorize_url='https://accounts.google.com/o/oauth2/auth',
                          request_token_url=None,
                          request_token_params={'scope': 'https://www.googleapis.com/auth/userinfo.email',
                                                'response_type': 'code'},
                          access_token_url='https://accounts.google.com/o/oauth2/token',
                          access_token_method='POST',
                          access_token_params={
                              'grant_type': 'authorization_code'},
                          consumer_key=GOOGLE_CLIENT_ID,
                          consumer_secret=GOOGLE_CLIENT_SECRET)


@app.route('/')
def index():
    return loginWithgoogle()


@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/login')
def login():
    callback = url_for('authorized', _external=True)
    return google.authorize(callback=callback)


def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('Unauthorized, Please login', 'danger')
            return redirect(url_for('home'))
    return wrap


@app.route('/register')
@is_logged_in
def register():
    flash('Hello New Friend!', 'success')
    return render_template('dashborad.html')


@app.route('/dashborad')
@is_logged_in
def dashborad():
    flash('You are now logged in', 'success')
    return render_template('dashborad.html')


@app.route('/logout')
@is_logged_in
def logout():
    session.clear()
    flash('You are now logged out', 'success')
    return redirect(url_for('index'))


@app.route('/about')
def about():
    return render_template('about.html')


@app.route(REDIRECT_URI)
@google.authorized_handler
def authorized(resp):
    access_token = resp['access_token']
    session['access_token'] = access_token, ''
    return redirect(url_for('index'))


@google.tokengetter
def get_access_token():
    return session.get('access_token')


def loginWithgoogle():
    access_token = session.get('access_token')
    if access_token is None:
        return redirect(url_for('home'))

    access_token = access_token[0]
    from urllib2 import Request, urlopen, URLError

    headers = {'Authorization': 'OAuth ' + access_token}
    req = Request('https://www.googleapis.com/oauth2/v1/userinfo',
                  None, headers)
    try:
        res = urlopen(req)
    except URLError, e:
        if e.code == 401:
            # Unauthorized - bad token
            session.pop('access_token', None)
            return redirect(url_for('login'))
        return res.read()

    session['logged_in'] = True
    user_dict = json.loads(res.read().decode("utf-8"))

    session['user_id'] = user_dict['id']
    session['user_email'] = user_dict['email']
    session['user_name'] = user_dict['name']
    session['user_picture'] = user_dict['picture']

    new_user = {'googleId': user_dict['id'],
                'email': user_dict['email'],
                'picture_link': user_dict['picture']
                }
    if(collection.find({'googleId': user_dict['id']}).count() == 0):
        collection.insert_one(new_user)
        return redirect(url_for('register'))
    else:
        return redirect(url_for('dashborad'))


if __name__ == '__main__':
    app.run(debug=True)
