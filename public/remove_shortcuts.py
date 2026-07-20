import os
import re

public_dir = r'e:\QuantVault\public'
for f in os.listdir(public_dir):
    if f.endswith('.html'):
        path = os.path.join(public_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        new_content = re.sub(r'<button[^>]*onclick=[\'"].*?KeyboardShortcuts.*?[\'"].*?>.*?</button>', '', content, flags=re.DOTALL)
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print('Removed shortcuts from ' + f)
