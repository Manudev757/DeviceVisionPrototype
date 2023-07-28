from flask import *
from flask_cors import CORS, cross_origin
import dask.dataframe as dd
import pandas as pd
import json
import os 
import uuid
from flask_socketio import SocketIO,emit


from ml import compare_ml_algorithms,predict_data

global limit

app = Flask(__name__)
cors = CORS(app)
# socketio = SocketIO(app,cors_allowed_origins=['http://localhost:5173'])

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['LIMIT'] = 100
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000
undo = []
redo = []
limit = 100

# @app.route("/")
# @cross_origin()
# def home_page():
    
#     return render_template("index.html")


# @socketio.on('connect')
# @cross_origin()
# def handle_message():
#     print("Client Connected......................")
#     emit('messageReceived', {'text': 'Server says: Connected to server!'})
#     return {'message':'1'}


# @socketio.on('fromClient')
# def handle_send_message(message):
#     print('Received message:', message)
#     # Process the message here if needed
#     return {'message':'1'}

# @app.route("/getcsv", methods=['GET'])
# @cross_origin()
# def get_csv():
#     """This api call saves the user file in the server"""
#     with open("user_files\\data.json") as fp:
#          df = json.load(fp)
         
    
    
#     return {"content": df,"column": [val for val in df[0].keys()]}
     
     

@app.route("/dropdownvalue", methods=['POST'])
def drop_down_value():
    json_details = request.json;result=[]
    for data in json_details:
        if data not in result:
            result.append(data)

    
    df = pd.DataFrame({})
    
    json_file = pd.read_json("./processed.json")
    json_file.to_csv('processed.csv')

    print(result)
    csv_file = dd.read_csv('./processed.csv')
    for col in result:
        for j in col: 
            df[col[j]] = csv_file[j]

    #     df[col.keys()[0]] = csv_file[column_value]
    
    # print((df.to_json(orient='records')))
    return  json.loads(df.to_json(orient='records'))
    
        

@app.route("/csvfile",methods=['POST'])
@cross_origin()
def send_file():
    """Sending the file from the frontend to backend"""
    
    
        # user_file = request.data 
        # zip_data = zlib.decompress(user_file)
        # print(zip_data)
    print("Inside flask")
    user_file = request.files['file']
    user_file.save("uploads\\user1\\"+user_file.filename)     
    
    csv_file = dd.read_csv("uploads\\user1\\"+user_file.filename)
    csv_file.compute().to_json("user_files\\user1\\data.json", indent=2, orient ='records', compression = 'infer',lines=False)   
    with open("user_files\\user1\\data.json") as fp:
        df = json.load(fp)
        
    # app.config["incrementor"] =  len(df)//10 
    results  = {"content":df,"id": str(uuid.uuid1()), "columns":[val for val in df[0].keys()]}

    global df1
    df1 = json.dumps(results,indent=2)

    with open("user_files\\user1\\data.json","w") as fp:
        fp.write(df1)
    
    # length = int(app.config['LIMIT'])
    # print(type(df1))
    # app.config['last index'] = len(df1["content"][:length])-1
    # return df1["content"][:length]  

    # with open("user_files\\user1\\data.json","r") as fp:
    #     return fp

    with open("user_files\\user1\\data.json") as fp:
        df = json.load(fp)
        
    # print(predict_data("uploads\\user1\\data.csv"))  
    return {"ml":compare_ml_algorithms("uploads\\user1\\sdata.csv"),"csv":df}
    # return predict_data("uploads\\user1\\data.csv")
    # except Exception as e:

        
    #     print(e)
    #     return '202'
    
@app.route("/actualcsv", methods =['POST'])
@cross_origin()
def actual_csv():
    user_file = request.files['files']
    user_file.save("actual_csv\\user1\\"+user_file.filename)   
    predict_data("actual_csv\\user1\\"+user_file.filename)
    csv_file = dd.read_csv("actual_csv\\user1\\"+user_file.filename)
    csv_file.compute().to_json("actual_user_files\\user1\\data.json", indent=2, orient ='records', compression = 'infer',lines=False)   
    with open("actual_user_files\\user1\\data.json") as fp:
        df = json.load(fp)
    

    results  = {"content":df,"id": str(uuid.uuid1()),"columns":[val for val in df[0].keys()]}
    

    return results
# @app.route("scroll-data",method=['GET'])
# @cross_origin()
# def scroll_data():
#     """"""
    

   
    
# 
# @app.route("/edit_columns", methods=['POST'])
# def edit_columns():
#     """This api call is for editing and creating the new csv file"""
#     df = dd.read_csv("uploads\\numeric_dataset.csv")
#     selected_csv_data = request.json

#     for data_set in selected_csv_data:
#         df.drop(label=data_set, axis=1)
#         undo.append({"drop": data_set, "axis": 1})

#     df.to_csv("user_files\\edited_file.csv", index=False)

#     return 200

# @app.route("/undo", methods = ['POST'])
# def undo_actions():
    
#     data_action = undo[-1]
#     redo.append(data_action)
#     undo.pop()
#     df = dd.read_csv("user_files\\numeric_dataset.csv")
#     for actions in undo:
        
#         df.drop(label=actions["drop"], axis=actions["axis"])
        
        
#     df.to_csv("user_files\\edited_file.csv", index=False)
    

if __name__ == '__main__':
    """Running the server"""
    app.run(port=3000,debug=True)
    