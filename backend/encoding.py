import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

def one_hot_encode_file(file_path):
    df = pd.read_csv(file_path)

    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    original_columns = df.columns.tolist()

    # Set OneHotEncoder with fallback
    try:
        encoder = OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore')
    except TypeError:
        encoder = OneHotEncoder(drop='first', sparse=False, handle_unknown='ignore')

    # Setup ColumnTransformer
    ct = ColumnTransformer(
        transformers=[
            ('onehot', encoder, categorical_cols)
        ],
        remainder='passthrough'
    )

    # Fit and transform
    transformed_array = ct.fit_transform(df)

    # Try to get feature names
    try:
        feature_names = ct.named_transformers_['onehot'].get_feature_names_out(categorical_cols)
    except AttributeError:
        try:
            feature_names = ct.named_transformers_['onehot'].get_feature_names(categorical_cols)
        except AttributeError:
            # Fallback: Use generic names if no method is available
            feature_names = [f"{col}_{i}" for col in categorical_cols for i in range(len(df[col].unique()) - 1)]

    non_cat_cols = [col for col in df.columns if col not in categorical_cols]
    final_columns = list(feature_names) + non_cat_cols

    # Create final DataFrame
    df_encoded = pd.DataFrame(transformed_array, columns=final_columns)

    # Clean up values
    df_encoded.replace([np.inf, -np.inf], np.nan, inplace=True)
    df_encoded.fillna(0, inplace=True)

    return {
        "original_columns": original_columns,
        "encoded_columns": final_columns,
        "processed_dataset": df_encoded.to_dict(orient="records"),
    }
