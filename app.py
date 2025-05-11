from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/jugar')
def jugar():
    return render_template('jugar.html')  # Esta es la nueva página para jugar

@app.route('/espermatozoide')
def espermatozoide():
    return render_template('espermatozoide.html')

if __name__ == '__main__':
    app.run(debug=True)