import os

public_dir = r"E:\QuantVault\public"

manifest_link = '    <link rel="manifest" href="manifest.json">\n'

for filename in os.listdir(public_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(public_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        if '<link rel="manifest"' not in content:
            # Find the closing </head> and insert before it
            if "</head>" in content:
                content = content.replace("</head>", manifest_link + "</head>")
                
        # Let's also register the service worker if it's not there
        sw_registration = """
<script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW registered!', reg.scope))
                .catch(err => console.log('SW registration failed:', err));
        });
    }
</script>
</body>"""
        if "navigator.serviceWorker.register" not in content and "</body>" in content:
            content = content.replace("</body>", sw_registration)
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

print("PWA files updated!")
