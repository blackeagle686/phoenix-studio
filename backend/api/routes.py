from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from backend.services.generator import generate_code
from backend.services.packager import package_project

router = APIRouter()

class GraphPayload(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    template_type: Optional[str] = "raw"
    primary_color: Optional[str] = "#00f2fe"
    theme_mode: Optional[str] = "dark"

@router.get("/status")
async def get_status():
    return {"message": "API is online"}

@router.post("/preview")
async def preview_code(payload: GraphPayload):
    try:
        code = generate_code(payload.model_dump())
        return {"code": code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/generate")
async def generate_project(payload: GraphPayload):
    try:
        zip_buffer = package_project(payload.model_dump())
        return StreamingResponse(
            zip_buffer,
            media_type="application/x-zip-compressed",
            headers={"Content-Disposition": "attachment; filename=phoenix_agent.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Packaging failed: {str(e)}")

class RunPayload(BaseModel):
    graph: GraphPayload
    message: str
    session_id: Optional[str] = "default"

@router.post("/run")
async def run_flow(payload: RunPayload):
    try:
        from backend.services.runner import run_agent_graph
        result = await run_agent_graph(
            graph=payload.graph.model_dump(),
            user_message=payload.message,
            session_id=payload.session_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Run failed: {str(e)}")
