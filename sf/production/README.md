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
9) Visit http://localhost:5000/ or http://localhost:8080/  in your web browser to view the app.
