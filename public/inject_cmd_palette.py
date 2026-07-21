import os
import re

palette_html = '''
    <!-- Global Command Palette -->
    <div class="cmd-backdrop" id="cmdBackdrop"></div>
    <div class="cmd-palette" id="commandPalette">
        <div class="cmd-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" class="cmd-input" id="cmdInput" placeholder="Search commands, pages, and actions..." autocomplete="off">
        </div>
        <div class="cmd-body" id="cmdResults">
            <!-- Results populated by JS -->
        </div>
    </div>
'''

script_tag = '<script src="/js/command-palette.js"></script>'

public_dir = r'e:\QuantVault\public'
for f in os.listdir(public_dir):
    if f.endswith('.html'):
        path = os.path.join(public_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        updated = False
        
        # Inject HTML right after <canvas id="bgCanvas"></canvas> or <body>
        if '<div class="cmd-palette"' not in content:
            if '<canvas id="bgCanvas"></canvas>' in content:
                content = content.replace('<canvas id="bgCanvas"></canvas>', '<canvas id="bgCanvas"></canvas>\n' + palette_html)
                updated = True
            elif '<body>' in content:
                content = content.replace('<body>', '<body>\n' + palette_html)
                updated = True
                
        # Inject script tag right before </body>
        if 'command-palette.js' not in content:
            if '</body>' in content:
                content = content.replace('</body>', '    ' + script_tag + '\n</body>')
                updated = True
                
        if updated:
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
            print('Injected Command Palette into ' + f)
