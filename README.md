<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sipario Pro — Media Player</title>
    <style>
        :root {
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --accent-color: #3b82f6;
            --accent-hover: #2563eb;
            --text-color: #f8fafc;
            --text-muted: #94a3b8;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        header {
            text-align: center;
            padding: 80px 20px 40px 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            font-size: 2.8rem;
            margin-bottom: 20px;
            color: #ffffff;
        }
        p.subtitle {
            font-size: 1.2rem;
            color: var(--text-muted);
            margin-bottom: 30px;
        }
        .btn {
            display: inline-block;
            background-color: var(--accent-color);
            color: white;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            transition: background 0.2s;
            box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
        }
        .btn:hover {
            background-color: var(--accent-hover);
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .card {
            background-color: var(--card-bg);
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h2.section-title {
            text-align: center;
            margin-bottom: 30px;
            font-size: 1.8rem;
        }
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .pricing-box {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid #334155;
            border-radius: 10px;
            padding: 30px;
            text-align: center;
        }
        .pricing-box.featured {
            border-color: var(--accent-color);
            background: rgba(59, 130, 246, 0.05);
        }
        .pricing-box h3 {
            margin-top: 0;
            font-size: 1.5rem;
            color: #ffffff;
        }
        .price {
            font-size: 2rem;
            font-weight: bold;
            color: var(--accent-color);
            margin: 15px 0;
        }
        .price-note {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 14px;
            text-align: left;
            border-bottom: 1px solid #334155;
        }
        th {
            color: var(--text-muted);
            font-weight: 600;
        }
        td:nth-child(2), td:nth-child(3) {
            text-align: center;
        }
        .check { color: #22c55e; font-weight: bold; }
        .dash { color: var(--text-muted); }
        .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .step-item {
            background: rgba(255, 255, 255, 0.03);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #334155;
        }
        .step-item h3 {
            margin-top: 0;
            color: var(--accent-color);
        }
        footer {
            text-align: center;
            padding: 40px 20px;
            color: var(--text-muted);
            font-size: 0.9rem;
            border-top: 1px solid #1e293b;
        }
        footer a {
            color: var(--text-muted);
            text-decoration: underline;
            margin: 0 10px;
        }
    </style>
</head>
<body>

    <header>
        <h1>Sipario Pro</h1>
        <p class="subtitle">The smart, fast, and secure media player to organize and play your personal streams and playlists on Windows, macOS, and Linux.</p>
        <a href="https://t.me/pietroabcd" target="_blank" class="btn">Request License on Telegram</a>
    </header>

    <div class="container">
        
        <div class="card">
            <h2 class="section-title">Plans & Pricing</h2>
            <div class="pricing-grid">
                <div class="pricing-box">
                    <h3>Annual</h3>
                    <div class="price">€ 19.90</div>
                    <div class="price-note">billed annually · updates included</div>
                    <a href="https://t.me/pietroabcd" target="_blank" class="btn">Choose Annual</a>
                </div>
                <div class="pricing-box featured">
                    <h3>Lifetime</h3>
                    <div class="price">€ 69.90</div>
                    <div class="price-note">one-time payment · permanent license</div>
                    <a href="https://t.me/pietroabcd" target="_blank" class="btn">Choose Lifetime</a>
                </div>
            </div>
        </div>

        <div class="card">
            <h2 class="section-title">How to Start in 3 Simple Steps</h2>
            <div class="steps-grid">
                <div class="step-item">
                    <h3>1. Install the App</h3>
                    <p>Download Sipario Pro on your computer and test it immediately with all features unlocked for a 1-day free trial.</p>
                </div>
                <div class="step-item">
                    <h3>2. Copy Your Code</h3>
                    <p>Open the app, go to Upgrade to Premium, and copy your unique device code.</p>
                </div>
                <div class="step-item">
                    <h3>3. Contact Me on Telegram</h3>
                    <p>Send me your device code on Telegram to activate your Annual or Lifetime license.</p>
                </div>
            </div>
        </div>

        <div class="card">
            <h2 class="section-title">Free vs Premium</h2>
            <table>
                <thead>
                    <tr>
                        <th>Features</th>
                        <th>Free (1-Day Trial)</th>
                        <th>Sipario Pro (Premium)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Live TV, Movies, Series, Search & Resume</td>
                        <td><span class="check">✓</span></td>
                        <td><span class="check">✓</span></td>
                    </tr>
                    <tr>
                        <td>Saved Playlists</td>
                        <td>1</td>
                        <td><b>Unlimited</b></td>
                    </tr>
                    <tr>
                        <td>Separate User Profiles</td>
                        <td>1</td>
                        <td><b>Up to 6</b></td>
                    </tr>
                    <tr>
                        <td>Favorites</td>
                        <td>1</td>
                        <td><b>Unlimited</b></td>
                    </tr>
                    <tr>
                        <td>Full Watch History</td>
                        <td>Last 2</td>
                        <td><span class="check">✓</span></td>
                    </tr>
                    <tr>
                        <td>TV Guide (Now/Next) & Parental Control</td>
                        <td><span class="dash">—</span></td>
                        <td><span class="check">✓</span></td>
                    </tr>
                    <tr>
                        <td>Auto-Play Next Episode & Sleep Timer</td>
                        <td><span class="dash">—</span></td>
                        <td><span class="check">✓</span></td>
                    </tr>
                </tbody>
            </table>
            <div style="text-align: center; margin-top: 30px;">
                <a href="https://t.me/pietroabcd" target="_blank" class="btn">Contact me on Telegram (@pietroabcd)</a>
            </div>
        </div>

        <div class="card">
            <h2 class="section-title">Frequently Asked Questions</h2>
            <p><strong>What exactly is Sipario Pro?</strong><br>It is an advanced media player software for playing multimedia streams and playlists. The application does not provide any preloaded content, channels, or playlists.</p>
            <p><strong>How does the free trial work?</strong><br>As soon as you install the application, you get 1 full day to test all advanced Premium features completely risk-free.</p>
            <p><strong>How do I receive the license after writing on Telegram?</strong><br>Just send me the device code found inside the app, and I will generate your activation key bound to your PC.</p>
        </div>

    </div>

    <footer>
        <p>&copy; 2026 Sipario Pro. All rights reserved.</p>
        <p>
            <a href="https://t.me/pietroabcd" target="_blank">Telegram Contact</a> | 
            <a href="mailto:support@sipariopro.com">Support</a>
        </p>
    </footer>

</body>
</html>
