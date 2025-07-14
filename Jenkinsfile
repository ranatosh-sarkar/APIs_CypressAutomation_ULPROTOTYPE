pipeline {
    agent any

    environment {
        PORT = '8082' // QA container port
    }

    stages {
        stage('Checkout Cypress Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/ranatosh-sarkar/APIs_CypressAutomation_ULPROTOTYPE.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Cypress Tests') {
            steps {
                bat '''
                call set CYPRESS_baseUrl=http://localhost:%PORT%/UL_SavingsAccount-API_prototype
                npm run cy:run
                '''
            }
        }

        stage('Run K6 Pretty Reports') {
            steps {
                bat 'npm run k6:run'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'cypress/reports/**/*.json', fingerprint: true
            publishHTML(target: [
                allowMissing: true,
                keepAll: true,
                reportDir: 'cypress/reports/html',
                reportFiles: 'mochawesome.html',
                reportName: 'Cypress Test Report'
            ])
            archiveArtifacts artifacts: 'k6-tests/result.json', fingerprint: true
        }
    }
}
