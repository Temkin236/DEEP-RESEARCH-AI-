import re
import logging
from typing import List, Dict, Any, Tuple
from app.security.ssrf import normalize_url

logger = logging.getLogger(__name__)

class CitationEngine:
    """
    Evidence registry and citation verification engine.
    Ensures that every claim in the report is grounded in the collected evidence
    and that no hallucinated citations or unverified URLs are included.
    """

    def register_sources(self, raw_sources: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Normalize, deduplicate, and assign numeric indices [1], [2], etc., to sources.
        """
        registered = []
        seen_urls = set()

        for s in raw_sources:
            norm_url = normalize_url(s.get("url", ""))
            if norm_url in seen_urls:
                continue
            seen_urls.add(norm_url)

            source_entry = {
                "id": s.get("id"),
                "index": len(registered) + 1,
                "title": s.get("title", "Untitled Source"),
                "url": norm_url,
                "domain": s.get("domain", ""),
                "snippet": s.get("snippet", ""),
                "source_type": s.get("source_type", "web"),
                "publication_date": s.get("publication_date"),
                "reliability_score": s.get("reliability_score", 0.9),
                "subquestion": s.get("subquestion", ""),
            }
            registered.append(source_entry)

        return registered

    def validate_citations_in_text(self, markdown_text: str, registered_sources: List[Dict[str, Any]]) -> Tuple[str, List[Dict[str, Any]], List[str]]:
        """
        Inspect markdown text for citation markers like [1], [2] or [[1]].
        Verify each citation against the registered sources.
        Returns:
            - validated_markdown: Markdown with verified citation chips and removed hallucinated refs
            - active_citations: List of source entries actually cited in text
            - warnings: List of flagged citation anomalies
        """
        warnings = []
        valid_indices = {s["index"]: s for s in registered_sources}
        cited_indices = set()

        # Find all brackets containing single numbers e.g. [1], [2], [1, 2]
        citation_pattern = re.compile(r'\[(\d+(?:\s*,\s*\d+)*)\]')

        def replace_citation(match):
            raw_nums = match.group(1).split(',')
            verified_nums = []
            for num_str in raw_nums:
                num_str = num_str.strip()
                if not num_str.isdigit():
                    continue
                idx = int(num_str)
                if idx in valid_indices:
                    cited_indices.add(idx)
                    verified_nums.append(str(idx))
                else:
                    warnings.append(f"Removed ungrounded citation marker [{idx}]: No matching source in evidence registry.")
            
            if verified_nums:
                return f"[{', '.join(verified_nums)}]"
            return ""

        cleaned_markdown = citation_pattern.sub(replace_citation, markdown_text)

        active_citations = [valid_indices[i] for i in sorted(cited_indices)]

        # Append references section if not already present
        if active_citations and "## References" not in cleaned_markdown and "## Sources" not in cleaned_markdown:
            ref_section = "\n\n## References and Sources\n"
            for s in active_citations:
                domain_info = f" ({s['domain']})" if s.get('domain') else ""
                date_info = f" - Published: {s['publication_date']}" if s.get('publication_date') else ""
                ref_section += f"- **[{s['index']}]** [{s['title']}]({s['url']}){domain_info}{date_info}\n"
            cleaned_markdown += ref_section

        return cleaned_markdown, active_citations, warnings

citation_engine = CitationEngine()
