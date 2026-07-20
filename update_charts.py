import os

public_dir = r"E:\QuantVault\public"

for filename in os.listdir(public_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(public_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        if 'chart.js' in content.lower():
            content = content.replace(
                '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
                '<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>'
            )
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

print("ECharts linked!")
