import os

public_dir = r'E:\QuantVault\public'
for filename in os.listdir(public_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(public_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace canvas with div for echarts
        if 'portfolioChart' in content and '<canvas' in content:
            # specifically we know the dashboard/portfolio uses: <canvas id="portfolioChart"
            # It might have a closing tag. 
            # We'll just replace the start and end specifically
            
            import re
            content = re.sub(r'<canvas\s+id="portfolioChart"[^>]*>', '<div id="portfolioChart" style="width: 100%; height: 100%;">', content)
            content = content.replace('</canvas>', '</div>')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
print('Canvas tags updated to div for ECharts!')
