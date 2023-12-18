import json
from datetime import datetime, timezone

from flask import Response


# Test routes (Mock API)

def get_locations():
    # Get locations to later fetch reviews by locations
    # Sample response based on https://mybusiness.googleapis.com/v4/{parent=accounts/*}/locations
    with open('locations.json', 'r') as file:
        data = json.load(file)

    return Response(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )


def get_latest_reviews():
    # Get top 50 reviews for all specified locations.
    with open('reviews.json', 'r') as file:
        data = json.load(file)

    return Response(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )


def update_review(complete_review_id, comment):

    status = {
            "message": "Error occurred"
        }

    # Read dummy data json and store in dict
    with open('reviews.json', 'r') as file:
        data = json.load(file)

    updated_reply = {}

    # For simplicity using latest reviews data i.e. updating paginated and/or location based reviews might have a
    # different format requiring code changes.

    # Update dict if value found
    for review in data['locationReviews']:
        if review['review']['name'] == complete_review_id:
            updated_reply = {
                "comment": comment,
                "updateTime": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
            }
            review['review']['reviewReply'] = updated_reply
            status['message'] = "Update success"
            break

    # Write update to dummy JSON
    with open('reviews.json', 'w') as file:
        json.dump(data, file, indent=2)

    # Append updated reply to status
    status.update(updated_reply)

    return Response(
        response=json.dumps(status),
        status=200,
        mimetype='application/json'
    )


def delete_review(complete_review_id):

    status = {
            "message": "Error occurred"
        }

    # Read dummy data json and store in dict
    with open('reviews.json', 'r') as file:
        data = json.load(file)

    updated_reply = {}

    # For simplicity using latest reviews data i.e. updating paginated and/or location based reviews might have a
    # different format requiring code changes.

    # Clear dict if value found
    for review in data['locationReviews']:
        if review['review']['name'] == complete_review_id:
            review['review']['reviewReply'] = {}
            status['message'] = "Delete success"
            break

    # Write update to dummy JSON
    with open('reviews.json', 'w') as file:
        json.dump(data, file, indent=2)

    return Response(
        response=json.dumps(status),
        status=200,
        mimetype='application/json'
    )