# in order for this to run, you need to
# * install python and include python and python/Scripts folder in windows environment variable PATH
# * install flask package with pip install flask
# * run the command python server.py


import random

from flask import Flask, render_template
from flask import request, jsonify

from bson.json_util import dumps

from urllib.parse import parse_qs

from pymongo import MongoClient

import time

import sqlite3
import pandas

from sqlalchemy import create_engine

# import json
# import ast
# import imp
# from config import client
# from app import app


# this example is based on
# https://codeburst.io/creating-a-full-stack-web-application-with-python-npm-webpack-and-react-8925800503d9

app = Flask(__name__, static_folder='../client/dist', template_folder='../client/src/templates')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/hello')
def hello():
    return get_hello()


@app.route("/data", methods=['GET'])
def data():
    return get_data_from_mongodb()


@app.route("/dataSqLite", methods=['GET'])
def data_sqlite():
    return get_data_from_sqlite()

@app.route("/dataMySql", methods=['GET'])
def data_mysql():
    return get_data_from_mysql()


def get_hello():
    greeting_list = ['Ciao', 'Hei', 'Salut', 'Hola', 'Hallo', 'Hej']
    return random.choice(greeting_list)


def get_data_from_mongodb():
    # this example is based on
    # https://www.moesif.com/blog/technical/restful/Guide-to-Creating-RESTful-APIs-using-Python-Flask-and-MongoDB/

    # DATABASE = MongoClient()['restfulapi'] # DB_NAME

    mongo_client = MongoClient('localhost', 27017)
    database = mongo_client.visualization;
    collection = database.german_data;

    try:
        # Call the function to get the query params
        query_params = parse_query_params(request.query_string)
        # Check if dictionary is not empty
        if query_params:

            # Try to convert the value to int
            query = {k: int(v) if isinstance(v, str) and v.isdigit() else v for k, v in query_params.items()}

            # Fetch all the record(s)
            records_fetched = collection.find(query)

            # Check if the records are found
            if records_fetched.count() > 0:
                # Prepare the response
                return dumps(records_fetched)
            else:
                # No records are found
                return "", 404

        # If dictionary is empty
        else:

            current_milli_time = lambda: int(round(time.time() * 1000))

            start_time = current_milli_time()
            limit = 10000
            document_cursor = collection.find().limit(limit)

            time_after_query = current_milli_time()
            print('Time for query: ' + str(time_after_query - start_time) + ' ms')

            # Return all the records as query string parameters are not available
            count = document_cursor.count()
            print('Number of records: ' + str(count))
            if count > 0:
                documents = jsonify(list(document_cursor))
                time_after_conversion = current_milli_time()
                print('Time for conversion: ' + str(time_after_conversion - time_after_query) + ' ms')
                return documents
            else:
                return jsonify([])
    except Exception as exception:
        print(exception)
        return "", 500


def get_data_from_sqlite():

    try:
        # Call the function to get the query params
        query_params = parse_query_params(request.query_string)
        # Check if dictionary is not empty
        if query_params:
            #todo
            foo=1

        else:
            # Return all the records as query string parameters are not available
            current_milli_time = lambda: int(round(time.time() * 1000))

            start_time = current_milli_time()

            with sqlite3.connect('./german_data.sqlite') as connection:
                query = "SELECT * FROM `german_data`"
                data_frame = pandas.read_sql_query(query, connection)
                time_after_query = current_milli_time()
                print('Time for query: ' + str(time_after_query - start_time) + ' ms')

                count = data_frame.shape[0]
                print('Number of records: ' + str(count))
                if count > 0:
                    documents = data_frame.to_json(orient='records')
                    time_after_conversion = current_milli_time()
                    print('Time for conversion: ' + str(time_after_conversion - time_after_query) + ' ms')
                    return documents
                else:
                    # Return empty array if no users are found
                    return jsonify([])


    except Exception as exception:
        print(exception);
        # Error while trying to fetch the resource
        # Add message for debugging purpose
        return "", 500

def get_data_from_mysql():

    try:
        # Call the function to get the query params
        query_params = parse_query_params(request.query_string)
        # Check if dictionary is not empty
        if query_params:
            #todo
            foo=1

        else:
            # Return all the records as query string parameters are not available

            host = 'dagobah'
            port = 3366
            database = 'visualization'
            username = 'root'
            password = '*******' #you need to use right password for this to work
            engine = create_engine(f"mysql://{username}:{password}@{host}:{port}/{database}")

            current_milli_time = lambda: int(round(time.time() * 1000))

            start_time = current_milli_time()

            with engine.connect() as connection:
                query = "SELECT * FROM `german_data`" + " LIMIT 100000"
                data_frame = pandas.read_sql_query(query, connection)
                time_after_query = current_milli_time()
                print('Time for query: ' + str(time_after_query - start_time) + ' ms')

                count = data_frame.shape[0]
                print('Number of records: ' + str(count))
                if count > 0:
                    documents = data_frame.to_json(orient='records')
                    time_after_conversion = current_milli_time()
                    print('Time for conversion: ' + str(time_after_conversion - time_after_query) + ' ms')
                    return documents
                else:
                    # Return empty array if no users are found
                    return jsonify([])


    except Exception as exception:
        print(exception);
        # Error while trying to fetch the resource
        # Add message for debugging purpose
        return "", 500






def parse_query_params(query_string):
    query_params = dict(parse_qs(query_string.decode()))
    query_params = {k: v[0] for k, v in query_params.items()}
    return query_params


if __name__ == '__main__':
    app.run()
