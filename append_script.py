import json
import sys

with open('data/plants-data.js', 'r') as f:
    original_content = f.read()

with open('data/extended_plants.json', 'r') as f:
    extended_data = json.load(f)

# The file usually ends with a closing bracket for the array and then a closing bracket for the object.
# But looking at the file:
# 123:     ]
# 124: };
# I want to insert the new data and then merge it.

extended_js = "const plantsDataExtended = " + json.dumps(extended_data, indent=4) + ";\n\n"
extended_js += "// Merge into main dataset for tool functionality\n"
extended_js += "plantsData.plants = plantsData.plants.concat(plantsDataExtended);\n"
extended_js += "plantsData.meta.total_count = plantsData.plants.length;\n"
extended_js += "plantsData.meta.lastUpdated = '2026-02-04';\n"

new_content = original_content + "\n\n/**\n * Extended Plant Library (200+ unique entries)\n * Added: 2026-02-04\n */\n" + extended_js

with open('data/plants-data.js', 'w') as f:
    f.write(new_content)
