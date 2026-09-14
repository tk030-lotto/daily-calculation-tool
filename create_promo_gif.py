"""
日常計算ツール プロモーションGIF生成スクリプト
note記事およびX（旧Twitter）兼用 16:9 (1200x675)
フォント文字化け（豆腐）完全防止・UI最適化版
"""

import os
from PIL import Image, ImageDraw, ImageFont

# 画像サイズ (16:9)
WIDTH = 1200
HEIGHT = 675

# カラーパレット（ツールのデザインシステムに準拠）
BG_COLOR = (9, 9, 11)           # #09090b
CARD_BG = (18, 18, 21)          # #121215
CARD_BORDER = (39, 39, 42)      # #27272a
INPUT_BG = (24, 24, 27)         # #18181b
INPUT_BORDER = (45, 45, 50)
TEXT_WHITE = (255, 255, 255)
TEXT_GRAY = (161, 161, 170)     # #a1a1aa
TEXT_MUTED = (113, 113, 122)    # #71717a
PRIMARY_BLUE = (59, 130, 246)   # #3b82f6
ACCENT_GREEN = (16, 185, 129)   # #10b981
ACCENT_ORANGE = (245, 158, 11)  # #f59e0b
RESULT_BG = (15, 23, 42)        # ダークネイビー
RESULT_BORDER = (37, 99, 235)

# フォント設定（Windows日本語標準）
FONT_PATH = "C:/Windows/Fonts/meiryo.ttc"
if not os.path.exists(FONT_PATH):
    FONT_PATH = "C:/Windows/Fonts/YuGothM.ttc"

def get_font(size, bold=False):
    index = 1 if bold else 0
    try:
        return ImageFont.truetype(FONT_PATH, size, index=index)
    except Exception:
        try:
            return ImageFont.truetype(FONT_PATH, size)
        except Exception:
            return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    x1, y1, x2, y2 = bbox
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill, outline=outline, width=width)

def create_base_canvas(active_tab_idx=None):
    """共通の背景・ヘッダー・タブを描画したベースキャンバスを作成"""
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # 背景上部の微細なグローグラデーション
    for y in range(80):
        alpha = int(25 * (1 - y / 80))
        draw.line([(0, y), (WIDTH, y)], fill=(alpha, alpha // 2 + 10, alpha * 2 + 30))

    # ヘッダー領域
    header_y = 35
    # ロゴバッジ
    badge_w, badge_h = 105, 28
    draw_rounded_rect(draw, [50, header_y, 50 + badge_w, header_y + badge_h], radius=6, fill=(39, 39, 42))
    font_badge = get_font(13, bold=True)
    draw.text((60, header_y + 5), "DAILY CALC", font=font_badge, fill=TEXT_GRAY)

    # タイトル
    font_title = get_font(28, bold=True)
    draw.text((170, header_y - 3), "日常計算ツール", font=font_title, fill=TEXT_WHITE)

    # サブタイトル
    font_sub = get_font(15)
    draw.text((380, header_y + 6), "年齢・日付・期間・時間をひとつの画面ですばやく正確に計算", font=font_sub, fill=TEXT_GRAY)

    # ヘッダー右端のタグ
    tag_text = "● 完全クライアントサイド動作（外部送信なし）"
    tag_font = get_font(13, bold=True)
    bbox_tag = draw.textbbox((0, 0), tag_text, font=tag_font)
    tw = bbox_tag[2] - bbox_tag[0]
    draw_rounded_rect(draw, [WIDTH - 50 - tw - 24, header_y, WIDTH - 50, header_y + 28], radius=6, fill=(24, 24, 27), outline=CARD_BORDER)
    draw.text((WIDTH - 50 - tw - 12, header_y + 5), tag_text, font=tag_font, fill=ACCENT_GREEN)

    # メインカード領域
    card_x1, card_y1, card_x2, card_y2 = 50, 85, WIDTH - 50, HEIGHT - 45
    draw_rounded_rect(draw, [card_x1, card_y1, card_x2, card_y2], radius=16, fill=CARD_BG, outline=CARD_BORDER, width=2)

    # タブバー（絵文字を使わず、視認性の高いピクトマークと日本語）
    tabs = [
        ("年齢計算", "AGE"),
        ("日付計算", "DATE"),
        ("期間計算", "SPAN"),
        ("時間計算", "TIME")
    ]
    tab_w = 260
    tab_h = 48
    tab_start_x = 75
    tab_y = 105

    font_tab = get_font(17, bold=True)
    font_tab_badge = get_font(11, bold=True)

    for i, (label, badge) in enumerate(tabs):
        tx1 = tab_start_x + i * (tab_w + 16)
        tx2 = tx1 + tab_w
        is_active = (active_tab_idx == i)

        if is_active:
            fill_col = PRIMARY_BLUE
            out_col = PRIMARY_BLUE
            text_col = TEXT_WHITE
            badge_bg = (29, 78, 216)
            badge_fg = (239, 246, 255)
        else:
            fill_col = INPUT_BG
            out_col = CARD_BORDER
            text_col = TEXT_GRAY
            badge_bg = (39, 39, 42)
            badge_fg = TEXT_MUTED

        draw_rounded_rect(draw, [tx1, tab_y, tx2, tab_y + tab_h], radius=10, fill=fill_col, outline=out_col, width=1)
        
        # タブ内のミニバッジ
        draw_rounded_rect(draw, [tx1 + 14, tab_y + 13, tx1 + 60, tab_y + 35], radius=4, fill=badge_bg)
        bbox_b = draw.textbbox((0, 0), badge, font=font_tab_badge)
        bw = bbox_b[2] - bbox_b[0]
        draw.text((tx1 + 14 + (46 - bw) // 2, tab_y + 15), badge, font=font_tab_badge, fill=badge_fg)

        # タブラベル
        draw.text((tx1 + 72, tab_y + 12), label, font=font_tab, fill=text_col)

    # 下部フッター領域 (URL表示)
    footer_text = "公開URL: https://tk030-lotto.github.io/daily-calculation-tool/"
    font_footer = get_font(14)
    bbox_foot = draw.textbbox((0, 0), footer_text, font=font_footer)
    fw = bbox_foot[2] - bbox_foot[0]
    draw.text(((WIDTH - fw) // 2, HEIGHT - 32), footer_text, font=font_footer, fill=TEXT_MUTED)

    return img, draw

# ==========================================
# シーン1: イントロダクション（全体概要）
# ==========================================
def render_scene_intro():
    img, draw = create_base_canvas(active_tab_idx=None)

    # センター告知
    center_y = 185
    font_hero = get_font(34, bold=True)
    hero_text = "日常生活の「知りたい計算」を、これひとつで。"
    bbox_h = draw.textbbox((0, 0), hero_text, font=font_hero)
    hw = bbox_h[2] - bbox_h[0]
    draw.text(((WIDTH - hw) // 2, center_y), hero_text, font=font_hero, fill=TEXT_WHITE)

    # サブキャッチ
    font_hero_sub = get_font(18)
    sub_text = "電卓では面倒な日付・期間・年齢・時間の計算をブラウザ上で直感的に即時算出"
    bbox_hs = draw.textbbox((0, 0), sub_text, font=font_hero_sub)
    draw.text(((WIDTH - (bbox_hs[2] - bbox_hs[0])) // 2, center_y + 55), sub_text, font=font_hero_sub, fill=TEXT_GRAY)

    # 4つの機能紹介カード
    cards = [
        ("【年齢計算】", "生年月日と基準日から\n満年齢と経過月日を算出"),
        ("【日付計算】", "指定日数後・前の日付を\nうるう年・月末考慮で算出"),
        ("【期間計算】", "2つの日付間の総日数と\n「○年○か月○日」を同時算出"),
        ("【時間計算】", "開始・終了時刻から経過時間を\n日付またぎ対応で算出")
    ]
    card_w = 245
    card_h = 175
    start_x = 75
    y_pos = 320

    font_c_title = get_font(18, bold=True)
    font_c_desc = get_font(14)

    for i, (c_title, c_desc) in enumerate(cards):
        cx1 = start_x + i * (card_w + 30)
        cx2 = cx1 + card_w
        draw_rounded_rect(draw, [cx1, y_pos, cx2, y_pos + card_h], radius=12, fill=INPUT_BG, outline=CARD_BORDER, width=2)
        # タイトル
        draw.text((cx1 + 20, y_pos + 22), c_title, font=font_c_title, fill=PRIMARY_BLUE)
        # 下部アクセントライン
        draw.line([(cx1 + 20, y_pos + 56), (cx2 - 20, y_pos + 56)], fill=CARD_BORDER, width=1)
        # 説明
        draw.text((cx1 + 20, y_pos + 72), c_desc, font=font_c_desc, fill=TEXT_GRAY, spacing=8)

    # 最下部バッジ
    badge_str = "● インストール不要   ● サーバー登録不要   ● スマホ・PC完全レスポンシブ   ● MITライセンス"
    font_b = get_font(15, bold=True)
    bbox_b = draw.textbbox((0, 0), badge_str, font=font_b)
    draw.text(((WIDTH - (bbox_b[2] - bbox_b[0])) // 2, 545), badge_str, font=font_b, fill=ACCENT_GREEN)

    return img

# ==========================================
# 共通: 計算モック画面描画ヘルパー
# ==========================================
def render_calc_mock(tab_idx, input_fields, result_data, feature_point):
    img, draw = create_base_canvas(active_tab_idx=tab_idx)

    # 左側：入力パネル
    left_x1, left_y1, left_x2, left_y2 = 80, 180, 520, 565
    draw_rounded_rect(draw, [left_x1, left_y1, left_x2, left_y2], radius=14, fill=INPUT_BG, outline=CARD_BORDER, width=1)

    font_panel_title = get_font(18, bold=True)
    draw.text((left_x1 + 25, left_y1 + 22), "条件入力", font=font_panel_title, fill=TEXT_WHITE)

    font_label = get_font(15, bold=True)
    font_val = get_font(18, bold=True)

    curr_y = left_y1 + 68
    for label, val in input_fields:
        draw.text((left_x1 + 25, curr_y), label, font=font_label, fill=TEXT_GRAY)
        curr_y += 26
        # 入力枠モック
        draw_rounded_rect(draw, [left_x1 + 25, curr_y, left_x2 - 25, curr_y + 46], radius=8, fill=(15, 15, 18), outline=CARD_BORDER, width=1)
        draw.text((left_x1 + 40, curr_y + 11), val, font=font_val, fill=TEXT_WHITE)
        curr_y += 72

    # 計算ボタン風モック
    draw_rounded_rect(draw, [left_x1 + 25, left_y2 - 62, left_x2 - 25, left_y2 - 18], radius=8, fill=PRIMARY_BLUE)
    font_btn = get_font(16, bold=True)
    btn_text = "自動リアルタイム計算中"
    bbox_btn = draw.textbbox((0, 0), btn_text, font=font_btn)
    draw.text((left_x1 + (left_x2 - left_x1 - (bbox_btn[2] - bbox_btn[0])) // 2, left_y2 - 50), btn_text, font=font_btn, fill=TEXT_WHITE)

    # 右側：計算結果パネル
    right_x1, right_y1, right_x2, right_y2 = 560, 180, 1120, 565
    draw_rounded_rect(draw, [right_x1, right_y1, right_x2, right_y2], radius=14, fill=RESULT_BG, outline=RESULT_BORDER, width=2)

    # 計算結果バッジ
    font_res_badge = get_font(14, bold=True)
    draw_rounded_rect(draw, [right_x1 + 25, right_y1 + 20, right_x1 + 130, right_y1 + 48], radius=6, fill=(30, 58, 138))
    draw.text((right_x1 + 36, right_y1 + 25), "計算結果", font=font_res_badge, fill=(191, 219, 254))

    # メイン結果タイトル
    font_res_title = get_font(15)
    draw.text((right_x1 + 25, right_y1 + 65), result_data["main_title"], font=font_res_title, fill=TEXT_GRAY)

    # メイン結果値（大型太字）
    font_res_main = get_font(44, bold=True)
    draw.text((right_x1 + 25, right_y1 + 95), result_data["main_value"], font=font_res_main, fill=TEXT_WHITE)

    # 水平仕切り線
    draw.line([(right_x1 + 25, right_y1 + 172), (right_x2 - 25, right_y1 + 172)], fill=CARD_BORDER, width=1)

    # 詳細項目リスト（重なりを防止して配置）
    font_det_label = get_font(14, bold=True)
    font_det_val = get_font(19, bold=True)

    det_y = right_y1 + 188
    for det_label, det_val in result_data["sub_details"]:
        draw.text((right_x1 + 25, det_y), det_label, font=font_det_label, fill=TEXT_GRAY)
        draw.text((right_x1 + 25, det_y + 22), det_val, font=font_det_val, fill=ACCENT_GREEN)
        det_y += 58

    # 特徴アピールバッジ（結果カード最下部に収める）
    badge_y1 = right_y2 - 52
    badge_y2 = right_y2 - 16
    draw_rounded_rect(draw, [right_x1 + 25, badge_y1, right_x2 - 25, badge_y2], radius=8, fill=(24, 24, 27), outline=CARD_BORDER)
    font_fp = get_font(14, bold=True)
    draw.text((right_x1 + 40, badge_y1 + 8), f"POINT: {feature_point}", font=font_fp, fill=ACCENT_ORANGE)

    return img

# ==========================================
# シーン6: まとめ＆公開URL
# ==========================================
def render_scene_outro():
    img, draw = create_base_canvas(active_tab_idx=None)

    # センター
    font_outro_title = get_font(36, bold=True)
    title_text = "ブラウザで今すぐ無料で使えます"
    bbox_t = draw.textbbox((0, 0), title_text, font=font_outro_title)
    draw.text(((WIDTH - (bbox_t[2] - bbox_t[0])) // 2, 185), title_text, font=font_outro_title, fill=TEXT_WHITE)

    # サブ
    font_outro_sub = get_font(18)
    sub_text = "面倒な計算から解放。ブックマークして日常のちょっとした確認に。"
    bbox_s = draw.textbbox((0, 0), sub_text, font=font_outro_sub)
    draw.text(((WIDTH - (bbox_s[2] - bbox_s[0])) // 2, 245), sub_text, font=font_outro_sub, fill=TEXT_GRAY)

    # URL強調カード
    card_x1, card_y1, card_x2, card_y2 = 160, 310, 1040, 435
    draw_rounded_rect(draw, [card_x1, card_y1, card_x2, card_y2], radius=16, fill=(15, 23, 42), outline=PRIMARY_BLUE, width=2)

    font_url_label = get_font(15, bold=True)
    draw.text((card_x1 + 40, card_y1 + 22), "▼ GitHub Pages 公式公開URL", font=font_url_label, fill=PRIMARY_BLUE)

    font_url_main = get_font(26, bold=True)
    url_text = "https://tk030-lotto.github.io/daily-calculation-tool/"
    draw.text((card_x1 + 40, card_y1 + 58), url_text, font=font_url_main, fill=TEXT_WHITE)

    # 特徴アイコン列
    features = [
        "● スマホ＆PC両対応",
        "● 入力データ外部送信なし",
        "● 軽快・高速クライアント動作",
        "● 完全無料・MITライセンス"
    ]
    font_f = get_font(16, bold=True)
    start_x = 90
    for i, feat in enumerate(features):
        fx = start_x + i * 260
        draw.text((fx, 490), feat, font=font_f, fill=ACCENT_GREEN)

    # ハッシュタグ
    font_hash = get_font(14)
    hash_text = "#日常計算ツール  #Webツール  #便利ツール  #個人開発  #GitHub"
    bbox_h = draw.textbbox((0, 0), hash_text, font=font_hash)
    draw.text(((WIDTH - (bbox_h[2] - bbox_h[0])) // 2, 545), hash_text, font=font_hash, fill=TEXT_MUTED)

    return img

def main():
    print("フレームの生成を開始します...")
    frames = []
    durations = []

    # 1. イントロダクション (2400ms)
    frames.append(render_scene_intro())
    durations.append(2400)

    # 2. 年齢計算 (2200ms)
    img_age = render_calc_mock(
        tab_idx=0,
        input_fields=[
            ("生年月日", "1965 年 04 月 10 日"),
            ("基準日（未指定時は本日）", "2026 年 09 月 15 日")
        ],
        result_data={
            "main_title": "満年齢",
            "main_value": "満 61 歳",
            "sub_details": [
                ("暦上の経過期間", "61 年 5 か月 5 日"),
                ("次回誕生日まで", "あと 207 日")
            ]
        },
        feature_point="うるう年生まれ・誕生日当日の年齢加算も正確に判定"
    )
    frames.append(img_age)
    durations.append(2200)

    # 3. 日付計算 (2200ms)
    img_date = render_calc_mock(
        tab_idx=1,
        input_fields=[
            ("基準日", "2026 年 09 月 15 日"),
            ("日数指定", "90 日後")
        ],
        result_data={
            "main_title": "計算結果の日付",
            "main_value": "2026年 12月 14日 (月)",
            "sub_details": [
                ("指定日数", "基準日から +90 日後"),
                ("カレンダー情報", "2026年 第51週 / 年末まで残り17日")
            ]
        },
        feature_point="月末日、年末年始、うるう年の日数を正確に考慮"
    )
    frames.append(img_date)
    durations.append(2200)

    # 4. 期間計算 (2200ms)
    img_period = render_calc_mock(
        tab_idx=2,
        input_fields=[
            ("開始日", "2025 年 04 月 10 日"),
            ("終了日", "2026 年 09 月 15 日")
        ],
        result_data={
            "main_title": "2つの日付の間の総日数",
            "main_value": "523 日間",
            "sub_details": [
                ("暦上の期間表現", "1 年 5 か月 5 日"),
                ("週数換算", "74 週 と 5 日")
            ]
        },
        feature_point="プロジェクト期間・契約期間・記念日の確認に最適"
    )
    frames.append(img_period)
    durations.append(2200)

    # 5. 時間計算 (2200ms)
    img_time = render_calc_mock(
        tab_idx=3,
        input_fields=[
            ("開始時刻", "22 : 00"),
            ("終了時刻 (翌日ON)", "02 : 30  [翌日]")
        ],
        result_data={
            "main_title": "経過時間",
            "main_value": "4 時間 30 分",
            "sub_details": [
                ("総分数", "270 分"),
                ("計算条件", "夜間日付またぎ（翌日）対応済み")
            ]
        },
        feature_point="深夜勤務・長距離移動など日付をまたぐ計算も即座に対応"
    )
    frames.append(img_time)
    durations.append(2200)

    # 6. アウトロ・公開URL (2800ms)
    frames.append(render_scene_outro())
    durations.append(2800)

    # GIF出力
    output_filename = "daily_calc_promo.gif"
    print(f"{output_filename} を生成中...")
    
    optimized_frames = [f.convert("P", palette=Image.ADAPTIVE, colors=256) for f in frames]
    
    optimized_frames[0].save(
        output_filename,
        save_all=True,
        append_images=optimized_frames[1:],
        duration=durations,
        loop=0,
        optimize=True
    )

    size_kb = os.path.getsize(output_filename) / 1024
    print(f"生成完了: {output_filename} ({size_kb:.1f} KB, フレーム数: {len(frames)})")

if __name__ == "__main__":
    main()
