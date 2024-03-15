import os
import json

# index created for directory
slidesPath = "/Users/Denver/Desktop/RECEIPPT/receippt-flat-db/slides"

files = os.listdir(slidesPath)

for index, file in enumerate(files):
    os.rename(os.path.join(slidesPath, file), os.path.join(slidesPath, "_".join(file.split(" "))))
