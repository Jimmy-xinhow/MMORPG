from pathlib import Path
from PIL import Image

ROOT = Path("godot-client/assets/production")
SOURCE = ROOT / "reference" / "batch-01-style-direction.png"


def ensure_dirs():
    for name in [
        "backgrounds",
        "characters",
        "equipment",
        "monsters",
        "ui",
        "icons",
        "spritesheets",
    ]:
        (ROOT / name).mkdir(parents=True, exist_ok=True)


def remove_near_white_background(image, threshold=34):
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    corners = [
        rgba.getpixel((0, 0))[:3],
        rgba.getpixel((width - 1, 0))[:3],
        rgba.getpixel((0, height - 1))[:3],
        rgba.getpixel((width - 1, height - 1))[:3],
    ]
    key = tuple(sum(channel[i] for channel in corners) // len(corners) for i in range(3))

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            distance = abs(r - key[0]) + abs(g - key[1]) + abs(b - key[2])
            bright = r > 220 and g > 215 and b > 200
            if distance < threshold or bright:
                pixels[x, y] = (r, g, b, 0)
    return rgba


def crop(source, box, target, alpha=False, resize=None):
    image = source.crop(box)
    if alpha:
        image = remove_near_white_background(image)
    else:
        image = image.convert("RGBA")
    if resize:
        image = image.resize(resize, Image.Resampling.LANCZOS)
    out = ROOT / target
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out)
    return out


def make_sprite_sheet(source):
    male = remove_near_white_background(source.crop((600, 28, 768, 288))).resize((192, 288), Image.Resampling.LANCZOS)
    female = remove_near_white_background(source.crop((596, 300, 760, 575))).resize((192, 288), Image.Resampling.LANCZOS)
    sheet = Image.new("RGBA", (384, 288), (0, 0, 0, 0))
    sheet.alpha_composite(male, (0, 0))
    sheet.alpha_composite(female, (192, 0))
    out = ROOT / "spritesheets" / "paper-doll-idle-sheet.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out)
    return out


def main():
    ensure_dirs()
    source = Image.open(SOURCE).convert("RGB")
    outputs = []

    outputs.append(crop(source, (0, 0, 584, 582), "backgrounds/home-field.png", resize=(432, 430)))
    outputs.append(crop(source, (600, 28, 768, 288), "characters/male-base.png", alpha=True, resize=(192, 288)))
    outputs.append(crop(source, (596, 300, 760, 575), "characters/female-base.png", alpha=True, resize=(192, 288)))
    outputs.append(crop(source, (334, 1090, 603, 1304), "equipment/sword-layer.png", alpha=True, resize=(256, 192)))
    outputs.append(crop(source, (450, 680, 574, 785), "equipment/cloth-armor-layer.png", alpha=True, resize=(160, 160)))
    outputs.append(crop(source, (582, 674, 681, 781), "equipment/headgear-layer.png", alpha=True, resize=(160, 160)))
    outputs.append(crop(source, (24, 585, 1003, 928), "ui/hud-frame.png", alpha=True, resize=(432, 152)))
    outputs.append(crop(source, (20, 948, 1010, 1096), "ui/bottom-nav.png", alpha=True, resize=(432, 66)))
    outputs.append(crop(source, (662, 1110, 980, 1318), "monsters/field-slime.png", alpha=True, resize=(220, 150)))
    outputs.append(crop(source, (60, 1110, 294, 1324), "icons/pack-sealed.png", alpha=True, resize=(128, 128)))
    outputs.append(crop(source, (78, 1321, 304, 1510), "icons/skill-active-attack.png", alpha=True, resize=(128, 128)))
    outputs.append(crop(source, (399, 1324, 627, 1510), "icons/potion-green.png", alpha=True, resize=(128, 128)))
    outputs.append(crop(source, (718, 1324, 944, 1510), "icons/crystal-blue.png", alpha=True, resize=(128, 128)))
    outputs.append(crop(source, (452, 608, 548, 705), "icons/challenge-ticket.png", alpha=True, resize=(128, 128)))
    outputs.append(make_sprite_sheet(source))

    for output in outputs:
        print(output.as_posix())


if __name__ == "__main__":
    main()
