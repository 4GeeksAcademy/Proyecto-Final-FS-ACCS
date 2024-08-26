"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory
from api.models import db, User, Baby, Report, Blog_recipe, Blog_news, TokenBlockedList
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token,get_jwt, get_jwt_identity, jwt_required
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
import os
#para encriptar la password:
from flask_bcrypt import Bcrypt, check_password_hash,generate_password_hash
import requests
import json



api = Blueprint('api', __name__)

#para encriptar la password:
app = Flask(__name__)
bcrypt = Bcrypt(app)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


#[POST] Login
@api.route('/login' ,methods=["POST"])
def login():
        try:

            email = request.json.get('email',None)
            password = request.json.get('password', None)
            user = User.query.filter_by (email=email).first()
            if user:
                password_checked= bcrypt.check_password_hash(user.password,password)
                if password_checked:
                    access_token = create_access_token(identity= user.id, additional_claims={"type":"access"})
                    return jsonify({'success' : True, 'user':user.serialize(), 'token' :access_token }), 200
                return jsonify({'success' : False, 'msg':'Usuario o contraseña no válidos'}), 400
            return jsonify({'success' : False,  'msg' : 'El correo electrónico no existe'}), 404
        except Exception as e:
            return jsonify({"msg": str(e)}), 500


#[POST] Signup
@api.route('/signup', methods=['POST'])
def signup():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    username = request.json.get('username', None)
    if not email or not password:
        return jsonify({'success': False, 'msg': 'Faltan datos para el registro'}), 400
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'success': False, 'msg': 'Este correo electrónico ya tiene una cuenta'}), 400
    
    encrypted_password=bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=encrypted_password, username=username, is_admin=False)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity= new_user.id)
    return jsonify({'success' : True, 'user':new_user.serialize(), 'token':access_token}), 200
       

#[GET] Token
@api.route('/token', methods=['POST'])
@jwt_required()
def check_jwt():
    user_id= get_jwt_identity()
    user= User.query.get(user_id)
    if user:
        return jsonify({'success' : True, 'user':user.serialize()}), 200
    return jsonify({'success' : False, 'msg': 'Bad token'}), 200


#[GET] Protected
@api.route('/protected', methods=['GET'])
@jwt_required()
def handle_protected():
    user_id = get_jwt_identity()
    user= User.query.get(user_id)
    if user:
        return jsonify({'msg':'Has logrado acceder a una ruta protegida '})
    return jsonify({'success':False, 'msg': 'Bad token'})

  
#[GET] Listar todos los bebes que hay en la base de datos.
@api.route('/all_babies', methods=['GET'])
def get_all_babies():
    bebe = Baby.query.all()
    aux = list(map(lambda x: x.serialize(), bebe))
    return jsonify({'msg': 'OK', 'data': aux}), 200   

#[GET] Muestra la información de un solo bebe según su id.
@api.route('/one_baby/<int:id>', methods=['GET'])
def get_one_baby(id):
    bebe = Baby.query.get(id)
    return jsonify({'msg': 'OK', 'bebe': bebe.serialize()}), 200

#[GET] Muestra la información de un solo bebe según su nombre.
@api.route('/one_baby_by_name/<string:name>', methods=['GET'])
def get_one_baby_by_name(name):
    baby=Baby.query.filter_by(name=name).first()
    if baby is None:
        return jsonify({'msg': 'Baby not found'}), 404
    return jsonify({'msg': 'OK', 'data': baby.serialize()}), 200

#[PUT] Editar los datos de un bebe
@api.route('/edit_baby/<int:id>', methods=['PUT'])
def edit_baby(id):
    baby = Baby.query.get(id)
    if baby is None:
        return jsonify({'msg': 'Baby not found'}), 404
        
    data = request.json
    baby.name = data['name']
    baby.gender = data['gender']
    baby.age = data['age']
    baby.height = data['height']
    baby.weight = data['weight']
    #baby.avatar_path = data['avatar_path']

    db.session.commit()
    return jsonify({'msg': 'Datos del bebe editado', 'data': baby.serialize()}), 200    
    
#[POST] Nuevo Blog
@api.route('/new_blog', methods=['POST'])
@jwt_required()
def new_blog():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'success': False, 'msg': 'Bad token'}), 401
    
    if not user.is_admin:
        return jsonify({'success': False, 'msg': 'Admin access required!'}), 403
    
    data = request.json
    blog_type = data.get('type')
    author_id = data.get('author')
    title = data.get('title')
    img_header = data.get('img_header')
    img_final = data.get('img_final')
    source = data.get('source')

    if blog_type == 'recipe':
        text_intro = data.get('text_intro')
        text_ingredients = data.get('text_ingredients')
        text_steps = data.get('text_steps')
 
        if not (text_intro and text_ingredients and text_steps):
            return jsonify({"error": "Missing recipe fields"}), 422
        new_blog = Blog_recipe(
            author=author_id,
            title=title,
            img_header=img_header,
            text_intro=text_intro,
            text_ingredients=text_ingredients,
            text_steps=text_steps,
            img_final=img_final,
            source=source
        )
    elif blog_type == 'news':
        text = data.get('text')
        if not text:
            return jsonify({"error": "Missing news content"}), 422
        new_blog = Blog_news(
            author=author_id,
            title=title,
            img_header=img_header,
            text=text,
            img_final=img_final,
            source=source
        )
    else:
        return jsonify({"error": "Invalid blog type"}), 400

    try:
        db.session.add(new_blog)
        db.session.commit()
        return jsonify({"message": "Blog created successfully", "blog_id": new_blog.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


#[PUT] Editar Blog
@api.route('/edit_blog/<string:type>/<int:id>', methods=['PUT'])
@jwt_required()
def edit_blog(type, id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    title = data.get('title')
    img_header = data.get('img_header')
    img_final = data.get('img_final')
    source = data.get('source')

    if type == 'news':
        blog = Blog_news.query.get(id)
        if not blog:
            return jsonify({"error": "News blog not found"}), 404
        blog.text = data.get('text', blog.text)
    elif type == 'recipe':
        blog = Blog_recipe.query.get(id)
        if not blog:
            return jsonify({"error": "Recipe blog not found"}), 404
        blog.text_intro = data.get('text_intro', blog.text_intro)
        blog.text_ingredients = data.get('text_ingredients', blog.text_ingredients)
        blog.text_steps = data.get('text_steps', blog.text_steps)
    else:
        return jsonify({"error": "Invalid blog type"}), 400

    blog.title = title
    blog.img_header = img_header
    blog.img_final = img_final
    blog.source = source

    try:
        db.session.commit()
        return jsonify({"message": "Blog updated successfully", "blog_id": blog.id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


#[DELETE] Borrar Blog
@api.route('/delete_blog/<string:type>/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_blog(type, id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    if type == 'news':
        blog = Blog_news.query.get(id)
        if not blog:
            return jsonify({"error": "News blog not found"}), 404
    elif type == 'recipe':
        blog = Blog_recipe.query.get(id)
        if not blog:
            return jsonify({"error": "Recipe blog not found"}), 404
    else:
        return jsonify({"error": "Invalid blog type"}), 400

    db.session.delete(blog)
    db.session.commit()
    
    return jsonify({"message": "Blog deleted successfully"}), 200

#[GET] Ver todos los blogs
@api.route('/blog', methods=['GET'])
def get_all_blogs():
    news_blogs = Blog_news.query.all()
    recipe_blogs = Blog_recipe.query.all()
    
    all_blogs = news_blogs + recipe_blogs
    
    serialized_blogs = [blog.serialize() for blog in all_blogs]
    
    return jsonify({'msg': 'OK',
                    'data': serialized_blogs})


#[GET] Ver un blog (id)
@api.route('/blog/<string:type>/<int:id>', methods=['GET'])
def get_blog(type, id):
    
    if type == 'recipe':
        blog = Blog_recipe.query.get(id)
    elif type == 'news':
        blog = Blog_news.query.get(id)
    else:
        return jsonify({'msg': 'Blog type not recognized'}), 400

    if blog:
        serialized_blog = blog.serialize()
        return jsonify({'msg': 'OK', 'data': serialized_blog}), 200
    return jsonify({'msg': 'Blog not found'}), 404

#[GET] is_admin
@api.route('/check_admin', methods=['GET'])
@jwt_required()
def check_admin():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify({"is_admin": user.is_admin}), 200
    return jsonify({"error": "User not found"}), 404

#[GET] Listado del nombre de los bebés
@api.route('/babies', methods=['GET'])
@jwt_required()
def get_babies():
    user_id = get_jwt_identity()
    print(f'User ID: {user_id}')  # Mensaje de depuración para verificar el user_id

    try:
        # Verifica si el usuario existe
        user = User.query.get(user_id)
        if user is None:
            print('User not found')
            return jsonify({'error': 'User not found'}), 404

        # Verifica si el usuario tiene bebés asociados
        babies = Baby.query.filter_by(user_id=user_id).all()
        
        # Si no hay bebés, devuelve una lista vacía
        if not babies:
            print('No babies associated with user')
            return jsonify([])

        # Devuelve la lista de bebés
        return jsonify([{
            'id': baby.id,
            'name': baby.name
        } for baby in babies])

    except SQLAlchemyError as e:
        print(f'SQLAlchemy Error: {e}')
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        print(f'General Error: {e}')
        return jsonify({'error': 'Error fetching babies'}), 500


#[POST] Añadir datos al Report
@api.route('/report', methods=['POST'])
def add_report():
    data = request.get_json()

    try:
        baby_id = data.get('baby_id')
        baby = Baby.query.get(baby_id)
        if not baby:
            return jsonify({"error": "Baby not found"}), 404

        new_report = Report(
            date=datetime.strptime(data.get('date'), '%Y-%m-%d'),
            bedtime=data.get('bedtime'),
            meals=data.get('meals'),
            diapers=data.get('diapers'),
            walks=data.get('walks'),
            water=data.get('water'),
            meds=data.get('meds'),
            kindergarden=data.get('kindergarden'),
            extra=data.get('extra'),
            baby_id=baby_id  
        )
        
        db.session.add(new_report)
        db.session.commit()

        return jsonify(new_report.serialize()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    

#[PUT] Editar datos del Report
@api.route('/baby/<int:baby_id>/report/<int:report_id>', methods=['PUT'])
def edit_report(baby_id, report_id):
    data = request.get_json()
    report = Report.query.filter_by(id=report_id, baby_id=baby_id).first()

    if not report:
        return jsonify({"error": "Report not found for this baby"}), 404

    try:
        report.date = datetime.strptime(data.get('date', report.date.isoformat()), '%Y-%m-%d')
        report.bedtime = data.get('bedtime', report.bedtime)
        report.meals = data.get('meals', report.meals)
        report.diapers = data.get('diapers', report.diapers)
        report.walks = data.get('walks', report.walks)
        report.water = data.get('water', report.water)
        report.meds = data.get('meds', report.meds)
        report.kindergarden = data.get('kindergarden', report.kindergarden)
        report.extra = data.get('extra', report.extra)

        db.session.commit()

        return jsonify(report.serialize()), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    

#[GET] Ver todos los reports de un bebé
@api.route('/baby/<int:baby_id>/reports', methods=['GET'])
def get_reports(baby_id):
    baby = Baby.query.get(baby_id)
    if not baby:
        return jsonify({"error": "Baby not found"}), 404

    reports = [report.serialize() for report in baby.reports]  
    return jsonify(reports), 200


#[GET] Ver un report de un bebé (id)
@api.route('/baby/<int:baby_id>/<int:report_id>', methods=['GET'])
def get_report(baby_id, report_id):
    baby = Baby.query.get(baby_id)
    if not baby:
        return jsonify({"error": "Baby not found"}), 404
    
    report = Report.query.filter_by(id=report_id, baby_id=baby_id).first()
    if not report:
        return jsonify({"error": "Report not found for this baby"}), 404

    return jsonify(report.serialize()), 200


#[GET] Calcular avg
@api.route('/report/averages/<int:baby_id>', methods=['GET'])
def get_averages(baby_id):
    interval = request.args.get('interval')  
    
    if interval == 'weekly':
        days = 7
    elif interval == 'biweekly':
        days = 14
    elif interval == 'monthly':
        days = 30
    else:
        return jsonify({"error": "Invalid interval"}), 400

    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    reports = Report.query.filter(
        Report.baby_id == baby_id,
        Report.date >= start_date.date(),
        Report.date <= end_date.date()
    ).all()

    if not reports:
        return jsonify({"error": "No reports found"}), 404

    average_data = {
        "bedtime": sum(r.bedtime for r in reports) / len(reports),
        "meals": sum(r.meals for r in reports) / len(reports),
        "diapers": sum(r.diapers for r in reports) / len(reports),
        "walks": sum(r.walks for r in reports) / len(reports),
        "water": sum(r.water for r in reports) / len(reports),
    }

    return jsonify({"averages": average_data})


# [GET] Calcular min/max
@api.route('/report/extremes/<int:baby_id>', methods=['GET'])
def get_extremes(baby_id):
    interval = request.args.get('interval')

    if interval == 'weekly':
        days = 7
    elif interval == 'biweekly':
        days = 14
    elif interval == 'monthly':
        days = 30
    else:
        return jsonify({"error": "Invalid interval"}), 400

    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    reports = Report.query.filter(
        Report.baby_id == baby_id,
        Report.date >= start_date.date(),
        Report.date <= end_date.date()
    ).all()

    if not reports:
        return jsonify({"error": "No reports found"}), 404

    max_data = {
        "bedtime": max(r.bedtime for r in reports),
        "meals": max(r.meals for r in reports),
        "diapers": max(r.diapers for r in reports),
        "walks": max(r.walks for r in reports),
        "water": max(r.water for r in reports),
    }

    min_data = {
        "bedtime": min(r.bedtime for r in reports),
        "meals": min(r.meals for r in reports),
        "diapers": min(r.diapers for r in reports),
        "walks": min(r.walks for r in reports),
        "water": min(r.water for r in reports),
    }

    return jsonify({"max": max_data, "min": min_data})
  
  
# [POST] agregar imagen
UPLOAD_FOLDER = 'uploads'
# Asegúrate de que la carpeta de uploads existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
@api.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    filename = secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    return jsonify({"filePath": f"/uploads/{filename}"})

@api.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


#Ruta para Ver la Información de un Perfil
@api.route('/userinfo', methods=['GET'])
@jwt_required()
def user_info():
    user_id=get_jwt_identity() #aqui te devuelve la identidad del usuario almacenada en el token JWT, pero esa identidad normalmente es solo un ID (o algún identificador) del usuario, no el objeto User completo. 
    #necesario realizar una consulta a la base de datos para recuperar la información completa del usuario a partir de ese ID
    user = User.query.get(user_id)
    if user:
        return jsonify({'success': True, 'user': user.serialize()}), 200
    else:
        return jsonify({'success': False, 'msg': 'Usuario no encontrado'}), 404


# Ruta para cambio de contraseña con un user autenticado
@api.route("/changepassword", methods=['PATCH'])
@jwt_required()
def user_change_password():
    user_id=get_jwt_identity() #con este user_id tomamos los datos del user
    user=User.query.filter_by(id=user_id).first()
    #si el user no encontrado
    if user is None:
        return jsonify({"msg":"User no encontrado"}), 404

    body=request.get_json()
    new_password=bcrypt.generate_password_hash(body["password"]).decode('utf-8')
    #nueva password encriptada, actualizamos la db
    user.password=new_password
    db.session.add(user)
    if get_jwt()["type"]=="password":
        jti=get_jwt()["jti"]
        token_blocked= TokenBlockedList(jti=jti)
        db.session.flush()
        db.session.add(token_blocked)
    db.session.commit()
    return jsonify ({"msg":"clave actualizada"})

#solicitar recuperación de contraseña
@api.route("/requestpasswordrecovery", methods=['POST'])
def request_password_recovery():
    #buscamos el correo del user
    email=request.get_json()['email']
    user=User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"msg":"User no encontrado"}), 404
    
    #generamos una pequeña sesion del user
    password_token=create_access_token(identity=user.id, additional_claims={"type":"password"})
    url=os.getenv("FRONTENT_URL")
    url=url+"/reset_password?token="+password_token
    #aqui debe enviarse el token en una url para su uso en el frontend
    ####ENVIO DE CORREO
    # service_id= os.getenv("MAIL_SERVICE_ID")
    # template_id= os.getenv("MAIL_TEMPLATE_ID")
    # user_id=os.getenv("MAIL_USER_ID")
    # send_mail_url=os.getenv("MAIL_SEND_URL")
  
    # Datos a enviar
    data = {
        'service_id': os.getenv('MAIL_SERVICE_ID'),
        'template_id': os.getenv('MAIL_TEMPLATE_ID'),
        'user_id': os.getenv('MAIL_USER_ID'),
        'template_params': {'url': url}
    }
    print(data)

    # Encabezados
    headers = {'Content-Type': 'application/json' }
    send_mail_url = os.getenv('MAIL_SEND_URL')

    # Realizar la solicitud POST
    response = requests.post(send_mail_url, data=json.dumps(data), headers=headers)
    
    print(response.text)
    print(url)
    if response.status_code == 200:
        return jsonify({"msg": "Revise su email para el cambio de contraseña"})
    else:
        return jsonify({"msg": "Ocurrio un error con el envio de correo"}), 400

@api.route("/changepassworduser", methods=['PATCH'])
@jwt_required()
def change_password():
    try:
        user_id = get_jwt_identity()  # Obtener ID del usuario autenticado
        user = User.query.filter_by(id=user_id).first()

        if user is None:
            return jsonify({"msg": "User not found"}), 404

        body = request.get_json()

        # Verificar que la contraseña actual y la nueva estén presentes
        current_password = body['current_password']
        new_password = body['new_password']

        if 'current_password' not in body or 'new_password' not in body:
            return jsonify({"msg": "Current password and new password are required"}), 400


        # Verificar la contraseña actual
        if not bcrypt.check_password_hash(user.password, current_password):
            return jsonify({"msg": "Current password is incorrect"}), 401

        # Validar la nueva contraseña
        if len(new_password) < 6:
            return jsonify({"msg": "New password must be at least 6 characters long"}), 400

        # Hashear y actualizar la nueva contraseña
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.password = hashed_password

        if get_jwt()["type"] == "password":
            jti = get_jwt()["jti"]
            token_blocked = TokenBlockedList(jti=jti)
            db.session.add(token_blocked)

        db.session.commit()

        return jsonify({"msg": "Password updated successfully"}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

#agregar un bebé a un usuario
@api.route('/babies/user/<int:user_id>', methods=['POST'])
def add_baby(user_id):
    data = request.get_json()
    
    # Validar que el usuario proporcione todos los campos requeridos
    if not data or not 'name' in data or not 'gender' in data:
        return jsonify({"error": "Missing data"}), 400

    # Verificar si el usuario existe
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_baby = Baby(
        name=data['name'],
        gender=data['gender'],
        age=data.get('age', 0),  # Valor por defecto en 0 si no se proporciona
        height=data.get('height', 0.0),  # Valor por defecto en 0.0 si no se proporciona
        weight=data.get('weight', 0.0),  # Valor por defecto en 0.0 si no se proporciona
        avatar_path=data.get('avatar_path', None),
        user_id=user_id
    )

    try:
        db.session.add(new_baby)
        db.session.commit()
        return jsonify(new_baby.serialize()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500