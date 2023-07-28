import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression, Lasso, Ridge, LogisticRegression
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import PolynomialFeatures
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import json


# Plot the original data and predicted values
def get_graph_data(datapath):
    # Load data from CSV file
    data = pd.read_csv(datapath)

    # Extract input features (X) and target variable (y)
    X = data[["voltage", "current"]]  # Update with your column names
    y = data["power"]  # Update with your column name

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Create a linear regression model
    linear_model = LinearRegression()
    
    linear_model.fit(X_train, y_train)
    model_filename = 'linear_model.pkl'
    with open(model_filename, 'wb') as file:
        pickle.dump(linear_model, file)
        
    linear_y_pred = linear_model.predict(X_test)
    linear_mse = mean_squared_error(y_test, linear_y_pred)
    linear_r2 = r2_score(y_test, linear_y_pred)

    # Create a polynomial regression model
    polynomial_features = PolynomialFeatures(degree=2)
    X_train_poly = polynomial_features.fit_transform(X_train)
    X_test_poly = polynomial_features.transform(X_test)
    poly_model = LinearRegression()
    poly_model.fit(X_train_poly, y_train)
    
    model_filename = 'polynomial_features.pkl'
    with open(model_filename, 'wb') as file:
        pickle.dump(polynomial_features, file)
    
    poly_y_pred = poly_model.predict(X_test_poly)
    poly_mse = mean_squared_error(y_test, poly_y_pred)
    poly_r2 = r2_score(y_test, poly_y_pred)
    
    print(poly_y_pred)
    # Create a Lasso regression model
    lasso_model = Lasso()
    lasso_model.fit(X_train, y_train)
    
    linear_model.fit(X_train, y_train)
    model_filename = 'lasso_model.pkl'
    with open(model_filename, 'wb') as file:
        pickle.dump(lasso_model, file)
    
    lasso_y_pred = lasso_model.predict(X_test)
    lasso_mse = mean_squared_error(y_test, lasso_y_pred)
    lasso_r2 = r2_score(y_test, lasso_y_pred) 
    # Create a Ridge regression model
    ridge_model = Ridge()
    
    linear_model.fit(X_train, y_train)
    model_filename = 'ridge_model.pkl'
    with open(model_filename, 'wb') as file:
        pickle.dump(ridge_model, file)
        
    ridge_model.fit(X_train, y_train)
    ridge_y_pred = ridge_model.predict(X_test)
    ridge_mse = mean_squared_error(y_test, ridge_y_pred)
    ridge_r2 = r2_score(y_test, ridge_y_pred)
    # Organize data into a JSON-friendly format
    data = []
    data.append({
        "label": "Original Data",
        "color": "blue",
        "voltage": X["voltage"].values.tolist(),
        "values": y.values.tolist()
    })

    # Add data for each regression model
    models = [
        {"label": "Linear Regression", "color": "red", "values": linear_y_pred.tolist()},
        {"label": "Polynomial Regression", "color": "green", "values": poly_y_pred.tolist()},
        {"label": "Lasso Regression", "color": "yellow", "values": lasso_y_pred.tolist()},
        {"label": "Ridge Regression", "color": "gray", "values": ridge_y_pred.tolist()},
    ]

    data.extend(models)
    # return data

def compare_ml_algorithms(datapath):
    get_graph_data(datapath)
    data = pd.read_csv(datapath)

    # Extract input features (X) and target variable (y)
    X = data[data.columns[:-1]]  # Update with your column names
    y = data[data.columns[-1]]  # Update with your column name

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Create a linear regression model
    linear_model = LinearRegression()
    linear_model.fit(X_train, y_train)
    
    linear_y_pred = linear_model.predict(X_test)
    linear_r2 = r2_score(y_test, linear_y_pred)

    # Create a polynomial regression model
    polynomial_features = PolynomialFeatures(degree=2)
    X_train_poly = polynomial_features.fit_transform(X_train)
    X_test_poly = polynomial_features.transform(X_test)
    poly_model = LinearRegression()
    poly_model.fit(X_train_poly, y_train)
    
    poly_y_pred = poly_model.predict(X_test_poly)
    poly_r2 = r2_score(y_test, poly_y_pred)
    
    # Create a Lasso regression model
    lasso_model = Lasso()
    lasso_model.fit(X_train, y_train)
    
    lasso_y_pred = lasso_model.predict(X_test)
    lasso_r2 = r2_score(y_test, lasso_y_pred) 
    
    # Create a Ridge regression model
    ridge_model = Ridge()
    ridge_model.fit(X_train, y_train)
        
    ridge_y_pred = ridge_model.predict(X_test)
    ridge_r2 = r2_score(y_test, ridge_y_pred)

    # Determine the model with the best accuracy
    best_model = max([("Linear Regression", linear_r2,linear_model),
                            # ("Polynomial Regression", poly_r2,poly_model),
                            ("Lasso Regression", lasso_r2,lasso_model),
                            ("Ridge Regression", ridge_r2,ridge_model)],
                     key=lambda x: x[1])

    print("Results:")
    for model, accuracy,model_data in [("Linear Regression", linear_r2,lasso_y_pred),
                            ("Polynomial Regression", poly_r2,poly_y_pred),
                            ("Lasso Regression", lasso_r2,lasso_y_pred),
                            ("Ridge Regression", ridge_r2,ridge_y_pred)]:
        print(f"{model}: R-squared = {accuracy:.4f}")

    print(f"\nThe model with the best accuracy is {best_model[0]} with R-squared = {best_model[1]:.4f}")

    # Save the best model
    with open('best_model.pkl', 'wb') as file:
        pickle.dump(best_model[2], file)
    
    # Organize data into a JSON-friendly format
    data = best_model[2]
    # return data,X_test,y_test

def predict_data(path):
    # get_graph_data(path)
    # compare_ml_algorithms(path)
    df=pd.read_csv(path)
    file_path = './best_model.pkl'
    with open(file_path, 'rb') as file:
        loaded_data = pickle.load(file)
    X_test,y_test = df[df.columns[:-1]],df[df.columns[-1]]
    loaded_data.predict(X_test)
    print(df.columns[-1])
    result=pd.concat([pd.DataFrame(y_test,columns= [(df.columns[-1])]), X_test.reset_index(drop=True)],axis=1)
   
    result.to_json(path_or_buf = './processed.json',orient='records',indent=2)

    with open('processed.json','r') as fp:
        return json.load(fp)


# print(predict_data("uploads\\user1\\data.csv"))


