
import requests
  
api_key = "67ff83ec56016aca8b22312b"
url = "https://api.scrapingdog.com/linkedin"
  
params = {
      "api_key": api_key,
      "type": "profile",
      "linkId": "deepak-kumar-mohanty-09aa59230",
      "private": "false"
  }
  
response = requests.get(url, params=params)
  
if response.status_code == 200:
      data = response.json()
      print(data)
else:
      print(f"Request failed with status code: {response.status_code}")