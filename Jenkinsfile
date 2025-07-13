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
                set CYPRESS_baseUrl=http://localhost:%PORT%/UL_SavingsAccount-API_prototype
                npx cypress run ^
                  --reporter mochawesome ^
                  --reporter-options "reportDir=cypress/reports/html,overwrite=false,html=true,json=true" ^
                || exit 0
                '''
            }
        }

        stage('Publish Cypress Report') {
            steps {
                publishHTML(target: [
                    allowMissing: true,
                    keepAll: true,
                    reportDir: 'cypress/reports/html',
                    reportFiles: 'mochawesome.html',
                    reportName: 'Cypress QA Report'
                ])
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'cypress/reports/**/*.json', fingerprint: true
        }
    }
}
