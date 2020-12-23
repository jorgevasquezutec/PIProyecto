import os
from flask import Flask,jsonify,render_template, request, session, Response, redirect
from database import connector
from model import entities
from datetime import datetime
from sqlalchemy import and_
import json
import threading
import time
import method1
import matlab
import numpy as np
import pandas as pd
from PIL import Image
from werkzeug.utils import secure_filename

key_users = 'users'
cache = {}
lock = threading.Lock()
db = connector.Manager()
engine = db.createEngine()
app = Flask(__name__, template_folder= "static/html")

# app.config["UPLOAD_FOLDER"] = "upload/"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}



@app.route('/')
def index():
    return render_template("login.html")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @app.route('/upload', methods=['POST'])
# def upload_image():
#     if 'file' not in request.files:
#         message = {'msg': 'No file part!'}
#         json_msg = json.dumps(message)
#         return Response(json_msg, status=401, mimetype="application/json")
#     # return redirect(request.url)
#     file = request.files['file']
#     if file.filename == '':
#         message = {'msg': 'No image selected for uploading'}
#         json_msg = json.dumps(message)
#         return Response(json_msg, status=401, mimetype="application/json")
#     # return redirect(request.url)
#     if file and allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#     #print('upload_image filename: ' + filename)
#     # flash('Image successfully uploaded and displayed')
#         message = {'msg': 'Image successfully uploaded and displayed'}
#         json_msg = json.dumps(message)
#         return Response(json_msg, status=200, mimetype="application/json")
#     else:
#         # flash('Allowed image types are -> png, jpg, jpeg, gif')
#         message = {'msg': 'Allowed image types are -> png, jpg, jpeg, gif'}
#         json_msg = json.dumps(message)
#         return Response(json_msg, status=401, mimetype="application/json")
# 		# return redirect(request.url)

@app.route('/upload', methods=['GET', 'POST'])
def upload_image():
    # print(request.__dict__)
    if 'file' not in request.files:
        message = {'msg': 'No file part!'}
        json_msg = json.dumps(message)
        return Response(json_msg, status=401, mimetype="application/json")
    
    file = request.files['file']
    typesearch=request.form.get("typesearch")
    # kvalue=request.form.get("kvalue")
    # pa=request.files['typesearch']
    # print(request.files['typesearch'])
    # print(request.files['kvalue'])

    if file.filename == '':
        message = {'msg': 'No image selected for uploading'}
        json_msg = json.dumps(message)
        return Response(json_msg, status=401, mimetype="application/json")

    if file and allowed_file(file.filename):
        output = findleukemia (file,typesearch)
        return Response(output, status=201, mimetype="application/json")
    else:
        message = {'msg': 'Allowed image types are -> png, jpg, jpeg, gif'}
        json_msg = json.dumps(message)
        return Response(json_msg, status=401, mimetype="application/json")




# @app.route('/count/<image>',methods=['GET'])
# def countimage(image):
#     my_testfuntion = countLeucositos.initialize()
#     testOut = my_testfuntion.countLeucositos(app.config["UPLOAD_FOLDER"]+image)
#     my_testfuntion.terminate()
#     message = {'count': testOut}
#     json_msg = json.dumps(message)
#     return Response(json_msg, status=200, mimetype="application/json")
# print(testOut)

# Login
@app.route('/login',methods=['POST'])
def login():
    username = json.loads(request.data)['username']
    password = json.loads(request.data)["password"]
    db_session=db.getSession(engine)
    respuesta=db_session.query(entities.User).filter_by(username=username, password=password).first()
    if(respuesta is not None):
        json_data = {}
        json_data["id"] = respuesta.id
        json_data["name"] = respuesta.name
        json_data["fullname"] = respuesta.fullname
        json_data["username"] = respuesta.username
        session['user']=json_data
        message = {'msg': 'Welcome!', 'id': respuesta.id, 'username': respuesta.username}
        json_msg = json.dumps(message)
        return Response(json_msg, status=200, mimetype="application/json")
    session['user']=""
    db_session.close()
    message = {'msg': 'Fail!'}
    json_msg = json.dumps(message)
    return Response(json_msg, status=401, mimetype="application/json")


@app.route('/current',methods=['GET'])
def get_current():
    return session['user']

#CRUD users
@app.route('/users', methods = ['POST'])
def create_user():
    username = json.loads(request.data)['username']
    password = json.loads(request.data)["password"]
    name = json.loads(request.data)['name']
    fullname = json.loads(request.data)["fullname"]
    user = entities.User(
        username=username,
        name=name,
        fullname=fullname,
        password=password
    )
    session = db.getSession(engine)
    session.add(user)
    session.commit()
    r_msg = {'msg':'UserCreated'}
    json_msg = json.dumps(r_msg)
    session.close()
    return Response(json_msg, status=201)


@app.route('/users/<id>', methods = ['GET'])
def get_user(id):
    db_session = db.getSession(engine)
    users = db_session.query(entities.User).filter(entities.User.id == id)
    for user in users:
        js = json.dumps(user, cls=connector.AlchemyEncoder)
        db_session.close()
        return  Response(js, status=200, mimetype='application/json')
    message = { 'status': 404, 'message': 'Not Found'}
    db_session.close()
    return Response(json.dumps(message), status=404, mimetype='application/json')

@app.route('/users', methods = ['GET'])
def get_users():
    if key_users in cache and (datetime.now()-cache[key_users]['datetime']).total_seconds()<5:
        data = cache[key_users]['data']
        print("using cache")
    else:
        session = db.getSession(engine)
        dbResponse = session.query(entities.User)
        data = [x.to_dict() for x in dbResponse]
        now = datetime.now()
        session.close()
        cache[key_users] = {'data':data, 'datetime':now}
        print("using db")
        print(data)
    return Response(json.dumps(data), status=201,mimetype='application/json')

@app.route('/users', methods = ['PUT'])
def update_user():
    session = db.getSession(engine)
    id = json.loads(request.data)['key']
    user = session.query(entities.User).filter(entities.User.id == id).first()
    c = json.loads(request.data)['values']

    for key in c.keys():
        setattr(user, key, c[key])

    session.add(user)
    session.commit()
    session.close()
    message={'msg':'User Editado'} 
    return Response(json.dumps(message), status=200, mimetype='application/json')

@app.route('/users', methods = ['DELETE'])
def delete_user():
    id = json.loads(request.data)['key']
    session = db.getSession(engine)
    user = session.query(entities.User).filter(entities.User.id == id).one()
    session.delete(user)
    session.commit()
    session.close()
    message={'msg':'User borrado'} 
    return Response(json.dumps(message), status=200, mimetype='application/json')



@app.route('/logout', methods=['GET'])
def logout():
    if 'user' in session:
        session.pop('user')
    time.sleep(1)
    return render_template("login.html")



def findleukemia(file,typeserach):
    
    image = Image.open(file)
    image_mat = matlab.uint8(list(image.getdata()))
    image_mat.reshape((image.size[0], image.size[1], 3))

    imp = method1.initialize()
    if(int(typeserach)==1):
        answer = imp.method1(image_mat)
    elif(int(typeserach)==2):
        answer = imp.method2(image_mat)
    else:
        answer=[]
    imp.terminate()

    if(len(answer)>0):
        np_x = np.array(answer[0]._data).reshape(answer[0].size, order='F')
        output=pd.Series(np_x).to_json(orient='values')
        return output
    return []

    # print(image_mat)
    # # image_mat = matlab.uint8(file)
   


    
    # print(type(answer))
   
    # print(np_x)
   


if __name__ == '__main__':
    app.secret_key = ".."
    app.run(port=80, threaded=True, host=('190.237.15.223/32'))
    #app.run(port=8080, threaded=True, host=('127.0.0.1'))
