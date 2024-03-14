import os
import json

# index created for directory -
path = "/Users/Denver/Desktop/RECEIPPT/receippt-flat-db/slides"

files = os.listdir(path)

for index, file in enumerate(files):
    os.rename(os.path.join(path, file), os.path.join(path, "_".join(file.split(" "))))
