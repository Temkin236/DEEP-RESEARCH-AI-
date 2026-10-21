import logging
from typing import List, Dict, Any, Optional
from app.services.search_service import search_service
from app.services.document_service import document_service
from app.schemas.research import PlannerOutput, ResearcherOutput, ResearcherEvidence

logger = logging.getLogger(__name__)

class ResearcherAgent:
    """
    Agent 2: Researcher
    Executes web searches and document RAG queries across each planned subtask,
    gathering verifiable source snippets, publication dates, and URLs.
    """

    def conduct_research(
        self,
        plan: PlannerOutput,
        max_sources_total: int = 8,
        focus: str = "general",
        selected_documents: Optional[List[str]] = None,
    ) -> ResearcherOutput:
        logger.info(f"ResearcherAgent executing research for {len(plan.subtasks)} subtasks")
        collected_evidences: List[ResearcherEvidence] = []
        seen_urls = set()
        unresolved_queries: List[str] = []

        # Sources per subtask allocation
        sources_per_subtask = max(2, max_sources_total // max(1, len(plan.subtasks)))

        # 1. Gather relevant passages from user-uploaded documents if provided
        if selected_documents:
            logger.info(f"Querying document RAG for {len(selected_documents)} documents")
            for subtask in plan.subtasks:
                doc_results = document_service.query_similar(
                    query=subtask.subquestion,
                    document_ids=selected_documents,
                    n_results=2
                )
                for doc in doc_results:
                    doc_pseudo_url = f"document://{doc['document_id']}#chunk-{doc['chunk_index']}"
                    if doc_pseudo_url not in seen_urls:
                        seen_urls.add(doc_pseudo_url)
                        collected_evidences.append(
                            ResearcherEvidence(
                                subquestion=subtask.subquestion,
                                title=f"User Document: {doc['filename']} (Section {doc['chunk_index']+1})",
                                url=doc_pseudo_url,
                                domain="document.internal",
                                snippet=doc["content"],
                                publication_date=None,
                                reliability_assessment="high"
                            )
                        )

        # 2. Gather web evidence for each subtask
        for subtask in plan.subtasks:
            subtask_collected = 0
            for q in subtask.search_queries:
                if subtask_collected >= sources_per_subtask:
                    break
                try:
                    search_results = search_service.search(
                        query=q,
                        max_results=sources_per_subtask - subtask_collected,
                        focus=focus
                    )
                    for item in search_results:
                        url = item.get("url", "")
                        if not url or url in seen_urls:
                            continue
                        seen_urls.add(url)
                        collected_evidences.append(
                            ResearcherEvidence(
                                subquestion=subtask.subquestion,
                                title=item.get("title", "Untitled Source"),
                                url=url,
                                domain=item.get("domain", ""),
                                snippet=item.get("snippet", ""),
                                publication_date=item.get("publication_date"),
                                reliability_assessment="high" if item.get("reliability_score", 0.9) >= 0.85 else "medium"
                            )
                        )
                        subtask_collected += 1
                        if len(collected_evidences) >= max_sources_total:
                            break
                except Exception as e:
                    logger.warning(f"Query failed: '{q}' error: {e}")
                    unresolved_queries.append(q)

                if len(collected_evidences) >= max_sources_total:
                    break
            if len(collected_evidences) >= max_sources_total:
                break

        return ResearcherOutput(
            evidences=collected_evidences,
            unresolved_queries=unresolved_queries
        )

researcher_agent = ResearcherAgent()
