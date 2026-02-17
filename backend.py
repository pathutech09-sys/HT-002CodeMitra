from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import datetime
import sys
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# Permissive CORS for hackathon development environment
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


# =========================
# PostgreSQL Connection Function
# =========================
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="fitmitra_holistic_health_companion2",
        user="postgres",
        password="root@123",
        port="5432"
    )


@app.after_request
def add_security_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
    response.headers["Access-Control-Allow-Private-Network"] = "true"
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    return response


@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    if request.method == 'OPTIONS':
        return make_response('', 204)
    return jsonify({"status": "online"}), 200


# =========================
# REGISTER USER
# =========================
@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return make_response('', 204)

    try:
        data = request.json

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (username, email, password)
        )

        user_id = cursor.fetchone()[0]

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "user_id": user_id})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# =========================
# LOGIN USER
# =========================
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return make_response('', 204)

    try:
        data = request.json

        email = data.get('email')
        password = data.get('password')

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute(
            "SELECT * FROM users WHERE email = %s AND password_hash = %s",
            (email, password)
        )

        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:
            return jsonify({"status": "error", "message": "Invalid credentials"}), 401

        return jsonify({"status": "success", "user": user})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# =========================
# FETCH USER DATA
# =========================
@app.route('/api/user/<int:user_id>/data', methods=['GET', 'OPTIONS'])
def get_data(user_id):
    if request.method == 'OPTIONS':
        return make_response('', 204)

    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404

        return jsonify({"status": "success", "data": user})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# =========================
# ADD WORKOUT
# =========================
@app.route('/api/workout', methods=['POST'])
def add_workout():
    try:
        data = request.json

        user_id = data.get('user_id')
        type = data.get('type')
        duration = data.get('duration')
        calories = data.get('calories_burned')

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO workouts (user_id, type, duration, calories_burned)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """, (user_id, type, duration, calories))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": "Workout added"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# =========================
# GET WORKOUTS BY USER
# =========================
@app.route('/api/workouts/<int:user_id>', methods=['GET'])
def get_workouts(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT * FROM workouts
            WHERE user_id = %s
            ORDER BY date DESC
        """, (user_id,))

        workouts = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({"status": "success", "data": workouts})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# =========================
# DELETE WORKOUT
# =========================
@app.route('/api/workout/<int:id>', methods=['DELETE'])
def delete_workout(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM workouts WHERE id = %s", (id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": "Workout deleted"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == '__main__':
    print("\n" + "="*40)
    print(" FITMITRA DATA BACKEND RUNNING")
    print(" URL: http://localhost:5000")
    print("="*40 + "\n")
    sys.stdout.flush()
    app.run(debug=True, host='0.0.0.0', port=5000)
