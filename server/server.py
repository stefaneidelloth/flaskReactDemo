#in order for this to run, you need to
#* install python and include python and python/Scripts folder in windows environment variable PATH
#* install flask package with pip install flask
#* run the command python server.py


import random
from flask import Flask, render_template

app = Flask(__name__, static_folder='../client/dist', template_folder='../client/src/templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/hello') 
def hello():   
    return get_hello()

def get_hello():
    greeting_list = ['Ciao', 'Hei', 'Salut', 'Hola', 'Hallo', 'Hej']
    return random.choice(greeting_list)

if __name__ == '__main__':
    app.run()
