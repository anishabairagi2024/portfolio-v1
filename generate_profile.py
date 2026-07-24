from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path

out = Path('assets/images/profile.png')
out.parent.mkdir(parents=True, exist_ok=True)

img = Image.new('RGBA', (800, 800), (5, 7, 13, 255))

draw = ImageDraw.Draw(img)
for r in range(320, 0, -30):
    alpha = int(18 * (1 - r / 320))
    draw.ellipse((400 - r, 400 - r, 400 + r, 400 + r), fill=(59, 130, 246, alpha))
for r in range(260, 0, -30):
    alpha = int(16 * (1 - r / 260))
    draw.ellipse((400 - r, 400 - r, 400 + r, 400 + r), fill=(139, 92, 246, alpha))

face = Image.new('RGBA', (800, 800), (0, 0, 0, 0))
face_draw = ImageDraw.Draw(face)
face_draw.ellipse((250, 200, 550, 620), fill=(239, 201, 157, 255))
face_draw.ellipse((260, 260, 540, 560), fill=(23, 24, 33, 255))
face_draw.ellipse((220, 180, 580, 520), fill=(20, 20, 28, 255))
face_draw.arc((225, 185, 575, 535), 200, 360, fill=(80, 80, 100, 255), width=18)
face_draw.ellipse((335, 340, 355, 360), fill=(10, 10, 14, 255))
face_draw.ellipse((445, 340, 465, 360), fill=(10, 10, 14, 255))
face_draw.arc((365, 395, 435, 440), 0, 180, fill=(122, 57, 41, 255), width=6)
face_draw.ellipse((290, 560, 510, 760), fill=(239, 201, 157, 255))
face_draw.rectangle((280, 620, 520, 720), fill=(18, 23, 36, 255))

face = face.filter(ImageFilter.GaussianBlur(radius=1.2))
img.alpha_composite(face)

border = Image.new('RGBA', img.size, (0, 0, 0, 0))
bd = ImageDraw.Draw(border)
bd.ellipse((120, 120, 680, 680), outline=(255, 255, 255, 80), width=10)
img.alpha_composite(border)

img.save(out)
print(out)
