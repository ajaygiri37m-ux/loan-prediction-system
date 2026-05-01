from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load everything
model = joblib.load("../Model/model.pkl")
columns = joblib.load("../Model/columns.pkl")
scaler = joblib.load("../Model/scaler.pkl")


# Preprocess input
def preprocess_input(data):
    df = pd.DataFrame([data])

    # One-hot encoding
    df = pd.get_dummies(df)

    # Match training columns
    df = df.reindex(columns=columns, fill_value=0)

    # Apply scaling
    df = scaler.transform(df)

    return df


@app.route("/")
def home():
    return "Loan Prediction API Running 🚀"


@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("API HIT")

        data = request.get_json()
        print("DATA:", data)

        # Convert numeric fields
        data['ApplicantIncome'] = float(data['ApplicantIncome'])
        data['CoapplicantIncome'] = float(data['CoapplicantIncome'])
        data['LoanAmount'] = float(data['LoanAmount'])
        data['Loan_Amount_Term'] = float(data['Loan_Amount_Term'])
        data['Credit_History'] = float(data['Credit_History'])

        # Preprocess
        processed = preprocess_input(data)
        print("PROCESSED:", processed)

        # Prediction
        prob = model.predict_proba(processed)[0][1]
        print("PROB:", prob)

        approved = bool(prob > 0.4)

        # ✅ FIXED RESPONSE
        return jsonify({
            "approved": approved,
            "probability": [float(1 - prob), float(prob)]
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
