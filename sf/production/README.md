# Installing and Running
After cloning this repository to your computer, you need to perform the following steps to be able to run it:
1) Ensure you have npm, python and pip installed on your machine.
2) Go to the SocialFamily/sf/production/static/ directory and execute "npm install"
This will download and install the dependencies listed in package.json.
3) In the static directory, start the npm to build the front end code. "npm run build".
4) Go back to SocialFamily/sf/production directory
5) if you want to testing it on your local machine. you should check main.js file to make sure the backend URL is http://localhost:5000/.
6) if you want to testing it using google dev_appserver.py.  The backend URL should be http://localhost:8080/.
7) Install dependencies using pip:
      pip install -r requirements.txt
8) Using the following command:
   python main.py
9) Visit http://localhost:5000/
## Set up
* 1. Create and enter an isolated Python environment using virtualenv:  
   virtualenv env 
   source env/bin/activate

At the end of the tutorial, you can exit your virtualenv by typing deactivate.
* 2. Install dependencies using pip:
      pip install -t lib -r requirements.txt
The -t lib flag copies the libraries into a lib folder, which is uploaded to App Engine during deployment. See Installing a third-party library for more information about the vendoring process.The -r requirements.txt flag tells pip to install everything from a requirements.txt file.
## Test the application
Test the application using the local development server (dev_appserver.py), which is included with the SDK.
* 1. From within the root directory where the app's app.yaml configuration file is located, start the local development server with the following command:

  dev_appserver.py app.yaml

The local development server is now running and listening for requests on port 8080.

* 2. Visit http://localhost:8080/  in your web browser to view the app.
