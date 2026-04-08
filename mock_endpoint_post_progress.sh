set -x
curl -X POST https://cybermaze-backend.davylis.com/api/progress \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "584b116d-85c8-461c-a011-4bad3a19aa74",
    "points": 150,
    "currentTask": 3,
    "case1Score": 10,
    "case2Score": 15,
    "case3Score": 20,
    "case4Score": 12,
    "case5Score": 18,
    "case6Score": 14,
    "case7Score": 16,
    "case8Score": 11,
    "case9Score": 9,
    "case10Score": 13,
    "case11Score": 678,
    "case5Choices": ["A", "C"],
    "case6Choices": ["B"],
    "case7Choices": ["D", "A"],
    "case8Choices": [],
    "case9Choices": ["C"],
    "case10Choices": ["B", "D"],
    "case11Choices": ["A"],
    "elapsedSeconds": 568,
    "status": "in_progress"
  }'