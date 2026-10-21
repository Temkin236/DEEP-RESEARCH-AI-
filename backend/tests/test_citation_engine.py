import pytest
from app.services.citation_engine import citation_engine

def test_register_sources_deduplication():
    raw = [
        {"title": "Source 1", "url": "https://example.com/page1", "snippet": "Text 1"},
        {"title": "Source 1 Duplicate", "url": "https://example.com/page1/", "snippet": "Text 1 Duplicate"},
        {"title": "Source 2", "url": "https://example.com/page2", "snippet": "Text 2"},
    ]
    registered = citation_engine.register_sources(raw)
    assert len(registered) == 2
    assert registered[0]["index"] == 1
    assert registered[1]["index"] == 2

def test_validate_citations_strips_hallucinated_markers():
    raw_sources = [
        {"title": "Source Alpha", "url": "https://example.com/alpha", "snippet": "Fact A"}
    ]
    registered = citation_engine.register_sources(raw_sources)

    # Markdown cites [1] (valid) and [99] (hallucinated)
    input_md = "We found evidence [1]. But also fake evidence [99]."
    cleaned_md, active_cites, warnings = citation_engine.validate_citations_in_text(
        markdown_text=input_md,
        registered_sources=registered
    )

    assert "[1]" in cleaned_md
    assert "[99]" not in cleaned_md
    assert len(active_cites) == 1
    assert len(warnings) == 1
    assert "References and Sources" in cleaned_md
