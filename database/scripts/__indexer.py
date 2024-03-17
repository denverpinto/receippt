import os
import json
from pptx import Presentation 

# index created for directory -
rootDir = "./slides"
noteTagLabel = "RECEIPPT-TAGS:"

# retrieve existing index if it exists
try:
	with open( './index.json','r') as f:
		currentIndex = json.load(f)
		print("Found Existing Index With {} Slides ".format(len(currentIndex["slides"])))
except IOError:
	currentIndex = { "slides": [] }
	print("No Index Found, Creating Index From Scratch")


# create updated index from scratch
updatedIndex = { "slides": [] }

for (root,dirs,files) in os.walk(rootDir, topdown=False):
	if root == rootDir : # top level directory containing files with tags
		for file in files:
			entry = {}
			entry["name"] = " ".join(file.split("_")).split(".pptx")[0].upper()
			entry["path"] = root[2:] + "/" + file
			prs = prs = Presentation(root+"/"+file)
			texts = []
			for slide_number, slide in enumerate(prs.slides):
				texts.append(f"Slide {slide_number + 1}:")
				for shape in slide.shapes: 
					if hasattr(shape, "text"):
						texts.append(shape.text)
				if slide_number == 0:
					noteText = slide.notes_slide.notes_text_frame.text
					if noteText.strip().upper().startswith(noteTagLabel):
						tags = noteText.strip().split(noteTagLabel)[1].strip().split(",")
						tags = [ tag.strip().upper() for tag in tags]
						tags = list(filter(lambda tag:tag!='', tags))
						entry["tags"] = tags
			entry["text"] = "\n".join(texts)
			updatedIndex["slides"].append(entry)

# display updated stats
print("Updated Index Has {} Slides \n".format(len(updatedIndex["slides"])))


# persist index to file
with open('./index.json', 'w') as f:
    json.dump(updatedIndex, f,indent = 2, sort_keys=True)  # encode dict into JSON
