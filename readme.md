# DoNow Social Media  application

Backend of the application is developed in python Django.

## Setup for running backend 

The first thing to do is to clone the repository:

```sh
$ git clone https://github.com/hassanShabbir1960/Social_media_app.git
$ cd donow_backend-master
```

Create a virtual environment to install dependencies in and activate it:

```sh
$ virtualenv2 --no-site-packages env
$ source env/bin/activate
```

Then install the dependencies:

```sh
(env)$ pip install -r requirements.txt
```
Note the `(env)` in front of the prompt. This indicates that this terminal
session operates in a virtual environment set up by `virtualenv2`.

Once `pip` has finished downloading the dependencies:
```sh
(env)$ cd project
(env)$ python manage.py runserver
```

## Setup for running Front end 

Clone down this repository. You will need node and npm installed globally on your machine.

Installation:
```sh
npm install
```
To Run Test Suite:

```sh
npm test
```
To Start Server:

```sh
npm start
```

To Visit App:

```sh
localhost:3000/
```
