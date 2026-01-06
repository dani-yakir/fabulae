from flask import Flask, render_template, jsonify
import csv
import random
import re

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
                meanings_raw = [meaning.strip() for meaning in definitions.split(';')]
                
                meanings = []
                for meaning in meanings_raw:
                    synonyms = []
                    for syn in meaning.split(','):
                        syn_clean = syn.strip().lower()
                        syn_clean = re.sub(r'\s+', ' ', syn_clean)
                        synonyms.append(syn_clean)
                        
                        if '(' in syn_clean and ')' in syn_clean:
                            partial = re.sub(r'\([^)]*\)', '', syn_clean).strip()
                            partial = re.sub(r'\s+', ' ', partial)
                            if partial and partial not in synonyms:
                                synonyms.append(partial)
                    
                    meanings.append({
                        'display': meaning,
                        'synonyms': synonyms
                    })
                
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

@app.route('/api/check-guess', methods=['POST'])
def check_guess():
    from flask import request
    data = request.json
    guess = data.get('guess', '').strip().lower()
    guess = re.sub(r'\s+', ' ', guess)
    meanings = data.get('meanings', [])
    
    for idx, meaning in enumerate(meanings):
        if guess in meaning.get('synonyms', []):
            return jsonify({
                'correct': True,
                'meaningIndex': idx,
                'display': meaning.get('display')
            })
    
    return jsonify({'correct': False})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
