set -x
curl -X POST 'https://cybermaze-backend.davylis.com/api/session' \
-H 'Content-Type: application/json' \
-d '{
"participantCode": "ABC123",
"name": "Jane Doe",
"degree": "BSc Computer Science",
"ageGroup": "25-34",
"agree": true
}'