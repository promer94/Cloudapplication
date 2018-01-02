# Development guide
---
## Basic test  
if you want to have quick look about this project. You need go to production directory and using  
```bash 
pip install -r requirements.txt
```
It will install all the dependencies for our python(backend code).
Then
```bash
python app.py
```
It will set up a local server to host the **static** file.

Then you would ba able to using the app locally.

---
## Development
* if you want to make some changes about backend. You should modify **app.py**.  

* if you want to make changes about frontend. You first need enter into **chat** , it has a **package.json**.  
You need install all the frontend dependencies for React and Material UI.  
```bash
npm installl
```
after that you start development by edit the files in the */src*  
When you finish you changes. you should build a static.
```bash
npm run build
```
It will give a new static file. So you need to delete the old outside the **chat** app, and move the current static file into production directory.

At last, in production directory, you can run
```bash
python app.py
```
to see your new application
