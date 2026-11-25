from flask import Flask, jsonify, render_template

from ant import Ant
from grid import Grid

app = Flask(__name__)

# Estado inicial da simulação
grid = Grid()
ant = Ant()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/state")
def get_state():
    return jsonify({
        "ant": ant.get_state(),
        "active_cells": grid.get_active_cells()
    })


@app.route("/api/step", methods=["POST"])
def next_step():
    ant.step(grid)

    return jsonify({
        "ant": ant.get_state(),
        "active_cells": grid.get_active_cells()
    })


@app.route("/api/reset", methods=["POST"])
def reset():
    grid.clear()
    ant.reset()

    return jsonify({
        "ant": ant.get_state(),
        "active_cells": grid.get_active_cells()
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
