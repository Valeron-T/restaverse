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
# from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import google.oauth2.credentials

# Initialise Flask and CORS
app = Flask("Reviews backend")
cors = CORS(app)

# If debug is enabled all requests will be made to the mock API
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
            # "https://www.googleapis.com/auth/drive",  # Only for testing purposes
            "https://www.googleapis.com/auth/business.manage",
            "openid"],
    redirect_uri=f"{os.getenv('BACKEND_URL')}/callback"
)


# Wrapper function which calls destination function only if jwt token is present client side.
# It does not validate authenticity of the token
def login_is_required(function):
    def wrapper(*args, **kwargs):
        try:
            encoded_jwt = request.headers.get("Authorization").split("Bearer ")[1]
        except AttributeError as e:
            # If this header doesn't exist in request, then return Bad Format
            return abort(400)

        # If jwt is not present then return Unauthorised
        if encoded_jwt is None:
            return abort(401)
        else:
            return function()

    # Important to be able to apply same wrapper to multiple functions
    wrapper.__name__ = function.__name__
    return wrapper


def Generate_JWT(payload):
    encoded_jwt = jwt.encode(payload, app.secret_key, algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt


# Returns a Google oauth url for redirection
@app.route("/login")
def login():
    authorization_url, state = flow.authorization_url(access_type='offline')
    session["state"] = state
    return Response(
        response=json.dumps({'auth_url': authorization_url}),
        status=200,
        mimetype='application/json'
    )


# Calls this method after user signs into Google which returns a JWT for storing in client browser.
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

    # session["google_id"] = id_info.get("sub")
    # session["name"] = id_info.get("name")

    del id_info['aud']
    jwt_token = Generate_JWT(session["credentials"])
    return redirect(f"{FRONTEND_URL}/?jwt={jwt_token}&user={id_info['name']}&email={id_info['email']}")


def decodejwt(encoded_jwt):
    print(encoded_jwt)
    try:
        credentials_dict = jwt.decode(encoded_jwt, app.secret_key, algorithms=[os.getenv("ALGORITHM")])
        print(credentials_dict)

        credentials = google.oauth2.credentials.Credentials(
            credentials_dict["token"],
            refresh_token=credentials_dict["refresh_token"],
            token_uri=credentials_dict["token_uri"],
            client_id=credentials_dict["client_id"],
            client_secret=credentials_dict["client_secret"],
            scopes=credentials_dict["scopes"])

        print(credentials)
    except Exception as e:
        return Response(
            response=json.dumps({"message": "Decoding JWT Failed", "exception": e.args}),
            status=500,
            mimetype='application/json'
        )

    return credentials


# Method for testing API access
@app.route("/test")
@login_is_required
def test():
    encoded_jwt = request.headers.get("Authorization").split("Bearer ")[1]

    credentials = decodejwt(encoded_jwt)

    # drive = googleapiclient.discovery.build(
    #     "drive", "v2", credentials=credentials)
    #
    # files = drive.files().list().execute()
    # print(files)

    # list account details using Google business API - returns Quota exceeded which is normal if Business API is disabled on the account
    accs = googleapiclient.discovery.build("mybusinessaccountmanagement", "v1", credentials=credentials)
    accname = accs.accounts().list().execute()
    print(accname)

    return jsonify({"message": "Test called"}), 200


# List all locations linked to the user's account
@app.route("/locations", methods=["GET"])
@login_is_required
def location():
    return routes.get_locations()


# Gets latest 50 reviews across all locations.
@app.route("/reviews/latest", methods=["GET"])
@login_is_required
def latest_reviews():
    return routes.get_latest_reviews()


@app.route("/reviews/reply", methods=['PUT'])
@login_is_required
def reply_to_review():
    if request.method == 'PUT':
        # Access the JSON data sent with the POST request
        data = request.json

        print(data)

        # Process the received data
        if data:
            rid = data.get('rid')
            reply = data.get('reply')
            response = routes.update_review(rid, reply)
            return response
        else:
            return jsonify({'message': 'No JSON data received'}), 400


@app.route("/reviews/delete", methods=['DELETE'])
@login_is_required
def delete_review():
    if request.method == 'DELETE':
        # Access the JSON data sent with the POST request
        data = request.json

        # Process the received data
        if data:
            rid = data.get('rid')
            response = routes.delete_review(rid)
            return response
        else:
            return jsonify({'message': 'No JSON data received'}), 400


@app.route("/logout", methods=["GET"])
@login_is_required
def logout():
    print("Executing logout")
    session.clear()
    encoded_jwt = request.headers.get("Authorization").split("Bearer ")[1]

    credentials = decodejwt(encoded_jwt)
    print(f"creds: {credentials.token}")
    revoke = requests.post('https://oauth2.googleapis.com/revoke',
                           params={'token': credentials.token},
                           headers={'content-type': 'application/x-www-form-urlencoded'})

    status_code = getattr(revoke, 'status_code')
    if status_code == 200:
        return jsonify({"message": 'Credentials successfully revoked.'}), 200
    else:
        return jsonify({"message": 'Error revoking credentials'}), 500


@app.route('/', methods=['GET'])
def hello_world():
    response = {
        "Message": f"Server running with debug status: {os.getenv('DEBUG')}"
    }
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=os.getenv("DEBUG"), host="0.0.0.0")
