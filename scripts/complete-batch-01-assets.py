from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = Path("godot-client/assets/production")


def open_rgba(path):
    return Image.open(ROOT / path).convert("RGBA")


def save(image, path):
    out = ROOT / path
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out)
    print(out.as_posix())


def recolor(image, tint, strength=0.45):
    base = image.convert("RGBA")
    overlay = Image.new("RGBA", base.size, tint)
    return Image.blend(base, overlay, strength)


def make_icon_frame(subject, bg=(18, 30, 46, 255), border=(214, 169, 82, 255)):
    canvas = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((6, 6, 122, 122), radius=14, fill=bg, outline=border, width=5)
    draw.rounded_rectangle((14, 14, 114, 114), radius=10, outline=(98, 210, 255, 150), width=2)
    if subject is not None:
        subject.thumbnail((94, 94), Image.Resampling.LANCZOS)
        canvas.alpha_composite(subject, ((128 - subject.width) // 2, (128 - subject.height) // 2))
    return canvas


def make_coin():
    canvas = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((24, 20, 104, 100), fill=(246, 190, 59, 255), outline=(121, 78, 24, 255), width=6)
    draw.ellipse((38, 31, 92, 86), outline=(255, 235, 142, 255), width=4)
    draw.polygon([(64, 35), (72, 55), (94, 55), (76, 67), (83, 88), (64, 75), (45, 88), (52, 67), (34, 55), (56, 55)], fill=(255, 242, 151, 255), outline=(135, 87, 32, 255))
    return make_icon_frame(canvas)


def make_lock():
    canvas = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((36, 55, 92, 101), radius=8, fill=(218, 168, 77, 255), outline=(88, 59, 28, 255), width=5)
    draw.arc((43, 22, 85, 70), 180, 360, fill=(235, 224, 190, 255), width=8)
    draw.ellipse((58, 72, 70, 84), fill=(40, 32, 28, 255))
    draw.rectangle((62, 82, 66, 94), fill=(40, 32, 28, 255))
    return make_icon_frame(canvas)


def make_cooldown():
    canvas = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((28, 25, 100, 97), outline=(103, 221, 255, 255), width=8)
    draw.arc((28, 25, 100, 97), -90, 110, fill=(246, 190, 59, 255), width=10)
    draw.line((64, 61, 64, 38), fill=(238, 247, 255, 255), width=6)
    draw.line((64, 61, 82, 72), fill=(238, 247, 255, 255), width=6)
    return make_icon_frame(canvas)


def make_price_marker():
    return make_icon_frame(make_coin(), bg=(25, 42, 53, 255), border=(102, 218, 255, 255))


def make_stall():
    canvas = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.polygon([(25, 48), (103, 48), (91, 26), (37, 26)], fill=(191, 61, 53, 255), outline=(88, 49, 29, 255))
    for x in [38, 58, 78]:
        draw.rectangle((x, 28, x + 12, 48), fill=(245, 219, 136, 255))
    draw.rounded_rectangle((31, 50, 97, 100), radius=6, fill=(82, 56, 43, 255), outline=(214, 169, 82, 255), width=4)
    draw.rectangle((38, 64, 90, 75), fill=(42, 82, 69, 255))
    return make_icon_frame(canvas)


def make_listing_card():
    canvas = Image.new("RGBA", (256, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((8, 10, 248, 118), radius=16, fill=(14, 25, 39, 238), outline=(214, 169, 82, 255), width=5)
    draw.rounded_rectangle((22, 25, 94, 96), radius=10, fill=(28, 45, 66, 255), outline=(103, 221, 255, 180), width=3)
    draw.rectangle((112, 35, 226, 47), fill=(69, 96, 118, 255))
    draw.rectangle((112, 60, 202, 72), fill=(44, 74, 92, 255))
    draw.rectangle((112, 84, 180, 96), fill=(214, 169, 82, 255))
    return canvas


def make_panel(size, accent=(214, 169, 82, 255)):
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    w, h = size
    draw.rounded_rectangle((4, 4, w - 5, h - 5), radius=16, fill=(12, 23, 36, 236), outline=accent, width=4)
    draw.rounded_rectangle((14, 14, w - 15, h - 15), radius=10, outline=(92, 165, 205, 135), width=2)
    draw.rectangle((22, 22, w - 22, 34), fill=(41, 67, 91, 180))
    return canvas


def make_background(name, tint, icon=None):
    home = open_rgba("backgrounds/home-field.png").resize((432, 430), Image.Resampling.LANCZOS)
    top = Image.new("RGBA", (432, 110), (8, 14, 25, 255))
    bottom = Image.new("RGBA", (432, 228), (9, 15, 24, 255))
    canvas = Image.new("RGBA", (432, 768), (0, 0, 0, 255))
    canvas.alpha_composite(top, (0, 0))
    scene = recolor(home, tint, 0.22)
    canvas.alpha_composite(scene, (0, 110))
    canvas.alpha_composite(bottom, (0, 540))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((18, 570, 414, 742), radius=16, fill=(12, 23, 36, 220), outline=(214, 169, 82, 180), width=3)
    if icon is not None:
        icon = icon.copy()
        icon.thumbnail((112, 112), Image.Resampling.LANCZOS)
        canvas.alpha_composite(icon, (292, 592))
    save(canvas, f"backgrounds/{name}.png")


def main():
    pack = open_rgba("icons/pack-sealed.png")
    sword = open_rgba("equipment/sword-layer.png")
    slime = open_rgba("monsters/field-slime.png")
    crystal = open_rgba("icons/crystal-blue.png")
    potion = open_rgba("icons/potion-green.png")
    ticket = open_rgba("icons/challenge-ticket.png")

    # Backgrounds/pages.
    make_background("town", (255, 225, 150, 255), make_stall())
    make_background("pack-page", (73, 45, 98, 255), pack)
    make_background("market-page", (44, 92, 80, 255), make_stall())
    make_background("trading-page", (45, 70, 105, 255), make_price_marker())
    make_background("challenge-page", (94, 38, 57, 255), slime)
    make_background("role-page", (42, 68, 105, 255), sword)
    make_background("inventory-page", (64, 52, 72, 255), pack)
    make_background("skill-page", (42, 58, 96, 255), crystal)

    # UI frames.
    save(make_panel((432, 96)), "ui/status-panel.png")
    save(make_panel((432, 174)), "ui/log-panel.png")
    save(make_panel((432, 492)), "ui/page-panel.png")
    save(make_panel((96, 96), accent=(103, 221, 255, 255)), "ui/inventory-slot.png")
    save(make_listing_card(), "ui/listing-card.png")
    save(make_panel((360, 280)), "ui/modal-panel.png")

    # Item and economy icons.
    save(make_coin(), "icons/gc-coin.png")
    save(make_icon_frame(crystal, bg=(13, 28, 55, 255)), "icons/stardust-token.png")
    save(make_icon_frame(recolor(crystal, (120, 92, 62, 255), 0.55)), "icons/material-ore.png")
    save(make_icon_frame(potion, bg=(18, 50, 32, 255)), "icons/potion.png")
    save(make_icon_frame(recolor(crystal, (165, 88, 236, 255), 0.28)), "icons/rare-item.png")
    save(make_icon_frame(ticket, bg=(37, 29, 55, 255)), "icons/ticket.png")

    # Lucky pack states.
    save(make_icon_frame(pack, bg=(35, 26, 50, 255)), "icons/pack-opened.png")
    burned = ImageEnhance.Brightness(pack).enhance(0.35)
    save(make_icon_frame(burned, bg=(44, 28, 28, 255), border=(180, 82, 62, 255)), "icons/pack-burned.png")
    save(make_icon_frame(pack, bg=(24, 45, 58, 255), border=(103, 221, 255, 255)), "icons/pack-listed.png")

    # Market/trading.
    save(make_stall(), "icons/market-stall.png")
    save(make_price_marker(), "icons/price-marker.png")
    save(make_lock(), "icons/trade-lock.png")
    save(make_cooldown(), "icons/cooldown.png")
    save(make_icon_frame(make_listing_card().resize((104, 52), Image.Resampling.LANCZOS)), "icons/listing-status.png")

    # Challenge.
    boss = recolor(slime.resize((220, 150), Image.Resampling.LANCZOS), (110, 35, 80, 255), 0.55)
    save(boss, "monsters/boss-slime.png")
    elite = recolor(slime.resize((220, 150), Image.Resampling.LANCZOS), (40, 120, 200, 255), 0.38)
    save(elite, "monsters/elite-slime.png")
    save(make_icon_frame(boss, bg=(42, 20, 34, 255), border=(214, 92, 116, 255)), "icons/boss-marker.png")
    save(make_icon_frame(pack, bg=(34, 32, 55, 255), border=(246, 190, 59, 255)), "icons/reward-chest.png")
    guild = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    gd = ImageDraw.Draw(guild)
    gd.polygon([(64, 18), (104, 42), (96, 102), (64, 118), (32, 102), (24, 42)], fill=(37, 70, 100, 255), outline=(214, 169, 82, 255))
    gd.polygon([(64, 34), (82, 78), (64, 66), (46, 78)], fill=(246, 190, 59, 255))
    save(make_icon_frame(guild), "icons/guild-marker.png")

    # Skills.
    attack = open_rgba("icons/skill-active-attack.png")
    save(make_icon_frame(recolor(attack, (60, 130, 255, 255), 0.30)), "icons/skill-ranged-attack.png")
    save(make_icon_frame(crystal, bg=(8, 26, 58, 255), border=(103, 221, 255, 255)), "icons/skill-magic-burst.png")
    save(make_icon_frame(potion, bg=(12, 50, 30, 255), border=(102, 238, 144, 255)), "icons/skill-healing.png")
    save(make_icon_frame(recolor(ticket, (246, 190, 59, 255), 0.35), bg=(35, 35, 28, 255)), "icons/skill-passive-mastery.png")


if __name__ == "__main__":
    main()
