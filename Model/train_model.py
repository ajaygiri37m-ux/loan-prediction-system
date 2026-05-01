import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

# Load dataset
df = pd.read_csv("loan_data.csv")

# Target conversion
df['Loan_Status'] = df['Loan_Status'].map({'Y': 1, 'N': 0})

# Drop ID
df = df.drop('Loan_ID', axis=1)

# Handle missing
df = df.dropna()

# One-hot encoding
df = pd.get_dummies(df)

# Split
X = df.drop('Loan_Status', axis=1)
y = df['Loan_Status']

# Save columns BEFORE scaling
columns = X.columns.tolist()

# Scale
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# Train model
model = XGBClassifier()
model.fit(X_train, y_train)

# Save everything
joblib.dump(model, "model.pkl")
joblib.dump(columns, "columns.pkl")
joblib.dump(scaler, "scaler.pkl")

print("✅ Model trained and saved!")
print(df["LoanAmount"].describe())