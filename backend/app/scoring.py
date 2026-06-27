def get_grade(score):

    if score >= 90:
        return "A"

    elif score >= 80:
        return "B"

    elif score >= 70:
        return "C"

    elif score >= 60:
        return "D"

    else:
        return "F"



def calculate_score(metrics):

    seo_score = 100
    accessibility_score = 100
    ux_score = 100


    # =====================
    # SEO SCORE
    # =====================

    seo = metrics.get("seo", {})


    # Missing meta title
    if not seo.get("meta_title"):
        seo_score -= 20


    # Missing meta description
    if not seo.get("meta_description"):
        seo_score -= 15


    # H1 validation
    h1_count = seo.get("h1_count", 0)

    if h1_count == 0:
        seo_score -= 25

    elif h1_count > 1:
        seo_score -= min(
            (h1_count - 1) * 8,
            20
        )


    # H2 structure
    h2_count = seo.get("h2_count", 0)

    if h2_count == 0:
        seo_score -= 15


    # Too many headings
    h3_count = seo.get("h3_count", 0)

    if h3_count > 20:
        seo_score -= 5



    # =====================
    # ACCESSIBILITY SCORE
    # =====================

    images = metrics.get("images", {})


    image_count = images.get(
        "image_count",
        0
    )


    missing_alt_percentage = images.get(
        "missing_alt_percentage",
        0
    )


    if image_count > 0:

        if missing_alt_percentage <= 10:
            accessibility_score -= 0

        elif missing_alt_percentage <= 30:
            accessibility_score -= 20

        elif missing_alt_percentage <= 50:
            accessibility_score -= 40

        elif missing_alt_percentage <= 75:
            accessibility_score -= 60

        else:
            accessibility_score -= 80



    # =====================
    # UX SCORE
    # =====================

    links = metrics.get("links", {})


    ctas = links.get(
        "cta_count",
        0
    )


    # CTA density
    if ctas > 60:
        ux_score -= 25

    elif ctas > 40:
        ux_score -= 15

    elif ctas > 25:
        ux_score -= 5



    word_count = (
        metrics
        .get("content", {})
        .get("word_count", 0)
    )


    # Content length
    if word_count > 3000:
        ux_score -= 20

    elif word_count > 2000:
        ux_score -= 10


    if word_count < 100:
        ux_score -= 10



    # =====================
    # NORMALIZE
    # =====================

    seo_score = max(
        round(seo_score),
        0
    )


    accessibility_score = max(
        round(accessibility_score),
        0
    )


    ux_score = max(
        round(ux_score),
        0
    )



    # =====================
    # FINAL SCORE
    # =====================

    overall = round(
        (
            seo_score * 0.35 +
            accessibility_score * 0.40 +
            ux_score * 0.25
        )
    )


    return {

        "seo_score": seo_score,

        "accessibility_score":
            accessibility_score,

        "ux_score": ux_score,

        "overall_score": overall,

        "grade": get_grade(overall)

    }