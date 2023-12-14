import json
import pathlib
import test_routes
import prod_routes
import googleapiclient
import jwt
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from flask import Flask, jsonify, session, abort, redirect, request, Response
from flask_cors import CORS, cross_origin
import os
import requests
from pip._vendor import cachecontrol
import google.auth.transport.requests
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import google.oauth2.credentials

app = Flask("Reviews backend")
cors = CORS(app)

if os.getenv("DEBUG"):
    routes = test_routes
else:
    routes = prod_routes

app.secret_key = os.getenv("SECRET_KEY")  # make sure this matches with that's in client_secret.json

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # to allow Http traffic for local dev

FRONTEND_URL = os.getenv("FRONTEND_URL")
GOOGLE_CLIENT_ID = os.getenv("CLIENT_ID")
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/drive.metadata.readonly",  # Only for testing purposes
            "https://www.googleapis.com/auth/business.manage",
            "openid"],
    redirect_uri="http://localhost:5000/callback"
)


def login_is_required(function):
    def wrapper(*args, **kwargs):
        try:
            encoded_jwt = request.headers.get("Authorization").split("Bearer ")[1]
        except AttributeError as e:
            return abort(400)

        if encoded_jwt is None:
            return abort(401)
        else:
            return function()

    wrapper.__name__ = function.__name__
    return wrapper


def Generate_JWT(payload):
    encoded_jwt = jwt.encode(payload, app.secret_key, algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt


@app.route("/login")
def login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return Response(
        response=json.dumps({'auth_url': authorization_url}),
        status=200,
        mimetype='application/json'
    )


@app.route("/callback")
def callback():
    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes}
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID,
        clock_skew_in_seconds=2  # Prevents token used too early error
    )

    session["google_id"] = id_info.get("sub")
    session["name"] = id_info.get("name")
    print(id_info['email'])
    print(session['google_id'])

    del id_info['aud']
    # jwt_token = Generate_JWT(id_info)
    jwt_token = Generate_JWT(session["credentials"])
    return redirect(f"{FRONTEND_URL}/?jwt={jwt_token}&user={session['name']}&email={id_info['email']}")


@app.route("/protected_area")
# @login_is_required
def protected_area():
    return redirect("http://localhost:5173/reviews")


@app.route("/home")
# @login_is_required
def home_page_user():
    encoded_jwt = request.headers.get("Authorization").split("Bearer ")[1]
    try:
        decoded_jwt = jwt.decode(encoded_jwt, app.secret_key, algorithms=[os.getenv("ALGORITHM")])
        print(decoded_jwt)
    except Exception as e:
        return Response(
            response=json.dumps({"message": "Decoding JWT Failed", "exception": e.args}),
            status=500,
            mimetype='application/json'
        )

    return Response(
        response=json.dumps(decoded_jwt),
        status=200,
        mimetype='application/json'
    )


def decodejwt(encoded_jwt):
    print(encoded_jwt)
    try:
        decoded_jwt = jwt.decode(encoded_jwt, app.secret_key, algorithms=[os.getenv("ALGORITHM")])
        print(decoded_jwt)
    except Exception as e:
        return Response(
            response=json.dumps({"message": "Decoding JWT Failed", "exception": e.args}),
            status=500,
            mimetype='application/json'
        )

    return decoded_jwt


@app.route("/events")
@login_is_required
def events():
    encoded_jwt = request.headers.get("Authorization").split("Bearer ")[1]

    credentials_dict = decodejwt(encoded_jwt)

    credentials = google.oauth2.credentials.Credentials(
        credentials_dict["token"],
        refresh_token=credentials_dict["refresh_token"],
        token_uri=credentials_dict["token_uri"],
        client_id=credentials_dict["client_id"],
        client_secret=credentials_dict["client_secret"],
        scopes=credentials_dict["scopes"])

    print(credentials)
    drive = googleapiclient.discovery.build(
        "drive", "v2", credentials=credentials)

    files = drive.files().list().execute()
    print(files)

    # accs = googleapiclient.discovery.build("mybusinessaccountmanagement","v1", credentials=credentials)
    # accname = accs.accounts().list().execute()
    # print(accname)

    return {"message":"Events called"}


@app.route("/locations")
@login_is_required
def location():
    return routes.get_locations()

@app.route("/reviews/latest")
@login_is_required
def latest_reviews():
    return routes.get_latest_reviews()

@app.route("/reviews/reply", methods=['POST'])
# @login_is_required
def reply_to_review():
    if request.method == 'POST':
        # Access the JSON data sent with the POST request
        data = request.json

        # Process the received data
        if data:
            rid = data.get('rid')
            reply = data.get('reply')
            # Perform any processing required

            # Return a response
            response = routes.update_review(rid, reply)
            return response
        else:
            return jsonify({'message': 'No JSON data received'}), 400

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route('/', methods=['GET'])
def hello_world():
    response = {
        "Message": f"Server running with debug status: {os.getenv('DEBUG')}"
    }
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=os.getenv("DEBUG"))