from flask import Flask, render_template_string, request, redirect, url_for
import json
import os

app = Flask(__name__)
LOG_PATH = '/storage/emulated/0/QRide/sms_status.json'

def load_messages():
    if os.path.exists(LOG_PATH):
        with open(LOG_PATH) as f:
            try:
                return json.load(f)
            except Exception:
                return []
    return []

def save_messages(messages):
    with open(LOG_PATH, 'w') as f:
        json.dump(messages, f)

@app.route('/', methods=['GET', 'POST'])
def dashboard():
    messages = load_messages()
    query = request.args.get('q', '').lower()
    if query:
        messages = [m for m in messages if query in m.get('phone', '').lower() or
                    query in m.get('message', '').lower() or
                    query in m.get('status', '').lower()]
    if request.method == 'POST' and request.form.get('action') == 'delete_all':
        save_messages([])
        return redirect(url_for('dashboard'))
    html = """
    <!DOCTYPE html>
    <html>
    <head>
      <title>SMS Status Dashboard</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body { background: #f8f9fa; }
        .container { margin-top: 40px; }
        .table-responsive { max-height: 70vh; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2 class="mb-4">SMS Status Dashboard</h2>
        <form method="get" class="mb-3">
          <div class="input-group">
            <input type="text" name="q" class="form-control" placeholder="Search by phone, message, or status" value="{{request.args.get('q','')}}">
            <button class="btn btn-outline-secondary" type="submit">Search</button>
            <a href="/" class="btn btn-outline-secondary">Clear</a>
          </div>
        </form>
        <form method="post" onsubmit="return confirm('Delete all entries?');">
          <button type="submit" name="action" value="delete_all" class="btn btn-danger mb-3">Delete All Entries</button>
        </form>
        <div class="table-responsive">
          <table class="table table-striped table-bordered align-middle">
            <thead class="table-dark">
              <tr>
                <th>Phone</th>
                <th>Message</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {% for msg in messages %}
              <tr>
                <td>{{msg.phone}}</td>
                <td>{{msg.message}}</td>
                <td>
                  {% if msg.status == 'success' %}
                    <span class="badge bg-success">Success</span>
                  {% elif msg.status == 'failed' %}
                    <span class="badge bg-danger">Failed</span>
                  {% else %}
                    <span class="badge bg-secondary">{{msg.status}}</span>
                  {% endif %}
                </td>
                <td>{{msg.timestamp}}</td>
              </tr>
              {% endfor %}
              {% if not messages %}
              <tr><td colspan="4" class="text-center text-muted">No messages found.</td></tr>
              {% endif %}
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
    """
    return render_template_string(html, messages=messages)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 