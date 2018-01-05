import os
from flask import Flask, jsonify, request, redirect, url_for, session
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
from flask_cors import CORS

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)


# Set up Google SignIn
GOOGLE_CLIENT_ID = os.environ['GOOGLE_CLIENT_ID']
GOOGLE_CLIENT_SECRET = os.environ['GOOGLE_CLIENT_SECRET']
REDIRECT_URI = os.environ['REDIRECT_URI']
SECRET_KEY = os.environ['SECRET_KEY']

# Set up MongoDB
client = MongoClient(os.environ['MONGODB_URI'])
db = client.SocialFamily
collection = db.user

# Set up Twilio API
TWILIO_ACCOUNT_SID = os.environ['TWILIO_ACCOUNT_SID'],
TWILIO_API_KEY = os.environ['TWILIO_API_KEY'],
TWILIO_API_SECRET = (os.environ['TWILIO_API_SECRET']),
TWILIO_CHAT_SERVICE_SID = os.environ['TWILIO_CHAT_SERVICE_SID'],
TWILIO_SYNC_SERVICE_SID = os.environ['TWILIO_SYNC_SERVICE_SID'],



app = Flask(__name__)
CORS(app)
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
    return app.send_static_file('index.html')

@app.route('/login')
def login():
    callback = url_for('authorized', _external=True)
    return google.authorize(callback=callback)

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect(url_for('home'))
    return wrap

@app.route('/chat')
@is_logged_in
def chat():
    return app.send_static_file('index.html')

@app.route('/logout')
@is_logged_in
def logout():
    session.clear()
    return redirect(url_for('home'))

# route to store the pin
@app.route('/pin', methods=['POST'])
@is_logged_in
def createPin():
	print('CALLED route /pin')
	content = request.get_json() or request.form
	session['isFirstLogin'] = False
	print(content['pin'])
	# save content['pin'] to the DB
	# the record is already in the DB
	# I don't check is this first login or not
	# add PIN field name
	filter = {'email': session['user_email']}
	record = {
		'pin': content['pin']
	}
	collection.update(filter, {'$set' : record})
	print('Recorded data is: ')
	print(record)
	return redirect(url_for('home'))

# route to check the pin
@app.route('/checkpin', methods=['POST'])
@is_logged_in
def checkPin():
	print('CALLED route /checkpin')
	content = request.get_json() or request.form
	print(content['pin'])
	# validate input pin by comparing it to the DB record
	filter = {'email': session['user_email']}
	cursor = collection.find(filter)
	for c in cursor:
		if c['pin'] == content['pin']:
			print('PINS ARE EQUAL')
			return jsonify(valid=True)
		else:
			print('PINS ARE NOT EQUAL')
			return jsonify(valid=False)


@app.route('/userinfo' , methods=['GET'])
@is_logged_in
def userInfo():
    return jsonify(
        user_email = session['user_email'],
        user_name = session['user_name'],
        user_picture = session['user_picture'],
        user_status = session['logged_in'],
        user_isFirsttime = session['isFirstLogin'] 
    )


@app.route('/token', methods=['GET'])
@is_logged_in
def userToken():
    user_name = session['user_email']
    return generateToken(user_name)


@app.route('/token', methods=['POST'])
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
        session['isFirstLogin'] = True
        return redirect(url_for('chat'))
    else:
        session['isFirstLogin'] = False
        return redirect(url_for('chat'))

def generateToken(identity):
    # get credentials for environment variables
    account_sid = os.environ['TWILIO_ACCOUNT_SID']
    api_key = os.environ['TWILIO_API_KEY']
    api_secret = os.environ['TWILIO_API_SECRET']
    sync_service_sid = os.environ['TWILIO_SYNC_SERVICE_SID']
    chat_service_sid = os.environ['TWILIO_CHAT_SERVICE_SID']

    # Create access token with credentials
    token = AccessToken(account_sid, api_key, api_secret, identity=identity)

    # Create an Chat grant and add to token
    if chat_service_sid:
        chat_grant = IpMessagingGrant(service_sid=chat_service_sid)
        token.add_grant(chat_grant)

    # Return token info as JSON
    return jsonify(identity=identity, token=token.to_jwt().decode('utf-8'))


if __name__ == '__main__':
    app.run(debug=True)
