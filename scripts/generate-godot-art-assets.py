from pathlib import Path
from PIL import Image, ImageDraw
import math

ROOT = Path("godot-client/assets")


def ensure(path: str):
    full = ROOT / path
    full.parent.mkdir(parents=True, exist_ok=True)
    return full


def save(path: str, image: Image.Image):
    image.save(ensure(path))


def vertical_gradient(size, top, bottom):
    w, h = size
    image = Image.new("RGBA", size)
    draw = ImageDraw.Draw(image)
    for y in range(h):
        t = y / max(1, h - 1)
        color = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(4))
        draw.line((0, y, w, y), fill=color)
    return image


def draw_icon_bg(draw):
    draw.rounded_rectangle((6, 6, 90, 90), radius=18, fill=(23, 36, 55, 255), outline=(120, 183, 255, 255), width=4)
    draw.ellipse((18, 66, 78, 82), fill=(7, 16, 27, 115))


def new_icon():
    image = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw_icon_bg(draw)
    return image, draw


GOLD = (242, 205, 103, 255)
GOLD_DARK = (201, 128, 48, 255)
BLUE = (111, 214, 255, 255)
PANEL = (39, 56, 77, 255)


def background():
    image = vertical_gradient((432, 768), (143, 216, 255, 255), (102, 174, 95, 255))
    draw = ImageDraw.Draw(image)
    draw.polygon([(0, 250), (70, 198), (146, 225), (232, 170), (318, 132), (432, 110), (432, 768), (0, 768)], fill=(111, 182, 105, 255))
    draw.polygon([(0, 318), (90, 250), (172, 286), (266, 222), (354, 184), (432, 160), (432, 768), (0, 768)], fill=(79, 158, 103, 255))
    draw.polygon([(-40, 768), (80, 590), (168, 510), (232, 400), (286, 488), (348, 598), (472, 768)], fill=(216, 198, 162, 255))
    draw.polygon([(-12, 768), (100, 620), (174, 548), (228, 442), (276, 520), (336, 622), (444, 768)], fill=(188, 173, 140, 255))
    draw.ellipse((34, 58, 102, 126), fill=(255, 245, 181, 245))
    draw.ellipse((226, 68, 338, 104), fill=(244, 255, 255, 150))
    draw.ellipse((80, 110, 198, 146), fill=(244, 255, 255, 140))
    save("backgrounds/ro_field_day.png", image)


def player():
    image = Image.new("RGBA", (180, 220), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.ellipse((32, 190, 148, 214), fill=(7, 16, 27, 110))
    draw.polygon([(45, 93), (22, 128), (22, 168), (50, 196), (72, 154)], fill=(66, 106, 148, 255))
    draw.polygon([(135, 93), (158, 128), (158, 168), (130, 196), (108, 154)], fill=(47, 85, 124, 255))
    draw.polygon([(58, 72), (78, 46), (108, 46), (126, 72), (138, 156), (126, 185), (54, 185), (42, 156)], fill=(112, 71, 47, 255))
    draw.polygon([(60, 79), (120, 79), (110, 155), (70, 155)], fill=GOLD)
    draw.rectangle((62, 108, 118, 126), fill=(123, 215, 255, 240))
    draw.ellipse((62, 19, 118, 75), fill=(240, 210, 168, 255))
    draw.pieslice((54, 8, 130, 72), 185, 360, fill=(30, 36, 50, 255))
    draw.line((132, 92, 166, 58), fill=(210, 232, 255, 255), width=8)
    draw.line((149, 69, 174, 45), fill=BLUE, width=4)
    draw.line((48, 154, 20, 204), fill=(255, 225, 129, 255), width=8)
    draw.line((16, 205, 34, 215), fill=BLUE, width=5)
    save("sprites/player_adventurer.png", image)


def chest():
    image = Image.new("RGBA", (160, 130), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.ellipse((14, 106, 146, 126), fill=(7, 16, 27, 110))
    draw.rounded_rectangle((22, 54, 138, 112), radius=10, fill=(121, 80, 51, 255), outline=GOLD, width=6)
    draw.pieslice((22, 14, 138, 94), 180, 360, fill=(138, 87, 56, 255), outline=GOLD, width=6)
    draw.rectangle((68, 24, 92, 110), fill=GOLD)
    draw.ellipse((61, 57, 99, 95), fill=BLUE, outline=(235, 255, 255, 255), width=4)
    for start, end in [((18, 48), (4, 34)), ((142, 48), (156, 34)), ((80, 15), (80, 0))]:
        draw.line((start, end), fill=(255, 240, 168, 255), width=6)
    save("sprites/lucky_chest.png", image)


def icon_pack(name, painter):
    image, draw = new_icon()
    painter(draw)
    save(f"icons/{name}.png", image)


def generate_icons():
    icon_pack("pack", lambda d: [d.rectangle((28, 38, 68, 66), fill=(138, 85, 53, 255), outline=GOLD, width=5), d.rectangle((43, 25, 53, 68), fill=GOLD), d.ellipse((37, 41, 59, 63), fill=BLUE)])
    icon_pack("listing", lambda d: [d.polygon([(24, 42), (72, 42), (64, 25), (32, 25)], fill=GOLD), d.rectangle((28, 42, 68, 66), fill=PANEL, outline=BLUE, width=4), d.line((34, 69, 34, 78), fill=BLUE, width=4), d.line((62, 69, 62, 78), fill=BLUE, width=4)])
    icon_pack("open", lambda d: [d.ellipse((24, 24, 72, 72), fill=(104, 67, 148, 255)), *[d.line((48, 48, 48 + math.cos(i * math.tau / 8) * 34, 48 + math.sin(i * math.tau / 8) * 34), fill=GOLD, width=5) for i in range(8)], d.ellipse((37, 37, 59, 59), fill=BLUE)])
    icon_pack("cooldown", lambda d: [d.arc((22, 22, 74, 74), -70, 295, fill=BLUE, width=7), d.line((48, 48, 48, 28), fill=GOLD, width=6), d.line((48, 48, 64, 54), fill=GOLD, width=6)])
    icon_pack("market", lambda d: [d.polygon([(20, 40), (76, 40), (68, 25), (28, 25)], fill=GOLD), d.rounded_rectangle((22, 40, 74, 66), radius=4, fill=PANEL, outline=BLUE, width=5), d.ellipse((30, 49, 42, 61), fill=(255, 240, 168, 255)), d.ellipse((54, 49, 66, 61), fill=(255, 240, 168, 255))])
    icon_pack("price", lambda d: [d.ellipse((22, 52, 62, 70), fill=GOLD_DARK), d.ellipse((28, 40, 68, 58), fill=GOLD), d.ellipse((34, 28, 74, 46), fill=(255, 240, 168, 255)), d.rectangle((45, 37, 54, 60), fill=PANEL)])
    icon_pack("lock", lambda d: [d.rounded_rectangle((28, 43, 68, 71), radius=4, fill=GOLD), d.arc((34, 22, 62, 50), 180, 360, fill=BLUE, width=7), d.ellipse((43, 51, 53, 61), fill=PANEL)])
    icon_pack("force_open", lambda d: [d.regular_polygon((48, 48, 34), 8, fill=GOLD), d.rectangle((34, 34, 62, 62), fill=(138, 85, 53, 255), outline=BLUE, width=4)])
    icon_pack("boss", lambda d: [d.ellipse((23, 27, 73, 77), fill=(130, 70, 94, 255)), d.ellipse((33, 42, 43, 52), fill=(255, 113, 135, 255)), d.ellipse((53, 42, 63, 52), fill=(255, 113, 135, 255)), d.polygon([(28, 34), (38, 14), (43, 38)], fill=GOLD), d.polygon([(68, 34), (58, 14), (53, 38)], fill=GOLD)])
    icon_pack("guild", lambda d: [d.polygon([(48, 16), (73, 27), (66, 65), (48, 78), (30, 65), (23, 27)], fill=(56, 83, 122, 255), outline=BLUE), d.line((48, 24, 48, 66), fill=GOLD, width=7), d.line((34, 40, 62, 40), fill=GOLD, width=7)])
    icon_pack("ticket", lambda d: [d.rectangle((23, 35, 73, 61), fill=GOLD), d.ellipse((15, 40, 31, 56), fill=(23, 36, 55, 255)), d.ellipse((65, 40, 81, 56), fill=(23, 36, 55, 255)), d.line((48, 37, 48, 59), fill=(23, 36, 55, 255), width=4)])
    icon_pack("season", lambda d: [d.ellipse((28, 18, 68, 58), fill=GOLD), d.polygon([(36, 56), (28, 82), (47, 66)], fill=BLUE), d.polygon([(60, 56), (68, 82), (49, 66)], fill=(122, 166, 255, 255)), d.ellipse((39, 29, 57, 47), fill=(255, 247, 189, 255))])
    icon_pack("warrior", lambda d: [d.line((25, 70, 70, 25), fill=GOLD, width=9), d.line((31, 32, 66, 67), fill=BLUE, width=6)])
    icon_pack("ranger", lambda d: [d.arc((24, 18, 76, 78), 105, 255, fill=GOLD, width=7), d.line((36, 22, 66, 74), fill=BLUE, width=5), d.line((23, 48, 75, 48), fill=BLUE, width=5)])
    icon_pack("mage", lambda d: [d.line((32, 78, 63, 18), fill=GOLD, width=7), d.ellipse((49, 2, 81, 34), fill=(139, 120, 255, 255)), d.ellipse((58, 11, 72, 25), fill=BLUE)])
    icon_pack("cleric", lambda d: [d.ellipse((23, 23, 73, 73), fill=(53, 111, 104, 255)), d.rectangle((43, 25, 53, 71), fill=GOLD), d.rectangle((25, 43, 71, 53), fill=GOLD)])
    icon_pack("skill", lambda d: [d.regular_polygon((48, 48, 32), 5, rotation=-math.pi / 2, fill=GOLD, outline=BLUE)])


background()
player()
chest()
generate_icons()
print("Generated 20 Godot PNG art assets.")
