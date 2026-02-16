from flask import Flask, render_template, jsonify, request
from process_system import process_system

app = Flask(__name__)
@app.route('/')
def home():
     return render_template("index.html")


# API Endpoint
@app.route('/api/users', methods=['GET'])
def api_users():
    try:
        results = process_system()
        
        
        from data_loader import load_data
        users, _, _, _ = load_data()
        user_map = {u.user_id: u.name for u in users}
        
        user_list = []
        for state in results['user_states']:
            user_id = state['user_id']
            total_points = sum(e['points_delta'] for e in results['points_ledger'] if e['user_id'] == user_id)
            user_list.append({
                'user_id': user_id,
                'name': user_map.get(user_id, 'Unknown'),  # DÜZELTME: Gerçek isim
                'total_points': total_points
            })
        
        return jsonify(user_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/leaderboard', methods=['GET'])
def api_leaderboard():
    try:
        results = process_system()
        return jsonify(results['leaderboard'][:10])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/<user_id>', methods=['GET'])
def api_user_detail(user_id):
    try:
        results = process_system()
        state = next((s for s in results['user_states'] if s['user_id'] == user_id), None)
        awards = [a for a in results['challenge_awards'] if a['user_id'] == user_id]
        badges = [b for b in results['badge_awards'] if b['user_id'] == user_id]
        notifs = [n for n in results['notifications'] if n['user_id'] == user_id]
        return jsonify({'state': state, 'awards': awards, 'badges': badges, 'notifs': notifs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/challenges', methods=['GET', 'POST'])
def api_challenges():
    if request.method == 'GET':
        try:
            results = process_system()
            return jsonify(results['challenge_awards'])
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    elif request.method == 'POST':
        data = request.json
        return jsonify({'message': 'Challenge added (mock)', 'data': data}), 201

if __name__ == '__main__':
    app.run(debug=True)

