import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.compose import ColumnTransformer

def scale_features_file(file_path, method="standard"):
    df = pd.read_csv(file_path)

    continuous_numeric_cols = [
        col for col in df.columns
        if df[col].dtype in ['int64', 'float64'] and df[col].nunique() > 10
    ]

    binary_cols = [
        col for col in df.columns
        if df[col].dtype in ['int64', 'float64'] and sorted(df[col].unique()) == [0, 1]
    ]

    if not continuous_numeric_cols:
        return {
            "message": "No continuous numeric columns to scale.",
            "data": df.head(10).to_dict(orient="records"),
            "columns": df.columns.tolist()
        }

    if method == "minmax":
        scaler = MinMaxScaler()
    else:
        scaler = StandardScaler()

    ct = ColumnTransformer(
        transformers=[('scaler', scaler, continuous_numeric_cols)],
        remainder='passthrough'
    )

    scaled_array = ct.fit_transform(df)

    remaining_cols = [col for col in df.columns if col not in continuous_numeric_cols]
    new_columns = continuous_numeric_cols + remaining_cols

    df_scaled = pd.DataFrame(scaled_array, columns=new_columns)

    return {
        "message": f"Scaling applied using {'MinMaxScaler' if method == 'minmax' else 'StandardScaler'}.",
        "scaled_columns": new_columns,
        "data": df_scaled.to_dict(orient="records")
    }
