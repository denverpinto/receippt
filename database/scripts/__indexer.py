import os
import json
from pptx import Presentation 

# index created for directories -
slidesRootDir = "./slides"
noteTagLabel = "RECEIPPT-TAGS:"
templatesRootDir = "./templates"

# create updated index from scratch
updatedIndex = { "slides": [], "templates": [] }

# function to return all slides' text
def getSlidesText(path):
	prs = Presentation(path)
	texts = []
	totalSlides = len(prs.slides)
	for slide_number, slide in enumerate(prs.slides):
		texts.append("<hr>")
		texts.append(f"<b><i>Slide {slide_number + 1}/{totalSlides}</b></i>")
		firstSlide = True
		for shape in slide.shapes: 
			if hasattr(shape, "text"):
				if firstSlide:
					texts.append(f"<h3>{shape.text}</h3>")
					firstSlide = False
				else:
					texts.append(f"{shape.text}")
	return "</br>".join(texts).replace("\n","</br>")

# function to remove unknown slides from templates 
def scrubTemplate(template):
	knownSlides = [slideDetails["name"] for slideDetails in updatedIndex["slides"] ]
	for masspart in template["massparts"]:
		masspart["slides"] = [ slide for slide in masspart["slides"] if slide in knownSlides]
	return template


# retrieve existing index if it exists
try:
	with open( './index.json','r') as f:
		currentIndex = json.load(f)
		print("Found Existing Index With {} Slides and {} Templates ".format(len(currentIndex["slides"]),len(currentIndex["templates"])))
except IOError:
	print("No Index Found, Creating Index From Scratch")


for (root,dirs,files) in os.walk(slidesRootDir, topdown=False):
	if root == slidesRootDir : # top level directory containing files with tags
		for file in files:
			entry = {}
			entry["name"] = " ".join(" ".join(file.split("_")).split()).split(".pptx")[0].upper()
			entry["path"] = root[2:] + "/" + file
			prs = prs = Presentation(root+"/"+file)
			for slide_number, slide in enumerate(prs.slides):
				if slide_number == 0:
					noteText = slide.notes_slide.notes_text_frame.text
					if noteText.strip().upper().startswith(noteTagLabel):
						tags = noteText.strip().split(noteTagLabel)[1].strip().split(",")
						tags = [ tag.strip().upper() for tag in tags]
						tags = list(filter(lambda tag:tag!='', tags))
						entry["tags"] = tags
			entry["html"] = getSlidesText(entry["path"])
			updatedIndex["slides"].append(entry)

# add templates 
for (root,dirs,files) in os.walk(templatesRootDir, topdown=False):
	if root == templatesRootDir : # top level directory containing files with tags
		for file in files:
			try:
				with open(root+"/"+file,'r') as f:
					currentTemplate = json.load(f)
					updatedIndex["templates"].append(scrubTemplate(currentTemplate))
			except IOError:
				print("{} couldn't be loaded".format(root+"/"+file))

# sort index.slides alphabetically
def sortFn(e):
  return e['name']

updatedIndex["slides"].sort(key=sortFn)

# display updated stats
print("Updated Index Has {} Slides and {} Templates \n".format(len(updatedIndex["slides"]),len(updatedIndex["templates"])))

# persist index to file
with open('./index.json', 'w') as f:
    json.dump(updatedIndex, f,indent = 2, sort_keys=True)  # encode dict into JSON
