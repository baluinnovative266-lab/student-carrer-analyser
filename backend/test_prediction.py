import requests
import json

API_URL = "http://localhost:8000"

def test_predict_career():
    data = {
        "math_score": 85,
        "programming_score": 90,
        "communication_score": 70,
        "problem_solving_score": 80,
        "interest_coding": 9,
        "interest_design": 5,
        "interest_management": 4
    }
    
    response = requests.post(f"{API_URL}/api/predict-career", json=data)
    
    print(f"Status Code: {response.status_code}")
    res_json = response.json()
    print(f"Career: {res_json.get('predicted_career')}")
    print("Radar Data Keys:", res_json.get('radar_data')[0].keys() if res_json.get('radar_data') else "None")
    print("Roadmap Length:", len(res_json.get('recommended_roadmap', [])))
    
    assert response.status_code == 200
    assert "radar_data" in res_json
    assert "recommended_roadmap" in res_json
    assert len(res_json["radar_data"]) > 0

if __name__ == "__main__":
    try:
        test_predict_career()
        print("Test passed!")
    except Exception as e:
        print(f"Test failed: {e}")
