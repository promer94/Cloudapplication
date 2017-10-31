## Basic structure of project
This guide uses the following structure for the flask-app project:

flask-app project structure
* app.yaml: Configure the settings of your App Engine application
* main.py: Write the content of your application
* static: Directory to store your static files
* style.css: Basic stylesheet that formats the look and feel of your template files
* templates: Directory for all of your HTML templates

## Set up

* 1. Create and enter an isolated Python environment using virtualenv:
   
   virtualenv env 
   source env/bin/activate

At the end of the tutorial, you can exit your virtualenv by typing deactivate.

* 2. Install dependencies using pip:

      pip install -t lib -r requirements.txt

The -t lib flag copies the libraries into a lib folder, which is uploaded to App Engine during deployment. See Installing a third-party library for more information about the vendoring process.The -r requirements.txt flag tells pip to install everything from a requirements.txt file.

## Test the application
Test the application using the local development server (dev_appserver.py), which is included with the SDK.
* 1. From within the root directory where the app's app.yaml configuration file is located, start the local development server with the following command:

  dev_appserver.py app.yaml

The local development server is now running and listening for requests on port 8080.

* 2. Visit http://localhost:8080/  in your web browser to view the app.
