from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    baby_id= db.Column(db.Integer, db.ForeignKey('baby.id'))
    avatar_path = db.Column(db.String(255))  # Almacenar la ruta de la imagen
    is_admin = db.Column(db.Boolean(), unique=False, nullable=False)

    baby = db.relationship('Baby', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "baby_id": self.baby_id,
            # do not serialize the password, its a security breach
        }
    
class Baby(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    avatar_path = db.Column(db.String(255))  # Almacenar la ruta de la imagen
    name = db.Column(db.String(120), nullable=False)
    gender=db.Column(db.String(120),  nullable=False)
    age= db.Column(db.Integer)
    height=db.Column(db.Float) 
    weight=db.Column(db.Float)
    report_id=db.Column(db.Integer, db.ForeignKey('report.id'))

    report = db.relationship('Report', backref='baby', lazy=True)
    

    def __repr__(self):
        return f'<Baby {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "gender": self.gender,
            "age": self.age,
            "height": self.height,
            "weight": self.weight,
            # do not serialize the password, its a security breach
        }
        
class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bedtime = db.Column(db.Integer)
    meals = db.Column(db.Integer)
    diapers = db.Column(db.Integer)
    walks = db.Column(db.Integer)
    water = db.Column(db.Integer)
    meds = db.Column(db.Boolean)
    kindergarden = db.Column(db.Boolean)
    extra = db.Column(db.String(120))

    def __repr__(self):
        return f'<Report {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "bedtime": self.bedtime,
            "meals": self.meals,
            "diapers": self.diapers,
            "walks": self.walks,
            "water": self.water,
            "meds": self.meds,
            "kindergarden": self.kindergarden,
            "extra": self.extra,
            # do not serialize the password, its a security breach
        }

class Blog_recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.Integer, db.ForeignKey('user.id'))
    title = db.Column(db.String(120))
    img_header = db.Column(db.String(120))
    text_intro = db.Column(db.String(120))
    text_ingredients = db.Column(db.String(120))
    text_steps = db.Column(db.String(120))
    img_final = db.Column(db.String(120))
    source = db.Column(db.String(120))

    def __repr__(self):
        return f'<Blog_recipe {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "author": self.author,
            "title": self.title,
            "img_header": self.img_header,
            "text_intro": self.text_intro,
            "text_ingredients": self.text_ingredients,
            "text_steps": self.text_steps,
            "img_final": self.img_final,
            "source": self.source,
            # do not serialize the password, its a security breach
        }    
                
class Blog_news(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.Integer, db.ForeignKey('user.id'))
    title = db.Column(db.String(120))
    img_header = db.Column(db.String(120))
    text = db.Column(db.String(120))
    img_final = db.Column(db.String(120))
    source = db.Column(db.String(120))

    def __repr__(self):
        return f'<Blog_news {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "author": self.author,
            "title": self.title,
            "img_header": self.img_header,
            "text": self.text,
            "img_final": self.img_final,
            "source": self.source,
            # do not serialize the password, its a security breach
        }    
                              
