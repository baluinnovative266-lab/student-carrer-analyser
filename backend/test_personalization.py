import requests
import json

BASE_URL = "http://localhost:8000/api"

# Test Case 1: High programming/math scores (should predict Software Engineer or Data Scientist)
test_case_1 = {
    "math_score": 95,
    "programming_score": 90,
    "communication_score": 60,
    "problem_solving_score": 85,
    "interest_coding": 9,
    "interest_design": 3,
    "interest_management": 4
}

# Test Case 2: High design/communication scores (should predict UI/UX Designer)
test_case_2 = {
    "math_score": 65,
    "programming_score": 55,
    "communication_score": 92,
    "problem_solving_score": 70,
    "interest_coding": 4,
    "interest_design": 10,
    "interest_management": 6
}

# Test Case 3: Management focused (should predict Product Manager)
test_case_3 = {
    "math_score": 70,
    "programming_score": 60,
    "communication_score": 88,
    "problem_solving_score": 75,
    "interest_coding": 5,
    "interest_design": 5,
    "interest_management": 10
}

def test_prediction(test_case, name):
    print(f"\n{'='*60}")
    print(f"Testing: {name}")
    print(f"{'='*60}")
    print(f"Input: Math={test_case['math_score']}, Prog={test_case['programming_score']}, "
          f"Comm={test_case['communication_score']}, PS={test_case['problem_solving_score']}")
    print(f"Interests: Coding={test_case['interest_coding']}, Design={test_case['interest_design']}, "
          f"Mgmt={test_case['interest_management']}")
    
    try:
        response = requests.post(f"{BASE_URL}/predict-career", json=test_case)
        response.raise_for_status()
        result = response.json()
        
        print(f"\n✅ Predicted Career: {result['predicted_career']}")
        print(f"📊 Match Score: {result.get('career_match_score', 'N/A'):.1f}%")
        print(f"🎯 Next Skill: {result.get('next_recommended_skill', 'N/A')}")
        print(f"💯 Confidence: {result.get('confidence', 'N/A'):.1f}%")
        
        print(f"\nTop 3 Career Probabilities:")
        for i, prob in enumerate(result.get('probabilities', [])[:3], 1):
            print(f"  {i}. {prob['name']}: {prob['prob']:.1f}%")
        
        return result
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    print("Testing Career Prediction Personalization")
    print("=" * 60)
    
    result1 = test_prediction(test_case_1, "High Programming Skills")
    result2 = test_prediction(test_case_2, "High Design Skills")
    result3 = test_prediction(test_case_3, "Management Focus")
    
    print(f"\n{'='*60}")
    print("VERIFICATION SUMMARY")
    print(f"{'='*60}")
    
    if result1 and result2:
        career1 = result1.get('predicted_career')
        career2 = result2.get('predicted_career')
        match1 = result1.get('career_match_score', 0)
        match2 = result2.get('career_match_score', 0)
        
        print(f"✅ Different careers predicted: {career1 != career2} ({career1} vs {career2})")
        print(f"✅ Different match scores: {abs(match1 - match2) > 5} ({match1:.1f}% vs {match2:.1f}%)")
        print(f"✅ Chart data present: {bool(result1.get('probability_chart_data'))}")
        print(f"✅ Skill comparison data: {bool(result1.get('skill_comparison_data'))}")
        
        if career1 != career2 and abs(match1 - match2) > 5:
            print(f"\n🎉 SUCCESS! Predictions are personalized and working correctly!")
        else:
            print(f"\n⚠️ WARNING: Results may still be too similar")
    else:
        print("❌ Tests failed to run")
