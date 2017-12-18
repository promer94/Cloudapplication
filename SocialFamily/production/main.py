import os
from flask import Flask, flash, render_template, jsonify, request, redirect, url_for, session
from flask_oauth import OAuth
from functools import wraps
import simplejson as json
from pymongo import MongoClient
from twilio.rest import Client
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import (
    SyncGrant,
    VideoGrant,
    IpMessagingGrant
)
from dotenv import load_dotenv, find_dotenv
from os.path import join, dirname
from inflection import underscore


dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)


#Set up Google SignIn 
GOOGLE_CLIENT_ID = '119855237642-p3ckimhcgmb2ljnigcegvrh1v43eb1ba.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = 'eVGXh0tufuuqgY5YK0zz0Sck'
REDIRECT_URI = '/oauth2callback'
SECRET_KEY = 'development key'

#Set up MongoDB
client = MongoClient('mongodb://user:Sanbao941104@socialfamily-shard-00-00-03pay.mongodb.net:27017,socialfamily-shard-00-01-03pay.mongodb.net:27017,socialfamily-shard-00-02-03pay.mongodb.net:27017/test?ssl=true&replicaSet=SocialFamily-shard-0&authSource=admin')
db = client.SocialFamily
collection = db.user

#Set up Twilio API
TWILIO_ACCOUNT_SID=os.environ['TWILIO_ACCOUNT_SID'],
TWILIO_API_KEY=os.environ['TWILIO_API_KEY'],
TWILIO_API_SECRET=(os.environ['TWILIO_API_SECRET']),
TWILIO_CHAT_SERVICE_SID=os.environ['TWILIO_CHAT_SERVICE_SID'],
TWILIO_SYNC_SERVICE_SID=os.environ['TWILIO_SYNC_SERVICE_SID'],

# Convert keys to snake_case to conform with the twilio-python api definition contract
def snake_case_keys(somedict):
    return dict(map(lambda (key, value): (underscore(key), value), somedict.items()))

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

@app.route('/config')
def config():
    print 'Setting up config'
    print os.environ['TWILIO_ACCOUNT_SID']
    return jsonify(
        TWILIO_ACCOUNT_SID=os.environ['TWILIO_ACCOUNT_SID'],
        TWILIO_NOTIFICATION_SERVICE_SID=os.environ['TWILIO_NOTIFICATION_SERVICE_SID'],
        TWILIO_API_KEY=os.environ['TWILIO_API_KEY'],
        TWILIO_API_SECRET=bool(os.environ['TWILIO_API_SECRET']),
        TWILIO_CHAT_SERVICE_SID=os.environ['TWILIO_CHAT_SERVICE_SID'],
        TWILIO_SYNC_SERVICE_SID=os.environ['TWILIO_SYNC_SERVICE_SID'],
    )




@app.route('/register', methods=['POST'])
def register():
    # get credentials for environment variables
    account_sid = os.environ['TWILIO_ACCOUNT_SID']
    api_key = os.environ['TWILIO_API_KEY']
    api_secret = os.environ['TWILIO_API_SECRET']
    service_sid = os.environ['TWILIO_NOTIFICATION_SERVICE_SID']

    # Initialize the Twilio client
    client = Client(api_key, api_secret, account_sid)

    # Body content
    content = request.get_json()

    content = snake_case_keys(content)

    # Get a reference to the notification service
    service = client.notify.services(service_sid)

    # Create the binding
    binding = service.bindings.create(**content)

    print(binding)

    # Return success message
    return jsonify(message="Binding created!")

def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('Unauthorized, Please login', 'danger')
            return redirect(url_for('home'))
    return wrap


@app.route('/dashborad')
@is_logged_in
def dashborad():
    flash('You are now logged in', 'success')
    return render_template('dashborad.html')



@app.route('/chat')
@is_logged_in
def chat():
    return render_template('chat.html')



@app.route('/logout')
@is_logged_in
def logout():
    session.clear()
    flash('You are now logged out', 'success')
    return redirect(url_for('index'))


@app.route('/about')
@is_logged_in
def about():
    return render_template('about.html')


@app.route('/token', methods = ['GET'])
@is_logged_in
def userToken():
    user_name = session['user_email']
    return generateToken(user_name)
    
@app.route('/token', methods = ['POST'])
@is_logged_in
def createToken():
    user_name = session['user_email']
    content = request.get_json() or request.form
    identity = content.get('identity',  user_name)
    return generateToken(identity)

@app.route('/token/<identity>', methods=['POST', 'GET'])
@is_logged_in
def token(identity):
    return generateToken(identity)



@app.route(REDIRECT_URI)
@google.authorized_handler
def authorized(resp):
    access_token = resp['access_token']
    session['access_token'] = access_token, ''
    return redirect(url_for('index'))

#@app.route('/<path:path>')
#def static_file(path):
#    return app.send_static_file(path)


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

def generateToken(identity):
    # get credentials for environment variables
    account_sid = os.environ['TWILIO_ACCOUNT_SID']
    api_key = os.environ['TWILIO_API_KEY']
    api_secret = os.environ['TWILIO_API_SECRET']
    sync_service_sid = os.environ['TWILIO_SYNC_SERVICE_SID']
    chat_service_sid = os.environ['TWILIO_CHAT_SERVICE_SID']

    # Create access token with credentials
    token = AccessToken(account_sid, api_key, api_secret, identity=identity)

    # Create a Sync grant and add to token
    if sync_service_sid:
        sync_grant = SyncGrant(service_sid=sync_service_sid)
        token.add_grant(sync_grant)

    # Create a Video grant and add to token
    video_grant = VideoGrant()
    token.add_grant(video_grant)

    # Create an Chat grant and add to token
    if chat_service_sid:
        chat_grant = IpMessagingGrant(service_sid=chat_service_sid)
        token.add_grant(chat_grant)

    # Return token info as JSON
    return jsonify(identity=identity, token=token.to_jwt().decode('utf-8'))





if __name__ == '__main__':
    app.run(debug=True)
