import os
import re

public_dir = r'E:\QuantVault\public'

# Regex to match style="[anything]" exactly inside class="btn..." or similar
# It's easier to just match any button tag or a tag with class="btn..." and strip its style attribute

def remove_inline_style(match):
    tag = match.group(0)
    # Strip the style attribute if it exists
    return re.sub(r'\s*style="[^"]*"', '', tag)

for filename in os.listdir(public_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(public_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Target <a> and <button> tags with class="...btn..."
        # First find all such tags
        new_content = re.sub(r'<(?:button|a)[^>]*class="[^"]*btn[^"]*"[^>]*>', remove_inline_style, content)
        
        # In index.html, there are some hardcoded inline styles in panels, but let's stick to buttons for now
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Removed inline button styles in {filename}")
