from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance

ROOT = Path("godot-client/assets/production")
SOURCE = ROOT / "reference" / "batch-04-character-animation-sheet.png"
FRAME = (192, 288)
STATES = ["walk", "cast", "death", "loot"]


def save(image, target):
    out = ROOT / target
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out)
    print(out.as_posix())


def open_rgba(path):
    return Image.open(ROOT / path).convert("RGBA")


def remove_chroma(image, threshold=70):
    rgba = image.convert("RGBA")
    px = rgba.load()
    width, height = rgba.size
    key = (0, 255, 0)
    for y in range(height):
        for x in range(width):
            r, g, b, a = px[x, y]
            distance = abs(r - key[0]) + abs(g - key[1]) + abs(b - key[2])
            if distance < threshold or (g > 205 and r < 90 and b < 110):
                px[x, y] = (r, g, b, 0)
    return rgba


def crop_reference_rows():
    sheet = Image.open(SOURCE).convert("RGB")
    rows = [
        ("male-walk", (24, 46, 740, 220)),
        ("male-cast", (24, 250, 740, 424)),
        ("male-death", (24, 455, 740, 630)),
        ("male-loot", (24, 662, 740, 836)),
        ("female-walk", (790, 46, 1508, 220)),
        ("female-cast", (790, 250, 1508, 424)),
        ("female-death", (790, 455, 1508, 630)),
        ("female-loot", (790, 662, 1508, 836)),
    ]
    for name, box in rows:
        save(remove_chroma(sheet.crop(box)).resize((768, 192), Image.Resampling.LANCZOS), f"spritesheets/batch-04-{name}-reference-row.png")


def blank_frame():
    frame = Image.new("RGBA", FRAME, (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame)
    draw.ellipse((52, 240, 140, 256), fill=(0, 0, 0, 70))
    return frame


def paste_center(canvas, subject, offset=(0, 0), scale=1.0):
    item = subject.copy()
    if scale != 1.0:
        item = item.resize((int(item.width * scale), int(item.height * scale)), Image.Resampling.LANCZOS)
    x = (canvas.width - item.width) // 2 + offset[0]
    y = (canvas.height - item.height) // 2 + offset[1]
    canvas.alpha_composite(item, (x, y))


def body_frame(base, rotation=0, offset=(0, 0), brightness=1.0):
    body = ImageEnhance.Brightness(base).enhance(brightness)
    if rotation:
        body = body.rotate(rotation, resample=Image.Resampling.BICUBIC, expand=False)
    frame = blank_frame()
    paste_center(frame, body, offset)
    return frame


def add_weapon(frame, weapon, offset=(46, -42), scale=0.36):
    paste_center(frame, weapon, offset, scale)


def add_cast_vfx(frame, index):
    magic = open_rgba("vfx/magic-burst.png")
    ring = open_rgba("vfx/healing-circle.png")
    scale = 0.26 + index * 0.035
    paste_center(frame, ring, (0, 34 - index * 3), 0.42)
    paste_center(frame, magic, (30, -76 + index * 2), scale)


def add_loot_vfx(frame, index):
    sparkle = open_rgba("vfx/drop-sparkle.png")
    chest = open_rgba("icons/reward-chest.png")
    paste_center(frame, sparkle, (-34 + index * 9, -72 + index * 3), 0.30)
    paste_center(frame, chest, (44, -82 + index * 6), 0.25)


def make_walk(base, weapon):
    rotations = [-4, 2, 4, -2]
    offsets = [(-9, 2), (-2, -3), (8, 2), (2, -2)]
    frames = []
    for i in range(4):
        frame = body_frame(base, rotations[i], offsets[i])
        add_weapon(frame, weapon, (46 + offsets[i][0], -40 + offsets[i][1]), 0.34)
        frames.append(frame)
    return frames


def make_cast(base, weapon):
    frames = []
    for i, rotation in enumerate([-2, -5, -7, -4]):
        frame = body_frame(base, rotation, (-3, -2 - i), 1.0 + i * 0.025)
        add_weapon(frame, weapon, (52, -55 - i * 3), 0.34)
        add_cast_vfx(frame, i)
        frames.append(frame)
    return frames


def make_death(base, weapon):
    frames = []
    rotations = [18, 42, 72, 86]
    offsets = [(10, 18), (22, 38), (28, 62), (26, 80)]
    brightness = [0.82, 0.70, 0.58, 0.48]
    for i in range(4):
        frame = body_frame(base, rotations[i], offsets[i], brightness[i])
        if i < 2:
            add_weapon(frame, weapon, (50, -20 + i * 22), 0.30)
        frames.append(frame)
    return frames


def make_loot(base, weapon):
    frames = []
    rotations = [0, 8, 13, 3]
    offsets = [(0, 0), (6, 14), (8, 24), (0, -2)]
    for i in range(4):
        frame = body_frame(base, rotations[i], offsets[i], 1.03)
        if i == 3:
            glow = open_rgba("vfx/level-up-glow.png")
            paste_center(frame, glow, (0, -42), 0.45)
        add_weapon(frame, weapon, (48, -35 + i * 8), 0.32)
        add_loot_vfx(frame, i)
        frames.append(frame)
    return frames


def save_animation(gender, state, frames):
    sheet = Image.new("RGBA", (FRAME[0] * 4, FRAME[1]), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        save(frame, f"characters/animations/{gender}-{state}-{i + 1}.png")
        sheet.alpha_composite(frame, (i * FRAME[0], 0))
    save(sheet, f"spritesheets/{gender}-{state}-sheet.png")
    return sheet


def make_animations():
    characters = [
        ("male", open_rgba("characters/male-base.png"), open_rgba("equipment/sword-layer-v2.png")),
        ("female", open_rgba("characters/female-base.png"), open_rgba("equipment/staff-layer.png")),
    ]
    makers = {
        "walk": make_walk,
        "cast": make_cast,
        "death": make_death,
        "loot": make_loot,
    }
    atlas = Image.new("RGBA", (FRAME[0] * 4, FRAME[1] * len(STATES) * len(characters)), (0, 0, 0, 0))
    row = 0
    for gender, base, weapon in characters:
        for state in STATES:
            sheet = save_animation(gender, state, makers[state](base, weapon))
            atlas.alpha_composite(sheet, (0, row * FRAME[1]))
            row += 1
    save(atlas, "spritesheets/paper-doll-extended-animation-atlas.png")


def main():
    crop_reference_rows()
    make_animations()


if __name__ == "__main__":
    main()
