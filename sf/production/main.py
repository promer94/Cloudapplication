from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from flask_oauth import OAuth
from functools import wraps

# You must configure these 3 values from Google APIs console
# https://code.google.com/apis/console
GOOGLE_CLIENT_ID = '119855237642-p3ckimhcgmb2ljnigcegvrh1v43eb1ba.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = 'eVGXh0tufuuqgY5YK0zz0Sck'
REDIRECT_URI = '/oauth2callback'  # one of the Redirect URIs from Google APIs console
 
SECRET_KEY = 'development key'


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
                          access_token_params={'grant_type': 'authorization_code'},
                          consumer_key=GOOGLE_CLIENT_ID,
                          consumer_secret=GOOGLE_CLIENT_SECRET)



@app.route('/')
def index():
    access_token = session.get('access_token')
    if access_token is None:
        return redirect(url_for('home'))
 
    access_token = access_token[0]
    from urllib2 import Request, urlopen, URLError
 
    headers = {'Authorization': 'OAuth '+access_token}
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
    session['user_info'] = res.read()
    return redirect(url_for('dashborad'))

@app.route('/home')
def home():
    return render_template('home.html')



@app.route('/login')
def login():
    callback=url_for('authorized', _external=True)
    return google.authorize(callback=callback)

@app.route('/dashborad')
def dashborad():
    return render_template('dashborad.html')


@app.route('/about')
def about():    
    return render_template('about.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', False)    
    session.pop('access_token', None)
    return redirect(url_for('index'))

@app.route(REDIRECT_URI)
@google.authorized_handler
def authorized(resp):
    access_token = resp['access_token']
    session['access_token'] = access_token, ''
    return redirect(url_for('index'))
 
 
@google.tokengetter
def get_access_token():
    return session.get('access_token')

if __name__ == '__main__':
    app.run(debug=True)