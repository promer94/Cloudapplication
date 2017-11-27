## Basic structure of project
This guide uses the following structure for the flask-app project:

flask-app project structure
* app.yaml: Configure the settings of your App Engine application
* main.py: Write the content of your application
* static: Directory to store your static files
* style.css: Basic stylesheet that formats the look and feel of your template files
* templates: Directory for all of your HTML templates

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

## Google Cloud Datastore
These steps are used to build a TaskList application with the Google Cloud Datastore API. The TaskList application stores, lists, updates, and removes tasks.
* 1. Prerequisites
      (i)   A Google Cloud Platform Console project with the Cloud Datastore API enabled
            In order to authenticate to a Cloud API, follow these steps:

            - [Create a service account key using GCP Console/GCloud] 
            (https://console.cloud.google.com/apis/credentials/serviceaccountkey?authuser=0&_ga=2.32592958.-1837838245.1507538919)

            - From the Service account dropdown, select New service account.

            - Input a name into the Service account name form field.

            - From the Role dropdown, select Project > Owner.

            - Click the Create button. A JSON file that contains your key downloads to your computer.

            - Provide the credentials to your application code by setting the environment variable GOOGLE_APPLICATION_CREDENTIALS to point to the JSON file you downloaded in the previous step:
            
                    set GOOGLE_APPLICATION_CREDENTIALS=<path_to_service_account_file>
              
      (ii)  An active App Engine Application: Open the App Engine dashboard and confirm your project has an active App Engine app. 
Create an App Engine app if needed. The app must not be disabled.

* 2. Installation and setup
  (i)	  Ensure you have Python (version 2.7.9 or later), pip, and virtualenv installed.
  (ii)	Activate a virtualenv session.

		      virtualenv venv
		      source venv/bin/activate
		
  (iii)	  Download the TaskList sample application from [here]      (https://github.com/GoogleCloudPlatform/python-docs-samples/archive/master.zip)
  (iv)	  Unzip the download:

		      unzip python-docs-samples-master.zip
  (v)	  Change directories to the TaskList application:

	      	cd python-docs-samples-master/datastore/cloud-client
  (vi)	 Confirm if the requirements.txt file contains the following and then install dependencies:
		      
          google-cloud-datastore==1.4.0
          pip install -r requirements.txt

  (vii)	  Run the application! Use the ID of your Google Cloud Platform project for project-id.

          python tasks.py --project-id <project-id> new MySampleSandbox

