import requests

API_URL = "http://localhost:8000"

def test_upload_empty_file():
    # Create an empty file
    with open("empty.txt", "w") as f:
        pass

    files = {'file': ('empty.txt', open('empty.txt', 'rb'), 'text/plain')}
    response = requests.post(f"{API_URL}/api/analyze-resume", files=files)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 400
    assert response.json()['success'] == False
    assert "couldn’t read text" in response.json()['message']

if __name__ == "__main__":
    try:
        test_upload_empty_file()
        print("Test passed!")
    except Exception as e:
        print(f"Test failed: {e}")
