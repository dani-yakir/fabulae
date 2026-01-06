from flask import Flask, render_template, jsonify
import csv
import random

app = Flask(__name__)

def load_vocabulary():
    vocab = []
    with open('core.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='$')
        next(reader)
        for row in reader:
            if len(row) >= 2 and row[0].strip() and row[1].strip():
                latin_word = row[0].strip()
                definitions = row[1].strip()
                meanings = [meaning.strip() for meaning in definitions.split(';')]
                vocab.append({
                    'latin': latin_word,
                    'meanings': meanings
                })
    return vocab

vocabulary = load_vocabulary()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/random-word')
def random_word():
    if vocabulary:
        word = random.choice(vocabulary)
        return jsonify(word)
    return jsonify({'error': 'No vocabulary available'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
