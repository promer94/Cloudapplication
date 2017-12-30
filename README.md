# Instruction
---
**chat** is used for create **static** file that should be hosted by our backend server. It is modified from [create-react-app](https://github.com/facebookincubator/create-react-app).  

Before using it you need run
```bash
npm install
```
or 
```bash
yarn
```
Then all the dependcies will installed. 

Then you can run 
```bash
npm start
```
It will start up a development server for you.  

If you want to test it with the real backend. you need run
```bash
npm build
```
Then you will get a **build** file in your **chat**
Copy it and paste it outside the **chat**, then change its name to **"static"*

Start our server
```bash
pip install -r requirements.txt
python app.py
```
Then you will be able to test the whole application
