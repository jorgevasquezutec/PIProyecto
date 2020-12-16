import os
from flask import Flask,jsonify,render_template, request, session, Response, redirect
from database import connector
from model import entities
from datetime import datetime
from sqlalchemy import and_
import json
import threading
import time
#import countLeucositos
import countFinal
import matlab
from werkzeug.utils import secure_filename

key_messages = 'messages'
key_users = 'users'
key_post='post'
cache = {}
lock = threading.Lock()
db = connector.Manager()
engine = db.createEngine()
app = Flask(__name__, template_folder= "static/html")

app.config["UPLOAD_FOLDER"] = "upload/"
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])



@app.route('/')
def index():
    return render_template("login.html")

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        message = {'msg': 'No file part!'}
        json_msg = json.dumps(message)
        return Response(json_msg, status=401, mimetype="application/json")
    # return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        message = {'msg': 'No image selected for uploading'}
        json_msg = json.dumps(message)
        return Response(json_msg, status=401, mimetype="application/json")
    # return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    #print('upload_image filename: ' + filename)
    # flash('Image successfully uploaded and displayed')
        message = {'msg': 'Image successfully uploaded and displayed'}
        json_msg = json.dumps(message)
        return Response(json_msg, status=200, mimetype="application/json")
    else:
        # flash('Allowed image types are -> png, jpg, jpeg, gif')
        message = {'msg': 'Allowed image types are -> png, jpg, jpeg, gif'}
        json_msg = json.dumps(message)
        return Response(json_msg, status=401, mimetype="application/json")
		# return redirect(request.url)    

@app.route('/count/<image>',methods=['GET'])
def countimage(image):
    my_testfuntion = countLeucositos.initialize()
    testOut = my_testfuntion.countLeucositos(app.config["UPLOAD_FOLDER"]+image)
    my_testfuntion.terminate()
    message = {'count': testOut}
    json_msg = json.dumps(message)
    return Response(json_msg, status=200, mimetype="application/json")
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
        data = dbResponse[:]
        now = datetime.now()
        session.close()
        cache[key_users] = {'data':data, 'datetime':now}
        print("using db")
    return Response(json.dumps(data, status=200, cls=connector.AlchemyEncoder), mimetype='application/json')

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



# @app.route('/post', methods = ['POST'])
# def create_post():
#     if (not request.is_json):
#         c = json.loads(request.data)['values']
#     else:
#         c = json.loads(request.data)

#     post = entities.Post(
#     titulo=c['titulo'],
#     contenido = c['contenido'],
#     tipo=c['tipo'],
#     fecha_post=datetime.now(),
#     user_id=c['user_id'],
#     estado=0
#     )
#     session = db.getSession(engine)
#     session.add(post)
#     session.commit()
#     session.close()
#     message={'msg':'Post creado'} 
#     return Response(json.dumps(message), status=200, mimetype='application/json')


# @app.route('/post_likes', methods = ['POST'])
# def create_post_like():
#     if (not request.is_json):
#         c = json.loads(request.data)['values']
#     else:
#         c = json.loads(request.data)

#     post_likes = entities.Post_likes(
#     post_id=c['post_id'],
#     user_id = c['user_id']
#     )
#     session = db.getSession(engine)
#     session.add(post_likes)
#     session.commit()
#     session.close()
#     msj={"msj":"Like Creado"}
#     return Response(json.dumps(msj), status=200, mimetype='application/json')


# @app.route('/post_likes', methods = ['DELETE'])
# def delete_post_likes():
#     post_id = json.loads(request.data)['post_id']
#     user_id = json.loads(request.data)['user_id']
#     session = db.getSession(engine)
#     like = session.query(entities.Post_likes).filter(and_(entities.Post_likes.post_id == post_id,entities.Post_likes.user_id == user_id)).one()
#     session.delete(like)
#     session.commit()
#     session.close()
#     msj={"msj":"Like borrado"} 
#     return Response(json.dumps(msj), status=200, mimetype='application/json')








# @app.route('/post', methods = ['GET'])
# def get_post():
#     lock.acquire()
#     list = []
#     if key_post in cache and(datetime.now()-cache[key_post]['datetime']).total_seconds()< 20:
#         list = cache[key_post]['data']
#     else:
#         session = db.getSession(engine)
#         dbResponse = session.query(entities.Post).filter(entities.Post.estado==0)
#         for dat in dbResponse:
#             obj={}
#             obj['id'] = dat.id
#             obj['titulo'] = dat.titulo
#             obj['contenido'] = dat.contenido
#             obj['tipo'] = dat.tipo
#             obj['fecha_post'] =dat.fecha_post if dat.fecha_post is None else dat.fecha_post.strftime("%m/%d/%Y  %H:%M:%S")
#             obj['user_id'] = dat.user_id
#             post_likes = session.query(entities.Post_likes).filter(entities.Post_likes.post_id == dat.id);
#             user= session.query(entities.User).filter(entities.User.id == dat.user_id).one()
#             data_likes = post_likes[:]
#             obj['user_created']=user.to_dict()
#             obj['likes']=  [x.to_dict() for x in data_likes]
#             list.insert(0,obj)
        
#         #list.sort(key=lambda x: x['id'], reverse=False)
#         cache[key_post] = {'data':list,'datetime':datetime.now()}
#         #print(list)
#         session.close()
#     lock.release()
#     return Response(json.dumps(list), status=200, mimetype='application/json')


# @app.route('/post/<id>', methods = ['GET'])
# def get_post_by_id(id):
#     session = db.getSession(engine)
#     dbResponse = session.query(entities.Post).filter(entities.Post.id==int(id)).one()
#     post_=dbResponse.to_dict()
#     post_likes = session.query(entities.Post_likes).filter(entities.Post_likes.post_id == post_['id']);
#     data_likes = post_likes[:]
#     user= session.query(entities.User).filter(entities.User.id == post_['user_id']).one()
#     post_['user_created']=user.to_dict()
#     post_['likes']=[x.to_dict() for x in data_likes]
    
#     return Response(json.dumps(post_), status=200, mimetype='application/json')




# {
#   "key":2,
#   "values":{
#   "titulo":"Post de rest client modificado",
#   "contenido":"Contenido rest client modificado",
#   "tipo":"tecnologia2",
#   "user_id":4
#    }
# }


# @app.route('/post', methods = ['PUT'])
# def update_post():
#     session = db.getSession(engine)
#     id = json.loads(request.data)['key']
#     post = session.query(entities.Post).filter(entities.Post.id == id).first()
#     c = json.loads(request.data)['values']
#     for key in c.keys():
#         setattr(post, key, c[key])
#     session.add(post)
#     session.commit()
#     session.close()
#     msj={"msj":"Post Editado"} 
#     return Response(json.dumps(msj), status=200, mimetype='application/json')


# @app.route('/post_message',methods=['POST'])
# def post_message():
#     if (not request.is_json):
#         c = json.loads(request.data)['values']
#     else:
#         c = json.loads(request.data)
        
#     # post_message = entities.Post_Messajes(
#     # post_id=c['post_id'],
#     # mensaje = c['mensaje'],
#     # sent_on=datetime.now(),
#     # user_id=c['user_id'],
#     # post_id_parent=c['post_id_parent'] if 'post_id_parent' in c else None,
#     # post_mensaje_id_parent=c['post_mensaje_id_parent'] if 'post_mensaje_id_parent' in c else None
#     # )

#     post_message = entities.Post_Messajes(
#     post_id=c['post_id'],
#     mensaje = c['mensaje'],
#     sent_on=datetime.now(),
#     user_id=c['user_id'],
#     estado=0
#     )

#     session = db.getSession(engine)
#     session.add(post_message)
#     session.commit()
#     post_text=post_message.to_dict()
#     print(post_text)
#     session.close()
#     user= session.query(entities.User).filter(entities.User.id == post_text['user_id']).one()
#     post_text['user_created']=user.to_dict()
#     return Response(json.dumps(post_text), status=200, mimetype='application/json')

# @app.route('/post_message/<post_id>',methods=['GET'])
# def get_post_message_by_post_id(post_id):
#     session = db.getSession(engine)
#     dbResponse = session.query(entities.Post_Messajes).filter(entities.Post_Messajes.post_id==int(post_id)).filter(entities.Post_Messajes.estado==0)
#     post_message = dbResponse[:]
#     post_allmessage = []
#     for dat in post_message:
#         post_message_i=dat.to_dict()
#         user= session.query(entities.User).filter(entities.User.id == post_message_i['user_id']).one()
#         post_message_i['user_created']=user.to_dict()
#         post_allmessage.append(post_message_i)

#     post_allmessage.sort(key=lambda x: x['id'], reverse=False)
#     return Response(json.dumps(post_allmessage), status=200, mimetype='application/json')


# @app.route('/post_message', methods = ['PUT'])
# def update_post_message():
#     session = db.getSession(engine)
#     id = json.loads(request.data)['key']
#     post = session.query(entities.Post_Messajes).filter(entities.Post_Messajes.id == id).first()
#     c = json.loads(request.data)['values']
#     for key in c.keys():
#         setattr(post, key, c[key])
#     session.add(post)
#     session.commit()
#     session.close()
#     msj={"msj":"Post Message Editado"} 
#     return Response(json.dumps(msj), status=200, mimetype='application/json')








@app.route('/logout', methods=['GET'])
def logout():
    if 'user' in session:
        session.pop('user')
    #response = {'msg': 'logged out'}
    #json_response = json.dumps(response)
    #return Response(json_response, mimetype='application/json')
    time.sleep(1);
    return render_template("login.html")


if __name__ == '__main__':
    app.secret_key = ".."
    #app.run(port=80, threaded=True, host=('172.31.46.8'))
    app.run(port=8080, threaded=True, host=('127.0.0.1'))
