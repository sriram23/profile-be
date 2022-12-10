const scanner = require('sonarqube-scanner');

scanner(
    {
        serverUrl: 'http://localhost:9000',
        token: "303a3827384d08fa845caa2449ad1809c9d64201",
        options: {
            'sonar.projectName': 'sriram_website_be',
            'sonar.projectDescription': 'This is a simple express server',
            'sonar.projectKey': 'sriram_website_be',
            'sonar.projectVersion': '0.0.1',
            'sonar.exclusions': '',
            'sonar.sourceEncoding': 'UTF-8',
        }
    },
    () => process.exit()
)