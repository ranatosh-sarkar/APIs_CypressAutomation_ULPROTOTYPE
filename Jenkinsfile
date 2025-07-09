pipeline {
    agent any

    stages {
        stage('Checkout') {
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
                bat 'npx cypress run --reporter mochawesome --reporter-options "reportDir=cypress/reports/html,overwrite=false,html=true,json=false"'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'cypress/reports/**/*.json', fingerprint: true
            // junit 'cypress/reports/**/*.xml'   // <-- COMMENT THIS unless using mocha-junit-reporter
            publishHTML(target: [
                allowMissing: true,
                keepAll: true,
                reportDir: 'cypress/reports/html',
                reportFiles: 'mochawesome.html',
                reportName: 'Cypress Test Report'
            ])
        }
    }
}
