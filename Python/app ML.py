from flask import *
from flask_cors import CORS, cross_origin
import dask.dataframe as dd
import json
from ml import compare_ml_algorithms

global undo
global redo


app = Flask(__name__, template_folder="./templates", static_folder="./static")
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

undo = []
redo = []


# @app.route("/")
# @cross_origin()
# def home_page():

#     return render_template("index.html")


@app.route("/getcsv", methods=["GET"])
@cross_origin()
def get_csv():
    """This api call saves the user file in the server"""

    with open("user_files\\user1\\data.json") as fp:
        df = json.load(fp)

    return {
        "content": df,
        "column": [val for val in df[0].keys()],
        "graphdata": compare_ml_algorithms("user_files\\user1\\data.csv"),
    }


@app.route("/sendfile", methods=["POST"])
@cross_origin()
def send_file():
    """Sending the file from the frontend to backend"""

    user_file = request.files["file"]
    user_file.save(("uploads\\user1\\" + user_file.filename))
    csv_file = dd.read_csv("uploads\\user1\\" + user_file.filename)
    csv_file.compute().to_json(
        "user_files\\user1\\data.json",
        indent=2,
        orient="records",
        compression="infer",
        lines=False,
    )

    return {1: True}


#
# @app.route("/edit_columns", methods=['POST'])
# def edit_columns():
#     """This api call is for editing and creating the new csv file"""
#     df = dd.read_csv("uploads\\user1\\numeric_dataset.csv")
#     selected_csv_data = request.json

#     for data_set in selected_csv_data:
#         df.drop(label=data_set, axis=1)
#         undo.append({"drop": data_set, "axis": 1})

#     df.to_csv("user_files\\user1\\edited_file.csv", index=False)

#     return 200

# @app.route("/undo", methods = ['POST'])
# def undo_actions():

#     data_action = undo[-1]
#     redo.append(data_action)
#     undo.pop()
#     df = dd.read_csv("user_files\\user1\\numeric_dataset.csv")
#     for actions in undo:

#         df.drop(label=actions["drop"], axis=actions["axis"])


#     df.to_csv("user_files\\user1\\edited_file.csv", index=False)


if __name__ == "__main__":
    """Running the server"""
    app.run(debug=True, port=3000)
