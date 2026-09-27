from fastapi import APIRouter, HTTPException
from app.demo.scenarios import DemoScenarios
from app.schemas.common import APIResponse

router = APIRouter(prefix="/demo", tags=["Demonstration Scenarios"])


@router.get("/scenarios", response_model=APIResponse[list])
def list_demo_scenarios():
    scenarios = [
        {"id": "scenario_a", "title": "Scenario A - Gat 142/2, Hiware Bazar, Nagar Rural, Ahilyanagar (Low Risk, Clean Title)"},
        {"id": "scenario_b", "title": "Scenario B - Gat 215/1, Palashi, Koregaon, Satara (High Risk, Boundary Overlap)"},
        {"id": "scenario_c", "title": "Scenario C - Gat 76/2, Wadner Gangai, Daryapur, Amravati (Critical Risk, PACS Loan Lien)"}
    ]
    return APIResponse(data=scenarios, message="Retrieved 3 synthetic rural Maharashtra demo scenarios.")


@router.get("/scenarios/{scenario_id}", response_model=APIResponse[dict])
def get_demo_scenario(scenario_id: str):
    sid = scenario_id.lower().strip()
    if sid in ("scenario_a", "a"):
        data = DemoScenarios.get_scenario_a()
    elif sid in ("scenario_b", "b"):
        data = DemoScenarios.get_scenario_b()
    elif sid in ("scenario_c", "c"):
        data = DemoScenarios.get_scenario_c()
    else:
        raise HTTPException(status_code=404, detail=f"Scenario '{scenario_id}' not found. Available: scenario_a, scenario_b, scenario_c.")

    return APIResponse(data=data, message=f"Loaded {data['scenario_name']} (DEMO / SYNTHETIC DATA).")
