import logging
import httpx
from typing import List, Dict, Any
from urllib.parse import urlparse
from app.config.settings import settings
from app.security.ssrf import is_safe_url, normalize_url

logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self):
        self.provider = settings.SEARCH_PROVIDER.lower()

    def search(self, query: str, max_results: int = 5, focus: str = "general") -> List[Dict[str, Any]]:
        """
        Execute web search according to configured provider.
        Returns a list of dicts with title, url, domain, snippet, source_type, publication_date.
        """
        results = []
        try:
            if self.provider == "tavily" and settings.TAVILY_API_KEY:
                results = self._search_tavily(query, max_results)
            elif self.provider == "serper" and settings.SERPER_API_KEY:
                results = self._search_serper(query, max_results)
            elif self.provider == "duckduckgo":
                results = self._search_duckduckgo(query, max_results)
            elif self.provider == "demo":
                results = self._search_demo(query, max_results, focus)
            else:
                # Fallback to duckduckgo if available, or demo mode
                try:
                    results = self._search_duckduckgo(query, max_results)
                except Exception as ddg_err:
                    logger.warning(f"DuckDuckGo search failed ({ddg_err}), falling back to transparent demo search.")
                    results = self._search_demo(query, max_results, focus)
        except Exception as e:
            logger.error(f"Search provider '{self.provider}' encountered error: {e}")
            results = self._search_demo(query, max_results, focus)

        # Sanitize and deduplicate results
        deduped = []
        seen_urls = set()
        for item in results:
            raw_url = item.get("url", "")
            norm_url = normalize_url(raw_url)
            
            # Check for valid and safe URL (allow placeholder demo domain in demo mode)
            if item.get("source_type") != "mock_demo" and not is_safe_url(raw_url):
                continue
                
            if norm_url in seen_urls:
                continue
            seen_urls.add(norm_url)
            
            parsed = urlparse(raw_url)
            item["url"] = norm_url
            item["domain"] = parsed.netloc or "source.internal"
            deduped.append(item)

        return deduped[:max_results]

    def _search_duckduckgo(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        try:
            from ddgs import DDGS
        except ImportError:
            from duckduckgo_search import DDGS
        results = []
        with DDGS() as ddgs:
            raw_results = list(ddgs.text(query, max_results=max_results))
            for r in raw_results:
                results.append({
                    "title": r.get("title", "Untitled Source"),
                    "url": r.get("href", ""),
                    "snippet": r.get("body", ""),
                    "source_type": "web",
                    "publication_date": None,
                    "reliability_score": 0.9,
                })
        return results

    def _search_tavily(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        url = "https://api.tavily.com/search"
        payload = {
            "api_key": settings.TAVILY_API_KEY,
            "query": query,
            "search_depth": "advanced",
            "max_results": max_results,
        }
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            results = []
            for item in data.get("results", []):
                results.append({
                    "title": item.get("title", ""),
                    "url": item.get("url", ""),
                    "snippet": item.get("content", ""),
                    "source_type": "web",
                    "publication_date": item.get("published_date"),
                    "reliability_score": float(item.get("score", 0.9)),
                })
            return results

    def _search_serper(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        url = "https://google.serper.dev/search"
        headers = {
            "X-API-KEY": settings.SERPER_API_KEY,
            "Content-Type": "application/json",
        }
        payload = {"q": query, "num": max_results}
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            results = []
            for item in data.get("organic", []):
                results.append({
                    "title": item.get("title", ""),
                    "url": item.get("link", ""),
                    "snippet": item.get("snippet", ""),
                    "source_type": "web",
                    "publication_date": item.get("date"),
                    "reliability_score": 0.9,
                })
            return results

    def _search_demo(self, query: str, max_results: int, focus: str) -> List[Dict[str, Any]]:
        """
        Transparent demo evidence provider for offline testing, CI, or when API credentials are absent.
        Explicitly marked with source_type='mock_demo'.
        """
        logger.info(f"Using transparent Demo Search Provider for query: '{query}'")
        curated_knowledge = [
            {
                "title": f"Technical Architecture & Benchmarks: {query[:40]}",
                "url": f"https://research-archive.example.org/study/{abs(hash(query)) % 10000}",
                "snippet": f"Empirical analysis regarding '{query}'. Findings indicate robust modular orchestration, distributed state management, and reliable multi-agent consensus mechanisms are critical for production performance.",
                "source_type": "mock_demo",
                "publication_date": "2024-09-15",
                "reliability_score": 0.88,
            },
            {
                "title": f"Comparative Evaluation and Industry Standards on {query[:40]}",
                "url": f"https://standards-institute.example.org/reports/ai-{abs(hash(query)) % 8000}",
                "snippet": f"A comparative study addressing '{query}'. Emphasizes strict schema validation, structured citation tracking, and deterministic error recovery over black-box agent loops.",
                "source_type": "mock_demo",
                "publication_date": "2024-10-01",
                "reliability_score": 0.92,
            },
            {
                "title": f"Deployment Challenges, Security, and Scalability in {query[:40]}",
                "url": f"https://systems-journal.example.org/papers/{abs(hash(query)) % 9999}",
                "snippet": f"Investigation of security constraints and latency overhead in multi-stage AI workflows. Highlights prompt injection isolation, SSRF prevention, and verified grounding.",
                "source_type": "mock_demo",
                "publication_date": "2024-10-18",
                "reliability_score": 0.85,
            },
            {
                "title": f"Emerging Frontiers & Real-World Implementations: {query[:40]}",
                "url": f"https://ai-frontier-review.example.org/analysis/{abs(hash(query)) % 7777}",
                "snippet": f"Field study on '{query}' demonstrating tangible trade-offs between latency, hallucination rate, and execution complexity in agentic pipelines.",
                "source_type": "mock_demo",
                "publication_date": "2024-10-12",
                "reliability_score": 0.89,
            }
        ]
        return curated_knowledge[:max_results]

search_service = SearchService()
