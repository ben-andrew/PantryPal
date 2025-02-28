import cv2
import easyocr
import matplotlib.pyplot as plt
import numpy as np

# read image
image_path = '/Users/DeAnd/Downloads/2024-2025 UCF/Projects/Pantry Pal/receipt.jpg'

img = cv2.imread(image_path)

# instance text detector
reader = easyocr.Reader(['en'], gpu=False)

# detect text on image
text = reader.readtext(img)

for t in text:
    print(t)
