from sqlalchemy import Column, Integer, String, Sequence, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import connector

class User(connector.Manager.Base):
    __tablename__ = 'users'
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column(String(50))
    fullname = Column(String(50))
    password = Column(String(12))
    username = Column(String(12))
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'fullname':self.fullname,
            'username':self.username
        }


class Post(connector.Manager.Base):
    __tablename__ = 'post'
    id = Column(Integer, Sequence('post_id_seq'), primary_key=True)
    titulo = Column(String(50))
    contenido= Column(String(500))
    tipo= Column(String(25))
    fecha_post = Column(DateTime(timezone=True))
    user_id =Column(Integer, ForeignKey('users.id'))
    estado=Column(Integer)
    def to_dict(self):
        return{
            'id':self.id,
            'titulo':self.titulo,
            'contenido':self.contenido,
            'tipo':self.tipo,
            'fecha_post':self.fecha_post if self.fecha_post is None else self.fecha_post.strftime("%m/%d/%Y  %H:%M:%S"),
            'user_id':self.user_id,
            'estado':self.estado
        }

class Post_likes(connector.Manager.Base):
    __tablename__ = 'postlikes'
    post_id=Column(Integer,primary_key=True)
    user_id=Column(Integer,primary_key=True)
    def to_dict(self):
        return {
            'post_id': self.post_id,
            'user_id': self.user_id
        }

class Post_Messajes(connector.Manager.Base):
    __tablename__ = 'postmensajes'
    id = Column(Integer, Sequence('postmensajes_id_seq'), primary_key=True)
    post_id=Column(Integer, ForeignKey('post.id'))
    mensaje=Column(String(500))
    user_id=Column(Integer, ForeignKey('users.id'))
    sent_on = Column(DateTime(timezone=True))
    estado=Column(Integer)
    #post_id_parent=Column(Integer)
    #post_mensaje_id_parent=Column(Integer)
    def to_dict(self):
        return {
            'id': self.id,
            'post_id': self.post_id,
            'mensaje':self.mensaje,
            'user_id':self.user_id,
            'sent_on':self.sent_on if self.sent_on is None else self.sent_on.strftime("%m/%d/%Y  %H:%M:%S"),
            'estado':self.estado
            #'post_id_parent':self.post_id_parent,
            #'post_mensaje_id_parent':self.post_mensaje_id_parent
        }


class Message(connector.Manager.Base):
    __tablename__ = 'messages'
    id = Column(Integer, Sequence('message_id_seq'), primary_key=True)
    content = Column(String(500))
    sent_on = Column(DateTime(timezone=True))
    user_from_id = Column(Integer, ForeignKey('users.id'))
    user_to_id = Column(Integer, ForeignKey('users.id'))
    user_from = relationship(User, foreign_keys=[user_from_id])
    user_to = relationship(User, foreign_keys=[user_to_id])
    def to_dict(self):
        if(self.sent_on) is None:
            date = self.sent_on
        else:
            date = self.sent_on.isoformat()
            return {
                'id': self.id,
                'content': self.content,
                'sent_on': self.sent_on.isoformat(),
                'user_from_id': self.user_from_id,
                'user_to_id': self.user_to_id
            }